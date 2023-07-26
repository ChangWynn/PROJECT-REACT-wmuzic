import { useEffect, useRef, useState } from "react";
import styles from "./css/Slider.module.css";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
  useDragControls,
} from "framer-motion";

const Slider = ({
  objectRefRange,
  currentValue,
  setCurrentValue,
  navigateFn,
  formatTooltip,
  formatTooltipFallback,
}) => {
  const constraintsRef = useRef();
  const progressBarRef = useRef();
  const handleRef = useRef();

  const valueMin = 0;
  const valueMax = 100;
  const [value, setValue] = useState();
  const [handleBounds, setHandleBounds] = useState();
  const [dragging, setDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleX = useMotionValue(0);
  const progress = useTransform(handleX, (xValue) => xValue + handleBounds?.width / 2);
  const background = useMotionTemplate`linear-gradient(90deg, var(--purple) ${progress}px, #2c2c2c 0)`;
  const dragControls = useDragControls();

  useEffect(() => {
    setHandleBounds(handleRef.current?.getBoundingClientRect());
  }, []);

  useEffect(() => {
    setValue(currentValue);
  }, [currentValue]);

  useEffect(() => {
    const newProgress = value / (valueMax - valueMin);
    const progressBarBounds = progressBarRef.current.getBoundingClientRect();

    handleX.set(newProgress * progressBarBounds.width);
  }, [handleX, valueMax, valueMin, value]);

  const handleVariants = {
    hidden: { scale: 0 },
    visible: { scale: dragging ? 2 : 1 },
  };

  const startDrag = (event) => {
    dragControls.start(event, { snapToCursor: true });
  };

  const search = (formatTooltipFallback) => {
    const { left, width } = progressBarRef.current.getBoundingClientRect();
    const pointerPosition = tooltipPosition.x - left;
    const newProgress = clamp(pointerPosition / width, 0, 1);

    if (newProgress === 0) return formatTooltipFallback();
    else return formatTooltip(newProgress * objectRefRange);
  };

  const navigate = (e) => {
    const { left, width } = progressBarRef.current.getBoundingClientRect();
    const pointerPosition = e.pageX - left;
    const newProgress = clamp(pointerPosition / width, 0, 1);

    const newSongProgress = newProgress * (valueMax - valueMin);
    const newCurrentTime = newProgress * objectRefRange;

    navigateFn(newCurrentTime);
    setCurrentValue(clamp(newSongProgress, valueMin, valueMax));
  };

  const constructTooltipPosition = (e) => {
    const progressBarBounds = progressBarRef.current.getBoundingClientRect();
    setTooltipPosition({ x: e.clientX, y: progressBarBounds.top });
  };

  const clamp = (number, min, max) => {
    return Math.max(min, Math.min(number, max));
  };

  return (
    <>
      <div className={styles["slider--container"]}>
        <motion.div
          className={styles["slider--background"]}
          style={{
            background,
          }}
        />
        <div
          ref={progressBarRef}
          className={styles["slider--progress"]}
          style={{ left: `${handleBounds?.width / 2}px`, right: `${handleBounds?.width / 2}px` }}
        />
        <div ref={constraintsRef} className={styles["slider--handle-container"]}>
          <motion.div
            ref={handleRef}
            className={styles["slider--handle"]}
            drag="x"
            dragControls={dragControls}
            dragConstraints={constraintsRef}
            dragMomentum={false}
            dragElastic={0}
            onPointerDown={() => setDragging(true)}
            onPointerUp={() => setDragging(false)}
            onDragStart={() => setDragging(true)}
            onDragEnd={(e) => {
              navigate(e);
              setDragging(false);
            }}
            onDrag={() => {
              setIsHovered(true);
              setDragging(true);
            }}
            variants={handleVariants}
            animate={isHovered || dragging ? "visible" : "hidden"}
            style={{
              scale: 1,
              x: handleX,
              cursor: dragging ? "grabbing" : "grab",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={(e) => constructTooltipPosition(e)}
          />
        </div>
        {!!objectRefRange && (
          <div
            className={styles["slider--clickable-area"]}
            onPointerDown={(e) => {
              navigate(e);
              startDrag(e);
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={(e) => constructTooltipPosition(e)}
          />
        )}
      </div>
      {(isHovered || dragging) && (
        <div
          className={styles["slider--tooltip"]}
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y - 40}px`,
          }}
        >
          <p>{objectRefRange ? search(formatTooltipFallback) : ""}</p>
        </div>
      )}
    </>
  );
};

export default Slider;

// const handleDrag = () => {
//   setIsHovered(true);
//   const handleBound = handleRef.current.getBoundingClientRect();
//   const distToMiddleOfHandle = handleBound.x + handleBound.width / 2;
//   const progressBarBounds = progressBarRef.current.getBoundingClientRect();
//   const newProgress = (distToMiddleOfHandle - progressBarBounds.x) / progressBarBounds.width;
//   setValue(newProgress * (valueMax - valueMin)); // %
// };
