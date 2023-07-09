import styles from "./Menu.module.css";
import MenuButtonUI from "./MenuButtonUI";
import { forwardRef, useContext } from "react";
import { AppContext } from "../../layout/AppLayout";

import { faPlus } from "@fortawesome/sharp-light-svg-icons";
import { faAlbum, faAlbumCollection } from "@fortawesome/sharp-solid-svg-icons";

const Menu = forwardRef((_, ref) => {
  const { showPlaylist, setShowPlaylist, setShowForm } = useContext(AppContext);
  return (
    <div ref={ref} className={styles["playlist--menu"]}>
      <MenuButtonUI
        faIcon={showPlaylist ? faAlbumCollection : faAlbum}
        clickEvent={() => setShowPlaylist(!showPlaylist)}
      />
      <MenuButtonUI faIcon={faPlus} clickEvent={() => setShowForm(true)} />
    </div>
  );
});

export default Menu;
