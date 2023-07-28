import styles from "./css/RootLayout.module.css";
import { getUserStorage } from "../utilities/getUserStorage";

import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLoaderData } from "react-router-dom";

const RootLayout = () => {
  const [uid] = useState(localStorage.getItem("uid"));
  const navigate = useNavigate();
  const allSongRefsAndMD = useLoaderData();

  // console.log(allSongRefsAndMD);

  useEffect(() => {
    if (!uid) navigate("/auth");
  }, []);

  if (uid) {
    return (
      <div className={styles["app--container"]}>
        <Outlet context={{ uid, allSongRefsAndMD }} />
      </div>
    );
  }
};

export default RootLayout;

export const loader = () => {
  return getUserStorage();
};
