import {
  ref,
  uploadBytes,
  updateMetadata,
  getMetadata,
} from "firebase/storage";
import { storage } from "../../config/firebase";
import { getUserStorage } from "../../utilities/getUserStorage";

import React, { useEffect, useRef, useState } from "react";
import { Form, useOutletContext } from "react-router-dom";

import { apiKey } from "../../.api";
import axios from "../services/axios";

const UploadForm = ({ setSongsRefs, setSongsURL }) => {
  const { uid } = useOutletContext();
  const [uploadedSong, setUploadedSong] = useState(null);
  const [uploadedSongDuration, setUploadedSongDuration] = useState(0);
  const titleRef = useRef();
  const artistRef = useRef();

  useEffect(() => {
    if (uploadedSong) {
      const audio = new Audio();
      audio.src = URL.createObjectURL(uploadedSong);
      audio.addEventListener("loadedmetadata", () => {
        setUploadedSongDuration(audio.duration);
        console.log("Duration:", audio.duration);
      });
    }
  }, [uploadedSong]);

  // UPDLOAD SONG LOGIC ////////
  const addNewSong = async (e) => {
    e.preventDefault();
    const artist = artistRef.current.value;
    const title = titleRef.current.value;
    const url = `/2.0/?method=track.getInfo&api_key=${apiKey}&artist=${artist}&track=${title}&format=json`;
    const res = await axios.get(url);

    const songData = res.data.track;

    const metaData = {
      customMetadata: {
        title: songData.name,
        artist: songData.album.artist,
        duration: uploadedSongDuration,
        album: songData.album.title,
        imgM: songData.album.image[1]["#text"],
        imgL: songData.album.image[3]["#text"],
      },
    };

    const songRef = ref(
      storage,
      `USER-UID-${uid}/${songData.name}-${songData.album.artist}`
    );

    try {
      await uploadBytes(songRef, uploadedSong);
      await updateMetadata(songRef, metaData);
      const metadata = await getMetadata(songRef);
      console.log("metadata", metadata);
      getUserStorage().then((updatedItems) => {
        setSongsURL(updatedItems.songsURL);
        setSongsRefs(updatedItems.songsRefs);
      });
    } catch (err) {
      console.log(err);
    }
  };
  //////////////////////////////
  return (
    <form onSubmit={addNewSong}>
      <input ref={titleRef} type="text" id="title" name="title" />
      <input ref={artistRef} type="text" id="artist" name="artist" />
      <input
        type="file"
        id="file"
        name="file"
        multiple={false}
        onChange={(e) => {
          setUploadedSong(e.target.files[0]);
        }}
      />
      <button>Upload</button>
    </form>
  );
};

export default UploadForm;
