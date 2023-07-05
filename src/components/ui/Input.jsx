import { forwardRef } from "react";
import styles from "./css/Input.module.css";

const Input = forwardRef(({ input }, ref) => {
  return <input ref={ref} {...input} />;
});

export default Input;
