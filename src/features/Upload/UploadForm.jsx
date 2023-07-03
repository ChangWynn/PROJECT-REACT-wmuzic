import styles from "./UploadForm.module.css";
import useUploadState from "../hooks/useUploadState";
import UploadState from "./UploadState";
import axios from "../../services/axios";
import { apiKey } from "../../.api";
import { Context } from "../App/MusicPlayer";

import React, { useContext, useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";

import { storage } from "../../config/firebase";
import { ref, uploadBytes, updateMetadata } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlbum } from "@fortawesome/pro-solid-svg-icons";
import moment from "moment";

const UploadForm = ({ showForm, setShowForm }) => {
  const upload = useUploadState();

  const { uid } = useOutletContext();
  const { songRefs, setSongRefs } = useContext(Context);

  const [uploadedSong, setUploadedSong] = useState(null);

  const [uploadedSongDuration, setUploadedSongDuration] = useState(0);
  const [isChecked, setIsChecked] = useState(true);
  const [midPrompt, setMidPrompt] = useState(false);

  const titleRef = useRef();
  const artistRef = useRef();
  const fileInputRef = useRef();
  const backdropRef = useRef();

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

  const addNewSong = async (checkboxValue = isChecked) => {
    upload.start("Initializing...");

    const title = titleRef.current.value.trim();
    const artist = artistRef.current.value.trim();

    if (invalidInputs(title, artist, uploadedSong)) return;

    let songData;
    if (checkboxValue) {
      songData = await fetchMetadata(title, artist);
      if (!songData) return;
      if (mbidMissing(songData)) return;
    }

    if (await uploadToFirebase(songData, title, artist)) return;

    cleanUp();
  };

  const invalidInputs = (title, artist, uploadedSong) => {
    if (!title || !artist || !uploadedSong) {
      upload.raiseError({
        description: "Invalid input",
        action: "Please fill in all fields",
      });
      return true;
    }
  };

  const fetchMetadata = async (title, artist) => {
    upload.updateState("Retrieving metadata...");
    const songData = await callAPI(title, artist);

    if (!songData) {
      upload.raiseError({
        description: "No match found",
        action: "Please check spelling or continue without LastFm metadata",
      });
      return false;
    } else return songData;
  };

  const callAPI = async (title, artist) => {
    const searchTrackURL = `/2.0/?method=track.getInfo&api_key=${apiKey}&artist=${artist}&track=${title}&format=json`;

    const res = await axios.get(searchTrackURL);
    return res?.data.track;
  };

  const mbidMissing = (songData) => {
    const missingMBID = // returns true if any of the below is undefined
      !songData?.artist?.mbid || !songData?.mbid || !songData?.album?.mbid;

    if (missingMBID) {
      upload.stop();
      setMidPrompt(true);
      return true;
    }
  };

  const uploadToFirebase = async (songData, title, artist) => {
    const date = moment(new Date()).format("YYYYMMDDHHmmss");
    const metaData = constructMetadata(songData, title, artist);
    const songRef = ref(
      storage,
      `USER-UID-${uid}/${date}-${metaData.customMetadata.title}-${metaData.customMetadata.artist}`
    );

    try {
      await uploadingProcess(songRef, metaData);
    } catch (err) {
      upload.raiseError({
        description: "Something went wrong",
        action: "Please try again",
      });
      return true;
    }
  };

  const constructMetadata = (songData, title, artist) => {
    return {
      customMetadata: {
        title: songData?.name || title,
        artist: songData?.album?.artist || artist,
        duration: uploadedSongDuration,
        album: songData?.album?.title || "",
        imgM: songData?.album?.image[1]["#text"] || "",
        imgL: songData?.album?.image.at(-1)["#text"] || "",
        position: songRefs.length + 1,
      },
    };
  };

  const uploadingProcess = async (songRef, metaData) => {
    upload.updateState("Uploading file...");
    await uploadFile(songRef, metaData);
    setSongRefs((prevRefs) => {
      return [...prevRefs, songRef];
    });
    upload.success();
  };

  const uploadFile = async (songRef, metaData) => {
    await uploadBytes(songRef, uploadedSong);
    await updateMetadata(songRef, metaData);
  };

  const cleanUp = (e) => {
    if (e) e.preventDefault();
    titleRef.current.value = "";
    artistRef.current.value = "";
    fileInputRef.current.value = null;
    upload.reset();
    setUploadedSong(null);
    setShowForm(false);
  };

  const closeModal = (e) => {
    if (e.target === backdropRef.current) setShowForm(false);
  };

  const resumeUpload = () => {
    setMidPrompt(false);
    addNewSong(false);
  };

  const cancelUpload = () => {
    setMidPrompt(false);
  };

  return (
    <div
      ref={backdropRef}
      onClick={closeModal}
      className={`${styles["form--background"]} ${
        showForm && styles["visible"]
      }`}
    >
      {midPrompt && (
        <div className={styles["mid-prompt"]}>
          <h3>Metadata found but might be incorrect</h3>
          <p>Come back to check spelling or continue anyway ?</p>
          <div className={styles["mid-prompt-btns"]}>
            <button className={styles["cancel"]} onClick={cancelUpload}>
              Back
            </button>
            <button className={styles["confirm"]} onClick={resumeUpload}>
              Continue
            </button>
          </div>
        </div>
      )}
      {upload.inProgress && <UploadState message={upload.message} />}
      <div className={`${styles["form"]} ${showForm && styles["visible"]}`}>
        <div className={styles["error-message"]}>
          <h2>{upload?.errorMessage?.description}</h2>
          <p>{upload?.errorMessage?.action}</p>
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
              ref={fileInputRef}
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
              id="checkbox"
              name="checkbox"
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
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadForm;
