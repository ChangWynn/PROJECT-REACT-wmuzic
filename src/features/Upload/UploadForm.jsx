import styles from "./UploadForm.module.css";
import axios from "../../services/axios";
import { apiKey } from "../../.api";
import { Context } from "../App/MusicPlayer";

import React, { useContext, useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";

import { storage } from "../../config/firebase";
import { ref, uploadBytes, updateMetadata } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlbum } from "@fortawesome/pro-solid-svg-icons";

const UploadForm = ({ showForm, setShowForm }) => {
  const { uid } = useOutletContext();
  const { songRefs, setSongRefs } = useContext(Context);
  const [uploadedSong, setUploadedSong] = useState(null);
  const [uploadedSongDuration, setUploadedSongDuration] = useState(0);
  const [isChecked, setIsChecked] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const titleRef = useRef();
  const artistRef = useRef();

  const uploadedFile = useRef();

  useEffect(() => {
    if (uploadedSong) {
      const audio = new Audio();
      audio.src = URL.createObjectURL(uploadedSong);
      audio.addEventListener("loadedmetadata", () => {
        setUploadedSongDuration(audio.duration);
      });
    }
  }, [uploadedSong]);

  // UPDLOAD SONG LOGIC ///////

  const addNewSong = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    const title = titleRef.current.value;
    const artist = artistRef.current.value;

    if (!title || !artist || !uploadedSong) {
      setErrorMessage({
        description: "Invalid input",
        action: "Please fill in all fields",
      });
      return;
    }

    // const { title, artist } = getUserInputs();

    let songData;
    if (isChecked) {
      songData = await fetchSongData(title, artist);
    }

    const missingMBID =
      songData?.artist?.mbid || songData?.album?.mbid || songData?.mbid;

    if (isChecked && (missingMBID === undefined || !songData)) {
      setErrorMessage({
        description: "Track not found",
        action: "Please check spelling or continue without LastFm metadata",
      });
      setIsUploading(false);
      return;
    }

    const metaData = constructMetadata(songData, title, artist);
    const songRef = ref(
      storage,
      `USER-UID-${uid}/${new Date()}-${metaData.customMetadata.title}-${
        metaData.customMetadata.artist
      }`
    );
    try {
      await uploadFile(songRef, metaData);
      setSongRefs((prevRefs) => {
        return [...prevRefs, songRef];
      });
      cleanUp();
    } catch (err) {
      console.log(err);
      setErrorMessage({
        description: "Something went wrong",
        action: "please try again",
      });
    }
  };

  //////////////////////////////
  const fetchSongData = async (title, artist) => {
    const searchTrackURL = `/2.0/?method=track.getInfo&api_key=${apiKey}&artist=${artist}&track=${title}&format=json`;

    const res = await axios.get(searchTrackURL);
    return res?.data.track;
  };

  const constructMetadata = (songData, userTitle, UserArtist) => {
    return {
      customMetadata: {
        title: songData?.name || userTitle,
        artist: songData?.album?.artist || UserArtist,
        duration: uploadedSongDuration,
        album: songData?.album?.title || "",
        imgM: songData?.album?.image[1]["#text"] || "",
        imgL: songData?.album?.image.at(-1)["#text"] || "",
        position: songRefs.length + 1,
      },
    };
  };

  const uploadFile = async (songRef, metaData) => {
    await uploadBytes(songRef, uploadedSong);
    await updateMetadata(songRef, metaData);
  };

  const cleanUp = () => {
    titleRef.current.value = "";
    artistRef.current.value = "";
    setIsUploading(false);
    setShowForm(false);
    setErrorMessage("");
  };

  return (
    <div
      className={`${styles["form--background"]} ${
        showForm && styles["visible"]
      }`}
    >
      <div className={`${styles["form"]} ${showForm && styles["visible"]}`}>
        <div className={styles["error-message"]}>
          <h2>{errorMessage.description}</h2>
          <p>{errorMessage.action}</p>
        </div>
        <div className={styles["form--input"]}>
          <input
            ref={titleRef}
            type="text"
            id="title"
            name="title"
            placeholder="Enter the new song title"
          />
          <input
            ref={artistRef}
            type="text"
            id="artist"
            name="artist"
            placeholder="Enter the artist name"
          />
          <div className={styles["form--upload-btn-container"]}>
            <input
              ref={uploadedFile}
              type="file"
              id="file"
              name="file"
              multiple={false}
              accept=".mp3, .wav, .ogg"
              onChange={(e) => {
                setUploadedSong(e.target.files[0]);
              }}
            />
            <div className={styles["form--btn-icon"]}>
              <FontAwesomeIcon
                icon={faAlbum}
                size="4x"
                style={{ color: "#ffffff" }}
              />
              <h3>{uploadedSong?.name || "Choose file"}</h3>
            </div>
          </div>
          <div className={styles["checkbox"]}>
            <input
              type="checkbox"
              onChange={() => setIsChecked(!isChecked)}
              checked={isChecked}
            />
            <p>Would you like to use LastFM metadata?</p>
          </div>
        </div>
        <div className={styles["form--validation-btn"]}>
          <button className={styles["cancel"]} onClick={cleanUp}>
            Cancel
          </button>
          <button className={styles["confirm"]} onClick={addNewSong}>
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadForm;
