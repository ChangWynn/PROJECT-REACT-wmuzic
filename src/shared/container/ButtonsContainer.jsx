import styles from "./css/ButtonsContainer.module.css";

const ButtonsContainer = (props) => {
  return <div className={styles["buttons-container"]}>{props.children}</div>;
};

export default ButtonsContainer;
