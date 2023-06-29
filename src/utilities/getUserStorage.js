import { storage } from "../config/firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";

export const getUserStorage = async () => {
  const userStoragePath = `USER-UID-${localStorage.getItem("uid")}`;
  const userStorageRef = ref(storage, userStoragePath);

  try {
    const songsRefs = await listAll(userStorageRef);
    const URLpromises = songsRefs.items.map(async (itemRef) => {
      return await getDownloadURL(itemRef);
    });

    const songsURL = await Promise.all(URLpromises);

    return { songsRefs, songsURL };
  } catch (err) {
    console.log(err);
  }
};
