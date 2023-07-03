import { useContext } from "react";
import styles from "./css/InputCheckbox.module.css";
import { FormContext } from "./UploadForm";
import Input from "./ui/Input";

const InputCheckbox = ({ checkboxLabel }) => {
  const { isChecked, setIsChecked } = useContext(FormContext);

  return (
    <div className={styles["checkbox"]}>
      <Input
        input={{
          type: "checkbox",
          id: "checkbox",
          name: "checkbox",
          onChange: () => {
            setIsChecked(!isChecked);
          },
          checked: isChecked,
        }}
      />
      <p>{checkboxLabel}</p>
    </div>
  );
};

export default InputCheckbox;
