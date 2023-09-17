import styles from "./UploadForm.module.css";
import Input from "../../shared/ui/Input";
import React, { forwardRef, useContext } from "react";
import InputsContainer from "../../shared/container/InputsContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlbum } from "@fortawesome/pro-solid-svg-icons";
import { UploadContextProvider } from "./context/UploadContext";
import ButtonsContainer from "../../shared/container/ButtonsContainer";
import Button from "../../shared/ui/Button";

const UploadForm = forwardRef((_, { titleRef, artistRef, fileInputRef }) => {
  const { uploadedSong, setUploadedSong, isChecked, setIsChecked, cleanUp, addNewSong } =
    useContext(UploadContextProvider);
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
            <FontAwesomeIcon icon={faAlbum} size="3x" style={{ color: "#ffffff" }} />
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
          <p>Would you like to use Spotify&reg; metadata?</p>
        </div>
      </InputsContainer>
      <ButtonsContainer>
        <Button label="Cancel" type="cancel-rectangle" attributes={{ onClick: cleanUp }} />
        <Button label="Upload" type="confirm-rectangle" attributes={{ onClick: addNewSong }} />
      </ButtonsContainer>
    </React.Fragment>
  );
});
export default UploadForm;
