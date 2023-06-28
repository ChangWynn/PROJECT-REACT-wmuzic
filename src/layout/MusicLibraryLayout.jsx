import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";

const MusicLibraryLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
    }
  }, []);

  const logout = () => {
    signOut(auth);
    navigate("/");
  };
  if (auth.currentUser) {
    return (
      <div>
        <h1>MusicLibraryLayout</h1>
        <Outlet />
        <button onClick={logout}>Logout</button>
      </div>
    );
  }
};

export default MusicLibraryLayout;
