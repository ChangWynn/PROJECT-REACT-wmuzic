export const formatDuration = (duration) => {
  if (duration) {
    let minutes = Math.floor(+duration / 60);
    let seconds = Math.floor(+duration % 60);

    return `${minutes.toString()}:${seconds.toString().padStart(2, "0")}`;
  }
  return "-:--";
};
