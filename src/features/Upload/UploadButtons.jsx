import { useContext } from "react";
import styles from "./css/UploadButtons.module.css";
import { FormContext } from "./UploadForm";
import Button from "./ui/Button";

const UploadButtons = () => {
  const { cleanUp, addNewSong } = useContext(FormContext);
  return (
    <div className={styles["form--validation-btn"]}>
      <Button
        label="Cancel"
        attributes={{ className: styles["cancel"], onClick: cleanUp }}
      />
      <Button
        label="Upload"
        attributes={{ className: styles["confirm"], onClick: addNewSong }}
      />
    </div>
  );
};

export default UploadButtons;
