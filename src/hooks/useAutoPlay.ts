import { useState, useRef, useEffect, useCallback, RefObject } from "react";

export default function useAutoPlay(
  ref: RefObject<HTMLDivElement>,
  cb: () => void,
  autoPlaySpeed: number,
  autoPlay: boolean
): void {
  const timer = useRef(0);

  const wrapCallback = useCallback(cb, [ref.current]);

  const [pause, setPause] = useState(false);

  useEffect(() => {
    if (!ref || !ref.current) return;

    ref.current.addEventListener("mouseover", () => {
      setPause(true);
    });
    ref.current.addEventListener("mouseout", () => {
      setPause(false);
    });
  }, [ref]);

  useEffect(() => {
    if (autoPlay) {
      timer.current = window.setInterval(() => {
        if (!pause) {
          wrapCallback();
        }
      }, autoPlaySpeed);
    }
    return () => {
      clearInterval(timer.current);
    };
  }, [pause, autoPlaySpeed, wrapCallback, autoPlay]);
}
