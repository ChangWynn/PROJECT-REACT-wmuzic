import { useState } from "react";

const useUploadState = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState(null);

  const triggerUploadError = (message) => {
    setMessage(message);
    setIsUploading(false);
  };

  return {
    uploadState: { isUploading, setIsUploading },
    errorState: { message, setMessage },
    triggerUploadError,
  };
};

export default useUploadState;
