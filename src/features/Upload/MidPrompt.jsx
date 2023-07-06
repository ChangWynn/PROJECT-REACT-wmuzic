import { useContext } from "react";
import styles from "./css/MidPrompt.module.css";
import { FormContext } from "./UploadForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/sharp-regular-svg-icons";
import ModalOverlay from "../../components/ui/ModalOverlay";

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
    <ModalOverlay zIndex="31">
      <div className={styles["mid-prompt"]}>
        <h3>Metadata found but incomplete.</h3>
        <p>Continue anyway ?</p>
        <div className={styles["mid-prompt-btns"]}>
          <button onClick={cancelUpload}>
            <FontAwesomeIcon
              className={styles["btn-icon"]}
              icon={faArrowLeft}
            />
            <p>Back</p>
          </button>
          <button onClick={resumeUpload}>
            <p>Continue</p>
            <FontAwesomeIcon
              className={styles["btn-icon"]}
              icon={faArrowRight}
            />
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
};

export default MidPrompt;
