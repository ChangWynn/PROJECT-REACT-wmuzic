import styles from "./css/InputsContainer.module.css";

const InputsContainer = (props) => {
  return <div className={styles["inputs-container"]}>{props.children}</div>;
};

export default InputsContainer;
