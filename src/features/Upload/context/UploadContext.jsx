import useUploadState from "../../../hooks/useUploadState";
import axios from "../../../services/axios";
import moment from "moment";
import { SpotifyID, SpotifySecret } from "../../../.api";
import { AppContext } from "../../../layout/AppLayout";

import React, { useContext, useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import ReactDOM from "react-dom";

import { storage } from "../../../config/firebase";
import { ref, uploadBytes, updateMetadata, getMetadata, getDownloadURL } from "firebase/storage";
import Backdrop from "../../../shared/ui/Backdrop";
import UploadModal from "../UploadModal";

export const UploadContextProvider = React.createContext();

const UploadContext = ({ showForm, setShowForm }) => {
  const upload = useUploadState();

  const { uid } = useOutletContext();
  const { songRefsAndMD, setSongRefsAndMD } = useContext(AppContext);

  const [uploadedSong, setUploadedSong] = useState(null);

  const [uploadedSongDuration, setUploadedSongDuration] = useState(0);
  const [isChecked, setIsChecked] = useState(true);
  const [midPrompt, setMidPrompt] = useState(false);

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

  ////////// ADD NEW SONG FUNCTION ////////////////////

  const addNewSong = async (mbidRequired = true) => {
    upload.start("Initializing...");
    const title = titleRef.current.value.trim();
    const artist = artistRef.current.value.trim();

    if (inputsAreInvalid(title, artist, uploadedSong)) return;

    let songData;
    if (isChecked) {
      songData = await axiosDataFromApi(title, artist);
      if (!songData) return;
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

  const axiosDataFromApi = async (title, artist) => {
    upload.updateState("Retrieving metadata...");

    try {
      //------ token request ------//
      const token = await axios.post(
        `https://accounts.spotify.com/api/token`,
        `grant_type=client_credentials&client_id=${SpotifyID}&client_secret=${SpotifySecret}`,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      //------ search request ------//
      return await axios.get(
        `https://api.spotify.com/v1/search?q=${title} ${artist}&type=artist%2Ctrack`,
        { headers: { Authorization: `Bearer ${token.data.access_token}` } }
      );
    } catch (err) {
      if (err.response?.status >= 400 && err.response.status <= 499) {
        upload.raiseError({
          description: "Internal error.",
          action: "Please try again later or continue without metadata",
        });
      } else {
        upload.raiseError({
          description: "Connection error.",
          action: "Please your internet connection",
        });
      }

      return false;
    }
  };

  const uploadToFirebase = async (songData, title, artist) => {
    const date = moment(new Date()).format("YYYYMMDDHHmmss");
    const metadata = constructMetadata(songData, date, title, artist);

    const songRef = ref(
      storage,
      `${uid}/${date}-${metadata.customMetadata.title}-${metadata.customMetadata.artist}`
    );

    try {
      await uploadingProcess(songRef, metadata);
    } catch (err) {
      upload.raiseError({
        description: "Something went wrong",
        action: "Please try again",
      });
      return false;
    }
  };

  const constructMetadata = (songData, date, title, artist) => {
    const tracksPath = songData?.data?.tracks?.items[0];
    const artistsPath = songData?.data?.artists?.items[0];
    const albumPath = tracksPath?.album;
    return {
      customMetadata: {
        uid: date + title + artist,
        title: tracksPath?.name || title,
        artist: artistsPath?.name || artist,
        duration: uploadedSongDuration,
        album: albumPath?.name || "",
        albumImgS: albumPath?.images[1]?.url || "",
        albumImgL: albumPath?.images[0]?.url || "",
        artistImgS: artistsPath?.images[1]?.url || "",
        artistImgL: artistsPath?.images[0]?.url || "",
        position: songRefsAndMD.length + 1,
      },
    };
  };

  const uploadingProcess = async (songRef, metaData) => {
    upload.updateState("Uploading file...");
    await uploadFile(songRef, metaData);
    const newSongMD = await getMetadata(songRef);
    const newSongPosition = songRefsAndMD.length;
    const newSongURL = await getDownloadURL(songRef);

    setSongRefsAndMD((prev) => {
      return [
        ...prev,
        { ref: songRef, metadata: newSongMD, url: newSongURL, position: newSongPosition },
      ];
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

  // document.addEventListener("keydown", (key) => {
  //   if (showForm && key.code === "Escape") {
  //     setShowForm(false);
  //   }
  // });

  return (
    <UploadContextProvider.Provider
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
        ReactDOM.createPortal(<Backdrop zIndex="10" />, document.getElementById("backdrop"))}
      {showForm &&
        ReactDOM.createPortal(
          <UploadModal ref={{ titleRef, artistRef, fileInputRef }} />,
          document.getElementById("modal-overlay")
        )}
    </UploadContextProvider.Provider>
  );
};

export default UploadContext;
