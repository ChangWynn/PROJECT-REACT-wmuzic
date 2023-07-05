import { forwardRef, useContext } from "react";
import styles from "./css/InputFile.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlbum } from "@fortawesome/pro-solid-svg-icons";
import Input from "../../components/ui/Input";
import { FormContext } from "./UploadForm";

const InputFile = forwardRef((_, ref) => {
  const { uploadedSong, setUploadedSong } = useContext(FormContext);

  return (
    <div className={styles["upload-btn-container"]}>
      <Input
        ref={ref}
        input={{
          type: "file",
          id: "file",
          name: "file",
          multiple: false,
          accept: ".mp3, .wav, .ogg",
          onChange: (e) => {
            setUploadedSong(e.target.files[0]);
          },
        }}
      />
      <div className={styles["btn-icon"]}>
        <FontAwesomeIcon
          icon={faAlbum}
          size="4x"
          style={{ color: "#ffffff" }}
        />
        <h3>{uploadedSong?.name || "Choose file"}</h3>
      </div>
    </div>
  );
});

export default InputFile;
