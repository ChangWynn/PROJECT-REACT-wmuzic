import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./MenuButton.module.css";
import { useState } from "react";

const MenuButton = ({ faIcon, clickEvent }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button className={styles["menu-btn"]} onClick={clickEvent}>
      <FontAwesomeIcon
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        icon={faIcon}
        size="3x"
        style={
          isHovered && {
            color: "#ee82ee",
          }
        }
      />
    </button>
  );
};

export default MenuButton;
