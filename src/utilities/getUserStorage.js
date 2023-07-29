import { storage } from "../config/firebase";
import { ref, listAll, getMetadata } from "firebase/storage";

export const getUserStorage = async () => {
  const userStoragePath = `${localStorage.getItem("uid")}`;
  const userStorageRef = ref(storage, userStoragePath);

  try {
    const allRefs = await listAll(userStorageRef);
    const allSongRefsAndMD = await Promise.all(constructRefsAndMD(allRefs.items));
    return allSongRefsAndMD;
  } catch (err) {
    console.log(err);
  }
};

const constructRefsAndMD = (refs) => {
  return refs.map(async (ref, index) => {
    const metadata = await getMetadata(ref);
    return { ref, metadata, position: index };
  });
};
