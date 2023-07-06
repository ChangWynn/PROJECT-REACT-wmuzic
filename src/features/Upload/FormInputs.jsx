import styles from "./css/FormInputs.module.css";
import Input from "../../components/ui/Input";
import React, { forwardRef, useContext } from "react";
import InputsContainer from "../../components/container/InputsContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlbum } from "@fortawesome/pro-solid-svg-icons";
import { FormContext } from "./UploadForm";

const FormInputs = forwardRef((_, { titleRef, artistRef, fileInputRef }) => {
  const { uploadedSong, setUploadedSong, isChecked, setIsChecked } =
    useContext(FormContext);
  return (
    <React.Fragment>
      <InputsContainer>
        <Input
          ref={titleRef}
          label="Title"
          input={{
            type: "text",
            id: "title",
            name: "title",
            placeholder: "Enter the new song title",
          }}
        />
        <Input
          ref={artistRef}
          label="Artist"
          input={{
            type: "text",
            id: "artist",
            name: "artist",
            placeholder: "Enter the artist name",
          }}
        />
        <div className={styles["upload-btn-container"]}>
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
          <div className={styles["btn-icon"]}>
            <FontAwesomeIcon
              icon={faAlbum}
              size="3x"
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
            onChange={() => {
              setIsChecked(!isChecked);
            }}
            checked={isChecked}
          />
          <p>Would you like to use LastFM metadata?</p>
        </div>
      </InputsContainer>
    </React.Fragment>
  );
});
export default FormInputs;
