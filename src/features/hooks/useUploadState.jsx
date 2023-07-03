import { useState } from "react";

const useUploadState = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadState, setUploadState] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const start = (message) => {
    setIsUploading(true);
    setUploadState(message);
  };

  const stop = () => {
    setIsUploading(false);
  };
  const resume = () => {
    setIsUploading(true);
  };

  const updateState = (message) => {
    setUploadState({
      description: message,
      action: "Please wait",
    });
  };

  const raiseError = (message) => {
    setErrorMessage(message);
    setIsUploading(false);
  };

  const success = () => {
    setUploadState({
      description: "Upload Complete",
      action: "",
    });
    setIsUploading(false);
  };

  const reset = () => {
    setUploadState({});
    setErrorMessage({});
    setIsUploading(false);
  };

  return {
    start,
    stop,
    resume,
    updateState,
    raiseError,
    reset,
    success,
    errorMessage,
    message: uploadState,
    inProgress: isUploading,
  };
};

export default useUploadState;
