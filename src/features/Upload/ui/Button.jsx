import React from "react";

const Button = ({ attributes, label }) => {
  return <button {...attributes}>{label}</button>;
};

export default Button;
