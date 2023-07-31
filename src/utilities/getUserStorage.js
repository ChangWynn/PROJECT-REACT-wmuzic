import { storage } from "../config/firebase";
import { ref, listAll, getMetadata, getDownloadURL } from "firebase/storage";

export const getUserStorage = async () => {
  const userStoragePath = `${localStorage.getItem("uid")}`;
  const userStorageRef = ref(storage, userStoragePath);

  try {
    const allRefs = await listAll(userStorageRef);
    const allSongs = await Promise.all(constructRefsAndMD(allRefs.items));
    return allSongs;
  } catch (err) {
    console.log(err);
  }
};

const constructRefsAndMD = (refs) => {
  return refs.map(async (ref, index) => {
    const metadata = await getMetadata(ref);
    const url = await getDownloadURL(ref);
    return { ref, metadata, position: index, url };
  });
};
