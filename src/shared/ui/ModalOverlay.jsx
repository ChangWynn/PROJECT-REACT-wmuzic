import styles from "./css/ModalOverlay.module.css";

const ModalOverlay = (props) => {
  return (
    <div className={styles["modal-overlay"]} style={{ zIndex: props.zIndex }}>
      {props.children}
    </div>
  );
};

export default ModalOverlay;
