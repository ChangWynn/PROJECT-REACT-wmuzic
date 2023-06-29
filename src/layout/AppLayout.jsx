import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLoaderData } from "react-router-dom";

import { getUserStorage } from "../utilities/getUserStorage";

import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import AppNavigation from "../features/App/AppNavigation";
import styles from "./css/AppLayout.module.css";

const AppLayout = () => {
  const [uid, setUid] = useState(localStorage.getItem("uid"));
  const navigate = useNavigate();
  console.log(uid);
  const userItems = useLoaderData();

  useEffect(() => {
    if (!uid) navigate("/");
  }, []);

  if (uid) {
    return (
      <div className={styles["app--container"]}>
        <AppNavigation />
        <Outlet context={{ uid, userItems }} />
      </div>
    );
  }
};

export default AppLayout;

export const loader = () => {
  return getUserStorage();
};
