import styles from "./css/UploadForm.module.css";
import useUploadState from "../hooks/useUploadState";
import UploadState from "./UploadState";
import axios from "../../services/axios";
import { apiKey } from "../../.api";
import { Context } from "../App/MusicPlayer";

import React, { useContext, useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";

import { storage } from "../../config/firebase";
import { ref, uploadBytes, updateMetadata } from "firebase/storage";
import moment from "moment";
import MidPrompt from "./MidPrompt";
import FormInputs from "./FormInputs";
import UploadButtons from "./UploadButtons";
import ErrorMessage from "./ErrorMessage";
import Modal from "./Modal";

export const FormContext = React.createContext();

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

    console.log("checkboxValue", checkboxValue);
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

  return (
    <FormContext.Provider
      value={{
        addNewSong,
        cleanUp,
        uploadedSong,
        setUploadedSong,
        isChecked,
        setIsChecked,
        MidPrompt,
        setMidPrompt,
        showForm,
        upload,
        titleRef,
        artistRef,
        fileInputRef,
      }}
    >
      <div
        ref={backdropRef}
        onClick={closeModal}
        className={`${styles["form--background"]} ${
          showForm && styles["visible"]
        }`}
      >
        {midPrompt && <MidPrompt />}
        {upload.inProgress && <UploadState message={upload.message} />}
        <Modal>
          <ErrorMessage />
          <FormInputs ref={{ titleRef, artistRef, fileInputRef }} />
          <UploadButtons />
        </Modal>
        ,
      </div>
    </FormContext.Provider>
  );
};

export default UploadForm;
