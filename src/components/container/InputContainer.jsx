import styles from "./css/InputContainer.module.css";

const InputContainer = (props) => {
  return <div className={styles["input-container"]}>{props.children}</div>;
};

export default InputContainer;
