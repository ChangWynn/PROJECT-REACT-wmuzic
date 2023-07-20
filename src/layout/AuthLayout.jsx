import Logo from "../shared/Logo";
import styles from "./css/AuthLayout.module.css";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Auth from "../features/Auth/Auth";

const AuthLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/auth?mode=login");
  }, []);

  return (
    <div className={styles["god--container"]}>
      <div className={styles["auth-page--container"]}>
        <Logo />
        <Auth />
      </div>
    </div>
  );
};

export default AuthLayout;
