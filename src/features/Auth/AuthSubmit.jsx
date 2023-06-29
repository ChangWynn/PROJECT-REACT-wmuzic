import styles from "./css/AuthSubmit.module.css";

import { auth, googleAuth } from "../../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const AuthSubmit = ({ mode, setErrorMessage }) => {
  const navigate = useNavigate();
  const signinWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleAuth);
      navigate("/app");
    } catch (err) {
      setErrorMessage(err.code);
    }
  };
  return (
    <div className={styles["auth--btns"]}>
      <button
        className={styles["auth--submit-btn"]}
        onClick={() => mode.authenticate()}
      >
        {mode.submitBtn}
      </button>
      <button className={styles["auth--google-btn"]} onClick={signinWithGoogle}>
        <img
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
          alt="google logo"
        />
      </button>
    </div>
  );
};

export default AuthSubmit;
