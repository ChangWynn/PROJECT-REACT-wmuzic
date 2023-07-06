import styles from "./Menu.module.css";
import MenuButton from "./MenuButton";
import { useContext } from "react";
import { MainContext } from "../App/MusicPlayer";

import { faPlus } from "@fortawesome/sharp-light-svg-icons";
import {
  faAlbum,
  faAlbumCollection,
  faBars,
} from "@fortawesome/sharp-solid-svg-icons";

const Menu = () => {
  const {
    showPlaylist,
    setShowPlaylist,
    setShowForm,
    showMediaMenu,
    setShowMediaMenu,
  } = useContext(MainContext);
  return (
    <div className={styles["playlist--menu"]}>
      <MenuButton
        faIcon={showPlaylist ? faAlbumCollection : faAlbum}
        clickEvent={() => setShowPlaylist(!showPlaylist)}
      />
      <MenuButton
        faIcon={faBars}
        clickEvent={() => setShowMediaMenu(!showMediaMenu)}
      />
      <MenuButton faIcon={faPlus} clickEvent={() => setShowForm(true)} />
    </div>
  );
};

export default Menu;
