import AuthHeader from "./AuthHeader";
import AuthSubmit from "./AuthSubmit";
import AuthForm from "./AuthForm";
import styles from "./css/Auth.module.css";

import React, { useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { auth } from "../../config/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const Auth = () => {
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const authMode = searchParams.get("auth");

  const getInputValue = () => {
    return {
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
    };
  };

  const navigateToMain = () => {
    navigate("/music-library");
  };

  const formatErrorMessage = (err) => {
    console.log(err);
    if (err === "auth/weak-password") {
      return "Password must be at least 6 characters";
    }
    const message = err?.slice(5);
    const noHyphen = message?.replace(/-/g, " ");
    return `${noHyphen[0].toUpperCase()}${noHyphen.slice(1)}` || undefined;
  };

  const authenticateMethod = async (callback) => {
    const { email, password } = getInputValue();
    try {
      await callback(auth, email, password);
      navigateToMain();
    } catch (err) {
      console.log(err);
      const message = formatErrorMessage(err.code);
      setErrorMessage(message);
    }
  };

  const AUTHMODE = {
    LOGIN: {
      title: "LOGIN",
      message: "Don't have an account? ",
      link: "Sign up",
      linkTo: "/?auth=signup",
      submitBtn: "LOGIN",
      authenticate: () => {
        authenticateMethod(signInWithEmailAndPassword);
      },
    },
    SIGNUP: {
      title: "SIGN UP",
      message: "Already have an account? ",
      link: "Login",
      linkTo: "/?auth=login",
      submitBtn: "SIGN UP",
      authenticate: () => {
        authenticateMethod(createUserWithEmailAndPassword);
      },
    },
  };

  const mode = authMode === "login" ? AUTHMODE.LOGIN : AUTHMODE.SIGNUP;

  return (
    <div className={styles["auth--container"]}>
      <AuthHeader authMode={mode} />
      <AuthForm ref={{ emailRef, passwordRef }} errorMessage={errorMessage} />
      <AuthSubmit mode={mode} setErrorMessage={setErrorMessage} />
    </div>
  );
};

export default Auth;
