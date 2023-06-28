import styles from "./css/Controls.module.css";

const Controls = ({ previousSong, togglePlay, nextSong, songIsPlaying }) => {
  return (
    <div>
      <button onClick={previousSong}>Prev</button>
      <button onClick={togglePlay}>{songIsPlaying ? "Pause" : "Play"}</button>
      <button onClick={nextSong}>Next</button>
    </div>
  );
};

export default Controls;
