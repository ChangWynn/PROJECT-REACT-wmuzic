import styles from "./css/PlayerButtons.module.css";
import {
  faPlay,
  faPause,
  faForwardStep,
  faBackwardStep,
  faVolume,
  faVolumeSlash,
} from "@fortawesome/sharp-solid-svg-icons";

import { AppContext } from "../../layout/AppLayout";
import { useContext, useEffect, useRef, useState } from "react";
import PlayerButtonUI from "./PlayerButtonUI";
import {
  faArrowsRepeat,
  faRepeat1,
  faShuffle,
} from "@fortawesome/sharp-regular-svg-icons";

const PlayerButtons = () => {
  const {
    nextSong,
    songIsPlaying,
    setSongIsPlaying,
    currentSongIndex,
    setCurrentSongIndex,
    audioRef,
    files,
    currentRepeatMode,
    setCurrentRepeatMode,
    shuffleMode,
    setShuffleMode,
  } = useContext(AppContext);

  const [volumeON, setVolumeON] = useState(true);
  const [volume, setVolume] = useState(true);

  const volumeRef = useRef();
  const volumeDivRef = useRef();

  useEffect(() => {
    if (volumeON) {
      audioRef.current.volume = volume;
      volumeRef.current.valueAsNumber = volume * 100;
    } else {
      audioRef.current.volume = 0;
      volumeRef.current.valueAsNumber = 0;
    }
  }, [volumeON]);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  const togglePlay = () => {
    setSongIsPlaying(!songIsPlaying);
  };

  const prevSong = () => {
    if (audioRef.current.currentTime > 10) {
      audioRef.current.currentTime = 0;
    } else if (currentSongIndex === 0)
      setCurrentSongIndex(files.songRefs.length - 1);
    else {
      setCurrentSongIndex((currentIndex) => {
        return currentIndex - 1;
      });
    }
  };

  const toggleRepeatMode = () => {
    if (currentRepeatMode === 2) setCurrentRepeatMode(0);
    else {
      setCurrentRepeatMode((prevMode) => {
        return prevMode + 1;
      });
    }
  };

  const setRepeatIcon = () => {
    if (currentRepeatMode === 0 || currentRepeatMode === 2) {
      return faArrowsRepeat;
    } else {
      return faRepeat1;
    }
  };

  return (
    <div className={styles["audio-control"]}>
      <div ref={volumeDivRef} className={styles["volume-control"]}>
        <PlayerButtonUI
          onClickFn={() => setVolumeON(!volumeON)}
          FaIcon={volumeON ? faVolume : faVolumeSlash}
          styleName={volumeON ? "volume" : "volume-off"}
        />
        <input
          ref={volumeRef}
          type="range"
          min={0}
          max={100}
          step={0.1}
          disabled={!volumeON}
          onChange={(e) => setVolume(e.target.value / 100)}
        />
      </div>
      <div className={styles["main-controls"]}>
        <PlayerButtonUI
          onClickFn={toggleRepeatMode}
          FaIcon={setRepeatIcon()}
          styleName={currentRepeatMode === 0 ? "repeat-off" : "repeat"}
        />
        <PlayerButtonUI
          onClickFn={prevSong}
          FaIcon={faBackwardStep}
          styleName="prev-next"
        />
        <PlayerButtonUI
          onClickFn={togglePlay}
          FaIcon={songIsPlaying ? faPause : faPlay}
          styleName="play-pause"
        />
        <PlayerButtonUI
          onClickFn={nextSong}
          FaIcon={faForwardStep}
          styleName="prev-next"
        />
        <PlayerButtonUI
          onClickFn={() => setShuffleMode(!shuffleMode)}
          FaIcon={faShuffle}
          styleName={shuffleMode ? "shuffle" : "shuffle-off"}
        />
      </div>
      <div
        className={styles["invisible-div"]}
        style={{ width: volumeDivRef.current?.clientWidth }}
      ></div>
    </div>
  );
};

export default PlayerButtons;
