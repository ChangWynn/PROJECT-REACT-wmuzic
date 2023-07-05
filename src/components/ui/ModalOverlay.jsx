import styles from "./css/ModalOverlay.module.css";

const ModalOverlay = (props) => {
  return <div className={styles["modal-overlay"]}>{props.children}</div>;
};

export default ModalOverlay;
