import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./css/UploadState.module.css";
import { faSpinnerThird } from "@fortawesome/pro-duotone-svg-icons";

const UploadState = ({ message }) => {
  return (
    <div className={styles["backdrop"]}>
      <div className={styles["message"]}>
        <div>
          <FontAwesomeIcon
            icon={faSpinnerThird}
            spin
            size="4x"
            style={{
              "--fa-animation-duration": "1s",
              "--fa-primary-color": "#e822ee",
              "--fa-secondary-color": "#e822ee",
            }}
          />
        </div>
        <h3>{message?.description}</h3>
        <p>{message?.action}</p>
      </div>
    </div>
  );
};

export default UploadState;
