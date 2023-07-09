import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./MenuButtonUI.module.css";

const MenuButtonUI = ({ faIcon, clickEvent }) => {
  return (
    <button className={styles["menu-btn"]} onClick={clickEvent}>
      <FontAwesomeIcon icon={faIcon} size="3x" />
    </button>
  );
};

export default MenuButtonUI;
