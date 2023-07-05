import styles from "./css/Button.module.css";

const Button = ({ attributes, label, type }) => {
  return (
    <button className={styles[type]} {...attributes}>
      {label}
    </button>
  );
};

export default Button;
