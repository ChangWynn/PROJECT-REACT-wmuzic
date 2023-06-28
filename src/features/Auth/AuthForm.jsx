import styles from "./css/AuthForm.module.css";

import { forwardRef } from "react";

const AuthForm = forwardRef(({ errorMessage }, { emailRef, passwordRef }) => {
  return (
    <div className={styles["auth--form"]}>
      <p className={styles["auth--error"]}>{errorMessage}</p>
      <input ref={emailRef} type="email" placeholder="Email" />
      <input ref={passwordRef} type="password" placeholder="Password" />
    </div>
  );
});

export default AuthForm;
