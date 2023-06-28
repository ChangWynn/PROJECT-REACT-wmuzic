import React from "react";
import { useEffect, useRef, useState } from "react";
import styles from "./css/MusicPlayer.module.css";
import Controls from "../../components/Controls";

import { ref, getDownloadURL, uploadBytes, listAll } from "firebase/storage";
import { auth, storage } from "../../config/firebase";

const MusicPlayer = () => {
  const [songIsPlaying, setSongIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [songProgression, setSongProgression] = useState(0);
  const [bufferProgression, setBufferProgression] = useState(0);

  const [songsList, setSongsList] = useState([]);
  const [uploadedSong, setUploadedSong] = useState(null);

  const currentSong = useRef();

  const uploadSong = async () => {
    const userStorage = ref(
      storage,
      `USER-UID-${auth.currentUser.uid}/${uploadedSong.name}`
    );

    try {
      await uploadBytes(userStorage, uploadedSong);
      updateSongsList();
    } catch (err) {
      console.log(err);
    }
  };

  const updateSongsList = async () => {
    const userSongsRef = ref(storage, `USER-UID-${auth.currentUser.uid}`);
    const songsRef = await listAll(userSongsRef);

    songsRef.items.forEach((itemRef) => {
      getDownloadURL(itemRef).then((url) => {
        setSongsList((currentURL) => {
          return [...currentURL, url];
        });
      });
    });
  };

  // fetch all users songs
  useEffect(() => {
    updateSongsList();

    return () => setSongsList([]);
  }, []);

  const updateBufferProgression = ({ buffered, duration }) => {
    if (buffered.length > 0) {
      for (let i = 0; i < buffered.length; i++) {
        const bufferProgression = (buffered.end(i) / duration) * 100;
        setBufferProgression(bufferProgression);
      }
    }
  };

  const updateSongProgression = ({ currentTime, duration }) => {
    const songProgress = ((currentTime / duration) * 100).toFixed(2);
    setSongProgression(songProgress);
  };

  // update progress bar
  useEffect(() => {
    const song = currentSong?.current;

    const updateProgressBar = () => {
      updateSongProgression(song);
      updateBufferProgression(song);
    };

    let interval;
    if (songIsPlaying) {
      song.play();
      interval = setInterval(updateProgressBar, 1000);
    } else {
      song.pause();
    }

    return () => {
      return clearInterval(interval);
    };
  }, [songIsPlaying, currentSongIndex]);

  // playlist navigation
  const togglePlay = () => {
    setSongIsPlaying(!songIsPlaying);
  };

  const nextSong = () => {
    if (currentSongIndex === songsList.length - 1) setCurrentSongIndex(0);
    else {
      setCurrentSongIndex((currentIndex) => {
        return currentIndex + 1;
      });
    }
  };

  const previousSong = () => {
    if (currentSongIndex === 0) setCurrentSongIndex(songsList.length - 1);
    else {
      setCurrentSongIndex((currentIndex) => {
        return currentIndex - 1;
      });
    }
  };

  // click on track
  const navigateInSong = (e) => {
    const width = e.target.clientWidth;
    const clickOffset = e.nativeEvent.offsetX;
    const newCurrentTime = (clickOffset / width) * currentSong.current.duration;
    const newSongProgress = (clickOffset / width) * 100;

    currentSong.current.currentTime = newCurrentTime;
    setSongProgression(newSongProgress);
  };

  return (
    <div className={styles["app"]}>
      <audio
        ref={currentSong}
        // src={audioFiles[currentSongIndex].track()}
        src={songsList[currentSongIndex]}
        onEnded={nextSong}
      ></audio>
      <div className={styles["track--container"]}>
        <div className={styles["track--background"]}>
          <div onClick={navigateInSong} className={styles["track--overlay"]} />
          <div
            style={{ width: bufferProgression + "%" }}
            className={styles["track--buffer"]}
          />
          <div
            style={{ width: songProgression + "%" }}
            className={styles["track--progress"]}
          />
        </div>
      </div>
      <input
        type="file"
        onChange={(e) => {
          setUploadedSong(e.target.files[0]);
        }}
      />
      <button onClick={uploadSong}>Upload</button>
      <Controls
        previousSong={previousSong}
        nextSong={nextSong}
        togglePlay={togglePlay}
        songIsPlaying={songIsPlaying}
      />
    </div>
  );
};

export default MusicPlayer;
