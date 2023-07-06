import styles from "./css/UploadForm.module.css";
import useUploadState from "../hooks/useUploadState";
import axios from "../../services/axios";
import moment from "moment";
import { apiKey } from "../../.api";
import { MainContext } from "../App/MusicPlayer";

import React, { useContext, useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import ReactDOM from "react-dom";

import { storage } from "../../config/firebase";
import {
  ref,
  uploadBytes,
  updateMetadata,
  getMetadata,
} from "firebase/storage";
import Backdrop from "../../components/ui/Backdrop";
import UploadSongModal from "./UploadSongModal";

export const FormContext = React.createContext();

const UploadForm = ({ showForm, setShowForm }) => {
  const upload = useUploadState();

  const { uid } = useOutletContext();
  const { files, setFiles } = useContext(MainContext);

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

  ////////// ADD NEW SONG FUNCTION ////////////////////

  const addNewSong = async (mbidRequired = true) => {
    upload.start("Initializing...");
    const title = titleRef.current.value.trim();
    const artist = artistRef.current.value.trim();

    if (inputsAreInvalid(title, artist, uploadedSong)) return;

    let songData;
    if (isChecked) {
      songData = await fetchMetadata(title, artist);
      if (!songData) return;
      if (mbidRequired && mbidAreMissing(songData)) return;
    }

    if (await uploadToFirebase(songData, title, artist)) return;

    cleanUp();
  };

  ////////// ADD NEW SONG HELPER FUNCTIONS ////////////////////

  const inputsAreInvalid = (title, artist, uploadedSong) => {
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
        action: "Please check spelling or continue without LastFm",
      });
      return false;
    } else return songData;
  };

  const callAPI = async (title, artist) => {
    const searchTrackURL = `/2.0/?method=track.getInfo&api_key=${apiKey}&artist=${artist}&track=${title}&format=json`;

    const res = await axios.get(searchTrackURL);
    return res?.data.track;
  };

  const mbidAreMissing = (songData) => {
    const mbidMissing = // returns true if one of the below returns undefined
      !songData?.artist?.mbid || !songData?.mbid || !songData?.album?.mbid;

    if (mbidMissing) {
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
      return false;
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
        position: files.songRefs.length + 1,
      },
    };
  };

  const uploadingProcess = async (songRef, metaData) => {
    upload.updateState("Uploading file...");
    await uploadFile(songRef, metaData);
    const newSongMD = await getMetadata(songRef);
    setFiles((prev) => {
      return {
        songRefs: [...prev.songRefs, songRef],
        songMD: [...prev.songMD, newSongMD],
      };
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

  ////////// END OF HELPER FUNCTIONS ////////////////////

  const closeModal = (e) => {
    if (e.target === backdropRef.current) setShowForm(false);
  };

  document.addEventListener("keydown", (key) => {
    if (showForm && key.code === "Escape") {
      setShowForm(false);
    }
  });

  return (
    <FormContext.Provider
      value={{
        addNewSong,
        cleanUp,
        uploadedSong,
        setUploadedSong,
        isChecked,
        setIsChecked,
        midPrompt,
        setMidPrompt,
        showForm,
        upload,
        titleRef,
        artistRef,
        fileInputRef,
      }}
    >
      {showForm &&
        ReactDOM.createPortal(
          <Backdrop zIndex="10" />,
          document.getElementById("backdrop")
        )}
      {showForm &&
        ReactDOM.createPortal(
          <UploadSongModal ref={{ titleRef, artistRef, fileInputRef }} />,
          document.getElementById("modal-overlay")
        )}
    </FormContext.Provider>
  );
};

export default UploadForm;
