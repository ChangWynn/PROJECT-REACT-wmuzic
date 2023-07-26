import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWaveformLines } from "@fortawesome/pro-duotone-svg-icons";
import styles from "./Logo.module.css";

const Logo = () => {
  return (
    <div className={styles["landing-message"]}>
      <FontAwesomeIcon
        className={styles["landing-message--logo"]}
        icon={faWaveformLines}
        rotation={180}
        size="3x"
        style={{
          "--fa-primary-color": "#c200db",
          "--fa-secondary-color": "#ee82ee",
          "--fa-secondary-opacity": "1",
        }}
      />
      <h1>
        <span className={styles["w"]}>W</span>
        <span className={styles["m"]}>M</span>
        <span className={styles["w"]}>u</span>
        <span className={styles["w"]}>z</span>
        <span className={styles["m"]}>i</span>
        <span className={styles["m"]}>c</span>
      </h1>
    </div>
  );
};

export default Logo;
