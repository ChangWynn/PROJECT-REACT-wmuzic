import styles from "./UploadForm.module.css";
import axios from "../../services/axios";
import { apiKey } from "../../.api";
import { Context } from "../App/MusicPlayer";
import useUploadState from "../hooks/useUploadState";

import React, {
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useOutletContext } from "react-router-dom";

import { storage } from "../../config/firebase";
import { ref, uploadBytes, updateMetadata } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlbum } from "@fortawesome/pro-solid-svg-icons";

const UploadForm = ({ showForm, setShowForm }, { dialogRef }) => {
  const { isUploading, uploadState, uploadError } = useUploadState();

  const { uid } = useOutletContext();
  const { songRefs, setSongRefs } = useContext(Context);

  const [uploadedSong, setUploadedSong] = useState(null);
  const [uploadedSongDuration, setUploadedSongDuration] = useState(0);
  const [isChecked, setIsChecked] = useState(true);

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

  const addNewSong = async (e) => {
    e.preventDefault();
    isUploading.set(true);
    const title = titleRef.current.value.trim();
    const artist = artistRef.current.value.trim();

    if (!title || !artist || !uploadedSong) {
      uploadError.set({
        description: "Invalid input",
        action: "Please fill in all fields",
      });
      isUploading.stop();
      return;
    }

    let songData;
    if (isChecked) {
      songData = await fetchSongData(title, artist);
    }

    const missingMBID = // returns
      !songData?.artist?.mbid || !songData?.mbid || !songData?.album?.mbid;

    if (isChecked && !songData) {
      uploadError.set({
        description: "No match found",
        action: "Please check spelling or continue without LastFm metadata",
      });
      isUploading.stop();
      return;
    }

    if (isChecked && missingMBID) {
      uploadError.set({
        description: "LastFM incomplete data",
        action: "",
      });
      isUploading.stop();
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
    } catch (err) {
      uploadError.set({
        description: "Something went wrong",
        action: "please try again",
      });
      isUploading.stop();
    }
    cleanUp();
  };

  ////////////////////////////
  ////////////////////////////

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

  const cleanUp = (e) => {
    if (e) e.preventDefault();
    titleRef.current.value = "";
    artistRef.current.value = "";
    fileInputRef.current.value = null;
    isUploading.set(false);
    uploadState.set("");
    uploadError.set("");
    setUploadedSong(null);
    setShowForm(false);
  };

  const closeModal = (e) => {
    if (e.target === backdropRef.current) setShowForm(false);
  };

  return (
    <div
      ref={backdropRef}
      onClick={closeModal}
      className={`${styles["form--background"]} ${
        showForm && styles["visible"]
      }`}
    >
      <form
        onSubmit={addNewSong}
        className={`${styles["form"]} ${showForm && styles["visible"]}`}
      >
        <div className={styles["error-message"]}>
          <h2>{uploadError?.message?.description}</h2>
          <p>{uploadError?.message?.action}</p>
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
          <button className={styles["confirm"]}>
            {isUploading.state ? "Uploading..." : "Upload"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadForm;
