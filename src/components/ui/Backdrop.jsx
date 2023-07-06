import styles from "./css/Backdrop.module.css";

const Backdrop = ({ zIndex }) => {
  return <div className={styles["backdrop"]} style={{ zIndex: zIndex }}></div>;
};

export default Backdrop;
