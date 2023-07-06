import styles from "./css/UploadSongModal.module.css";
import ModalOverlay from "../../components/ui/ModalOverlay";
import React, { forwardRef, useContext } from "react";
import { FormContext } from "./UploadForm";
import FormInputs from "./FormInputs";
import UploadButtons from "./UploadButtons";
import UploadState from "./UploadState";
import MidPrompt from "./MidPrompt";
import ReactDOM from "react-dom";
import Backdrop from "../../components/ui/Backdrop";

const UploadSongModal = forwardRef((_, ref) => {
  const { midPrompt, upload } = useContext(FormContext);

  return (
    <React.Fragment>
      <ModalOverlay zIndex="11">
        <div className={styles["error-message"]}>
          <h1>Add new song</h1>
          <h2>{upload?.errorMessage?.description}</h2>
          <p>{upload?.errorMessage?.action}</p>
        </div>
        <FormInputs ref={ref} />
        <UploadButtons />
      </ModalOverlay>

      {/* LOADING OVERLAYS */}
      {upload.inProgress &&
        ReactDOM.createPortal(
          <Backdrop zIndex="20" />,
          document.getElementById("backdrop")
        )}
      {upload.inProgress &&
        ReactDOM.createPortal(
          <UploadState message={upload.message} />,
          document.getElementById("modal-overlay")
        )}

      {/* MIDPROMPT OVERLAYS */}
      {midPrompt &&
        ReactDOM.createPortal(
          <Backdrop zIndex="30" />,
          document.getElementById("backdrop")
        )}
      {midPrompt &&
        ReactDOM.createPortal(
          <MidPrompt />,
          document.getElementById("modal-overlay")
        )}
    </React.Fragment>
  );
});

export default UploadSongModal;
