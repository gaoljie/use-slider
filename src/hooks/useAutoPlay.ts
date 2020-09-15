import { useState, useRef, useEffect } from "react";

export default function useAutoPlay(
  container: HTMLDivElement | null,
  cb: () => void,
  autoPlaySpeed: number,
  autoPlay: boolean
): void {
  const timer = useRef(0);

  const [pause, setPause] = useState(false);

  useEffect(() => {
    if (!container) return;

    const mouseOverEvent = () => setPause(true);
    const mouseOutEvent = () => setPause(false);

    container.addEventListener("mouseover", mouseOverEvent);
    container.addEventListener("mouseout", mouseOutEvent);

    return () => {
      container.removeEventListener("mouseover", mouseOverEvent);
      container.removeEventListener("mouseout", mouseOutEvent);
    };
  }, [container]);

  useEffect(() => {
    if (autoPlay) {
      timer.current = window.setInterval(() => {
        if (!pause) {
          cb();
        }
      }, autoPlaySpeed);
    }
    return () => {
      clearInterval(timer.current);
    };
  }, [pause, autoPlaySpeed, cb, autoPlay]);
}
