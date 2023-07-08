import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./MenuButton.module.css";

const MenuButton = ({ faIcon, clickEvent }) => {
  return (
    <button className={styles["menu-btn"]} onClick={clickEvent}>
      <FontAwesomeIcon icon={faIcon} size="3x" />
    </button>
  );
};

export default MenuButton;
