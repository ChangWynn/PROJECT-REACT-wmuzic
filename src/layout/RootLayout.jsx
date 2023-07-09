import styles from "./css/RootLayout.module.css";
import { getUserStorage } from "../utilities/getUserStorage";

import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLoaderData } from "react-router-dom";

const RootLayout = () => {
  const [uid] = useState(localStorage.getItem("uid"));
  const navigate = useNavigate();
  const allRefs = useLoaderData();

  useEffect(() => {
    if (!uid) navigate("/");
  }, []);

  if (uid) {
    return (
      <div className={styles["app--container"]}>
        <Outlet context={{ uid, allRefs: allRefs.items }} />
      </div>
    );
  }
};

export default RootLayout;

export const loader = () => {
  return getUserStorage();
};
