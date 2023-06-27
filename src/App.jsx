import { useEffect, useRef, useState } from "react";
import styles from "./App.module.css";
import audioFiles from "./assets/audioFiles";

const App = () => {
  const [songIsPlaying, setSongIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const currentSong = useRef();

  console.log("currentsong", audioFiles.length);

  useEffect(() => {
    if (songIsPlaying) currentSong.current.play();
    else currentSong.current.pause();
  }, [songIsPlaying, currentSongIndex]);

  const togglePlay = () => {
    setSongIsPlaying(!songIsPlaying);
  };

  const nextSong = () => {
    if (currentSongIndex === audioFiles.length - 1) {
      setCurrentSongIndex(0);
    } else {
      setCurrentSongIndex((currentIndex) => {
        return currentIndex + 1;
      });
    }
  };

  const previousSong = () => {
    if (currentSongIndex === 0) {
      setCurrentSongIndex(audioFiles.length - 1);
    } else {
      setCurrentSongIndex((currentIndex) => {
        return currentIndex - 1;
      });
    }
  };

  return (
    <div className={styles["app"]}>
      <audio
        ref={currentSong}
        src={audioFiles[currentSongIndex].track()}
      ></audio>
      <button onClick={previousSong}>Prev</button>
      <button onClick={togglePlay}>{songIsPlaying ? "Pause" : "Play"}</button>
      <button onClick={nextSong}>Next</button>
    </div>
  );
};

export default App;
