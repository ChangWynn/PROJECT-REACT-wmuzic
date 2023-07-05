import styles from "./css/FormInputs.module.css";
import Input from "../../components/ui/Input";
import InputFile from "./InputFile";
import InputCheckbox from "./InputCheckbox";
import { forwardRef } from "react";

const FormInputs = forwardRef((_, { titleRef, artistRef, fileInputRef }) => {
  return (
    <div className={styles["form--input"]}>
      <Input
        ref={titleRef}
        input={{
          type: "text",
          id: "title",
          name: "title",
          placeholder: "Enter the new song title",
        }}
      />
      <Input
        ref={artistRef}
        input={{
          type: "text",
          id: "artist",
          name: "artist",
          placeholder: "Enter the artist name",
        }}
      />
      <InputFile ref={fileInputRef} />
      <InputCheckbox checkboxLabel="Would you like to use LastFM metadata?" />
    </div>
  );
});
export default FormInputs;
