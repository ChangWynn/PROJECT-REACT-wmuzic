import React, { forwardRef } from "react";
import styles from "./css/Input.module.css";
import InputContainer from "../container/InputContainer";

const Input = forwardRef(({ label, input }, ref) => {
  return (
    <InputContainer>
      <input ref={ref} {...input} />
      <label htmlFor={input.name}>{label}</label>
    </InputContainer>
  );
});

export default Input;
