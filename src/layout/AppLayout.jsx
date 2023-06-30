import styles from "./css/AppLayout.module.css";
import AppNavigation from "../features/App/AppNavigation";

import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLoaderData } from "react-router-dom";

import { getUserStorage } from "../utilities/getUserStorage";

const AppLayout = () => {
  const [uid] = useState(localStorage.getItem("uid"));
  const navigate = useNavigate();
  const allRefs = useLoaderData();

  useEffect(() => {
    if (!uid) navigate("/");
  }, []);

  if (uid) {
    return (
      <div className={styles["app--container"]}>
        <AppNavigation />
        <Outlet context={{ uid, allRefs: allRefs.items }} />
      </div>
    );
  }
};

export default AppLayout;

export const loader = () => {
  return getUserStorage();
};
