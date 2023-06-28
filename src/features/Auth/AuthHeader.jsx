import styles from "./css/AuthHeader.module.css";
import { Link } from "react-router-dom";

const AuthHeader = ({ authMode }) => {
  return (
    <div className={styles["auth--header"]}>
      <h1>{authMode.title}</h1>
      <p>
        {authMode.message}
        <Link to={authMode.linkTo}>{authMode.link}</Link>
      </p>
    </div>
  );
};

export default AuthHeader;
