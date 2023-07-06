import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./ToggleDisplayBtn.module.css";

const ToggleDisplayBtn = ({ faIcon, clickEvent }) => {
  return (
    <button onClick={clickEvent}>
      <FontAwesomeIcon size="xl" icon={faIcon} style={{ color: "#ffffff" }} />
    </button>
  );
};

export default ToggleDisplayBtn;
