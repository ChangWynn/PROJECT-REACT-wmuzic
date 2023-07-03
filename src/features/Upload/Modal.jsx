import { useContext } from "react";

import { FormContext } from "./UploadForm";
import styles from "./css/Modal.module.css";

const Form = (props) => {
  const { showForm } = useContext(FormContext);
  return (
    <div className={`${styles["modal"]} ${showForm && styles["visible"]}`}>
      {props.children}
    </div>
  );
};

export default Form;
