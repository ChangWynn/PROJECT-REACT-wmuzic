import styles from "./UploadForm.module.css";
import axios from "../../services/axios";
import { apiKey } from "../../.api";
import { Context } from "../App/MusicPlayer";
import useUploadError from "../hooks/useUploadState";

import React, { useContext, useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";

import { storage } from "../../config/firebase";
import { ref, uploadBytes, updateMetadata } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlbum } from "@fortawesome/pro-solid-svg-icons";

const UploadForm = ({ showForm, setShowForm }) => {
  const { uploadState, errorState, triggerUploadError } = useUploadError();

  const { uid } = useOutletContext();
  const { songRefs, setSongRefs } = useContext(Context);

  const [uploadedSong, setUploadedSong] = useState(null);
  const [uploadedSongDuration, setUploadedSongDuration] = useState(0);
  const [isChecked, setIsChecked] = useState(true);

  const titleRef = useRef();
  const artistRef = useRef();
  const fileInputRef = useRef();

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
    uploadState.setIsUploading(true);
    const title = titleRef.current.value;
    const artist = artistRef.current.value;

    if (!title || !artist || !uploadedSong) {
      triggerUploadError({
        description: "Invalid input",
        action: "Please fill in all fields",
      });
      return;
    }

    let songData;
    if (isChecked) {
      songData = await fetchSongData(title, artist);
    }

    const missingMBID = songData?.artist?.mbid || songData?.mbid;

    if (isChecked && (missingMBID === undefined || !songData)) {
      triggerUploadError({
        description: "Track not found",
        action: "Please check spelling or continue without LastFm metadata",
      });
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
      triggerUploadError({
        description: "Something went wrong",
        action: "please try again",
      });
    }
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
    e.preventDefault();
    titleRef.current.value = "";
    artistRef.current.value = "";
    fileInputRef.current.value = null;
    uploadState.setIsUploading(false);
    errorState.setMessage("");
    setUploadedSong(null);
    setShowForm(false);
  };

  return (
    <div
      className={`${styles["form--background"]} ${
        showForm && styles["visible"]
      }`}
    >
      <form
        onSubmit={addNewSong}
        className={`${styles["form"]} ${showForm && styles["visible"]}`}
      >
        <div className={styles["error-message"]}>
          <h2>{errorState?.message?.description}</h2>
          <p>{errorState?.message?.action}</p>
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
            {uploadState.isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadForm;

// export const action = async ({ request, params }) => {
//   const data = await request.formData();

//   console.log("params", params);

//   const formData = {
//     title: data.get("title"),
//     artist: data.get("artist"),
//     file: data.get("file"),
//     checked: data.get("checkbox"),
//   };

//   if (!formData.title || !formData.artist || !formData.file) {
//     return {
//       description: "Invalid input",
//       action: "Please fill in all fields",
//     };
//   }

//   let songData;
//   if (formData.checked) {
//     songData = await fetchSongData(formData.title, formData.artist);
//   }

//   const missingMBID =
//     songData?.artist?.mbid || songData?.album?.mbid || songData?.mbid;

//   if (formData.checked && (missingMBID === undefined || !songData)) {
//     return {
//       description: "Track not found",
//       action: "Please check spelling or continue without LastFm metadata",
//     };
//   }

//   const metaData = constructMetadata(songData, formData);
//   const songRef = ref(
//     storage,
//     `USER-UID-${localStorage.getItem("uid")}/${new Date()}-${
//       metaData.customMetadata.title
//     }-${metaData.customMetadata.artist}`
//   );
//   try {
//     await uploadFile(songRef, metaData);
//     setSongRefs((prevRefs) => {
//       return [...prevRefs, songRef];
//     });
//     cleanUp();
//   } catch (err) {
//     console.log(err);
//     return {
//       description: "Something went wrong",
//       action: "please try again",
//     };
//   }

//   return null;
// };

// const fetchSongData = async (title, artist) => {
//   const searchTrackURL = `/2.0/?method=track.getInfo&api_key=${apiKey}&artist=${artist}&track=${title}&format=json`;

//   const res = await axios.get(searchTrackURL);
//   return res?.data.track;
// };

// const constructMetadata = async (songData, formData) => {
//   const userStorageRefs = await getUserStorage();
//   const songRefs = userStorageRefs?.items;
//   return {
//     customMetadata: {
//       title: songData?.name || formData.title,
//       artist: songData?.album?.artist || formData.artist,
//       duration: uploadedSongDuration,
//       album: songData?.album?.title || "",
//       imgM: songData?.album?.image[1]["#text"] || "",
//       imgL: songData?.album?.image.at(-1)["#text"] || "",
//       position: songRefs?.length + 1 || "",
//     },
//   };
// };

// const uploadFile = async (songRef, metaData) => {
//   await uploadBytes(songRef, uploadedSong);
//   await updateMetadata(songRef, metaData);
// };
