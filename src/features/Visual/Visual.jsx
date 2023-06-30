import { getMetadata } from "firebase/storage";
import style from "./Visual.module.css";

const Visual = () => {
  getMetadata();

  return (
    <div className={style["container"]}>
      <div className={style["album-cover"]}>
        <img />
      </div>
    </div>
  );
};

export default Visual;
