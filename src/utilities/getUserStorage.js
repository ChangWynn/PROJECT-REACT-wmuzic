import { storage } from "../config/firebase";
import { ref, listAll } from "firebase/storage";

export const getUserStorage = async () => {
  const userStoragePath = `${localStorage.getItem("uid")}`;
  const userStorageRef = ref(storage, userStoragePath);

  try {
    return await listAll(userStorageRef);
  } catch (err) {
    console.log(err);
  }
};
