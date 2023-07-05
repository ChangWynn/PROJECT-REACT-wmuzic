import { useContext } from "react";
import styles from "./css/UploadButtons.module.css";
import { FormContext } from "./UploadForm";
import Button from "../../components/ui/Button";
import ButtonsContainer from "../../components/container/ButtonsContainer";

const UploadButtons = () => {
  const { cleanUp, addNewSong } = useContext(FormContext);
  return (
    <ButtonsContainer>
      <Button
        label="Cancel"
        type="cancel-rectangle"
        attributes={{ onClick: cleanUp }}
      />
      <Button
        label="Upload"
        type="confirm-rectangle"
        attributes={{ onClick: addNewSong }}
      />
    </ButtonsContainer>
  );
};

export default UploadButtons;
