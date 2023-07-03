import React, { forwardRef } from "react";

const Input = forwardRef(({ input }, ref) => {
  return <input ref={ref} {...input} />;
});

export default Input;
