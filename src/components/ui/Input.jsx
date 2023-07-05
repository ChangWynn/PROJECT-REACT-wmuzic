import React, { forwardRef } from "react";
import styles from "./css/Input.module.css";

const Input = forwardRef(({ input }, ref) => {
  return (
    // <React.Fragment>
    //   <label htmlFor={input.name}>{input.label}</label>
    <input ref={ref} {...input} />
    // </React.Fragment>
  );
});

export default Input;
