import { useContext } from "react";
import styles from "./css/MidPrompt.module.css";
import { FormContext } from "./UploadForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/sharp-regular-svg-icons";

const MidPrompt = () => {
  const { setMidPrompt, addNewSong } = useContext(FormContext);

  const resumeUpload = () => {
    setMidPrompt(false);
    addNewSong(false);
  };

  const cancelUpload = () => {
    setMidPrompt(false);
  };
  return (
    <div className={styles["mid-prompt"]}>
      <h3>Metadata found but might be incorrect</h3>
      <p>Come back to check spelling or continue anyway ?</p>
      <div className={styles["mid-prompt-btns"]}>
        <button onClick={cancelUpload}>
          <FontAwesomeIcon className={styles["btn-icon"]} icon={faArrowLeft} />{" "}
          <p>Back</p>
        </button>
        <button onClick={resumeUpload}>
          <p>Continue</p>
          <FontAwesomeIcon className={styles["btn-icon"]} icon={faArrowRight} />
        </button>
      </div>
    </div>
  );
};

export default MidPrompt;
