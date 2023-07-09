import styles from "./UploadModal.module.css";
import ModalOverlay from "../../shared/ui/ModalOverlay";
import React, { forwardRef, useContext } from "react";
import { UploadContextProvider } from "./context/UploadContext";
import UploadForm from "./UploadForm";
import ProgressOverlay from "./overlays/ProgressOverlay";
import MidPrompt from "./overlays/MidPrompt";
import ReactDOM from "react-dom";
import Backdrop from "../../shared/ui/Backdrop";

const UploadModal = forwardRef((_, ref) => {
  const { midPrompt, upload } = useContext(UploadContextProvider);

  return (
    <React.Fragment>
      <ModalOverlay zIndex="11">
        <div className={styles["error-message"]}>
          <h1>Add new song</h1>
          <h2>{upload?.errorMessage?.description}</h2>
          <p>{upload?.errorMessage?.action}</p>
        </div>
        <UploadForm ref={ref} />
      </ModalOverlay>

      {/* LOADING OVERLAYS */}
      {upload.inProgress &&
        ReactDOM.createPortal(
          <Backdrop zIndex="20" />,
          document.getElementById("backdrop")
        )}
      {upload.inProgress &&
        ReactDOM.createPortal(
          <ProgressOverlay message={upload.message} />,
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

export default UploadModal;
