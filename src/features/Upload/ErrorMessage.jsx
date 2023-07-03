import { useContext } from "react";
import { FormContext } from "./UploadForm";
import styles from "./css/ErrorMessage.module.css";

const ErrorMessage = () => {
  const { upload } = useContext(FormContext);
  return (
    <div className={styles["error-message"]}>
      <h2>{upload?.errorMessage?.description}</h2>
      <p>{upload?.errorMessage?.action}</p>
    </div>
  );
};

export default ErrorMessage;
