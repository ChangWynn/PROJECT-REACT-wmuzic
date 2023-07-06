import styles from "./css/AppNavigation.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWaveformLines } from "@fortawesome/pro-duotone-svg-icons";
import { auth } from "../../config/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { faArrowRightFromBracket } from "@fortawesome/sharp-solid-svg-icons";

const AppNavigation = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("uid");
    signOut(auth);
    navigate("/");
  };

  return (
    <nav className={styles["navbar"]}>
      <div className={styles["brand"]}>
        <FontAwesomeIcon
          icon={faWaveformLines}
          rotation={180}
          size="2x"
          style={{
            "--fa-primary-color": "#c200db",
            "--fa-secondary-color": "#ee82ee",
            "--fa-secondary-opacity": "1",
          }}
        />
        <h1>
          <span className={styles["dark"]}>W</span>
          <span className={styles["light"]}>M</span>
          <span className={styles["dark"]}>u</span>
          <span className={styles["dark"]}>z</span>
          <span className={styles["light"]}>i</span>
          <span className={styles["light"]}>c</span>
        </h1>
      </div>
      <button className={styles["logout-btn"]} onClick={logout}>
        <FontAwesomeIcon icon={faArrowRightFromBracket} size="2x" />
      </button>
    </nav>
  );
};

export default AppNavigation;
