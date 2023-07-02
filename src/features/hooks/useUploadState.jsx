import { useState } from "react";

const useUploadState = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadState, setUploadState] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  return {
    isUploading: {
      state: isUploading,
      set: setIsUploading,
      stop: () => setIsUploading(false),
    },
    uploadState: { message: uploadState, set: setUploadState },
    uploadError: { message: uploadError, set: setUploadError },
  };
};

export default useUploadState;
