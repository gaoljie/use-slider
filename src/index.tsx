import { useRef, useEffect, useState, RefObject } from "react";
import useAutoPlay from "./hooks/useAutoPlay";
import useEvent from "./hooks/useEvent";

export default function useSlider(
  options: {
    autoPlay?: boolean;
    autoPlaySpeed?: number;
    slidesPerView?: number;
    speed?: number;
    loop?: boolean;
  } = {}
): [RefObject<HTMLDivElement>, { prev: () => void; next: () => void }] {
  const {
    speed = 300,
    autoPlay = false,
    autoPlaySpeed = 3000,
    loop = false,
    slidesPerView = 1
  } = options;

  const ref = useRef<HTMLDivElement>(null);

  const reqIDRef = useRef(0);

  const [parentWidth, setParentWidth] = useState(0);

  const slideWidth = parentWidth / slidesPerView;

  const [curIndex, setCurIndex] = useState(0);

  useEvent(
    ref.current,
    curIndex,
    slideWidth,
    parentWidth,
    reqIDRef.current,
    speed,
    setCurIndex,
    loop,
    slidesPerView
  );

  const prev = () => {
    if (!ref || !ref.current) return;

    const container = ref.current;
    const childrenNum = container.children.length;

    if (!loop && curIndex === 0) return;

    window.cancelAnimationFrame(reqIDRef.current);

    setCurIndex(prevIndex => {
      const newIndex = prevIndex === 0 ? childrenNum - 1 : prevIndex - 1;
      let startTime: number;
      function movePrev(timestamp: number) {
        if (!startTime) startTime = timestamp;

        const elapsed = Math.min((timestamp - startTime) / speed, 1);

        const transformStrLeft = `translateX(-${
          (newIndex + 1) * slideWidth - elapsed * slideWidth
        }px)`;

        const transformStrRight = `translateX(${
          (childrenNum - newIndex - 1) * slideWidth + elapsed * slideWidth
        }px)`;

        for (let i = 0; i < childrenNum; i += 1) {
          const child = container.children[i] as HTMLElement;

          if (loop) {
            if (i >= newIndex) {
              child.style.transform = transformStrLeft;
            } else {
              child.style.transform = transformStrRight;
            }
          } else {
            child.style.transform = transformStrLeft;
          }
        }

        if (elapsed < 1) {
          reqIDRef.current = window.requestAnimationFrame(movePrev);
        }
      }

      reqIDRef.current = window.requestAnimationFrame(movePrev);

      return newIndex;
    });
  };

  const next = () => {
    if (!ref || !ref.current) return;

    const container = ref.current;
    const childrenNum = container.children.length;

    if (!loop && curIndex >= childrenNum - slidesPerView) return;

    window.cancelAnimationFrame(reqIDRef.current);

    setCurIndex(prevIndex => {
      const newIndex = (prevIndex + 1) % childrenNum;
      let startTime: number;
      function moveNext(timestamp: number) {
        if (!startTime) startTime = timestamp;

        const elapsed = Math.min((timestamp - startTime) / speed, 1);

        const transformStrLeft = `translateX(-${
          prevIndex * slideWidth + slideWidth * elapsed
        }px)`;

        const transformStrRight = `translateX(${
          (childrenNum - prevIndex) * slideWidth - slideWidth * elapsed
        }px)`;

        for (let i = 0; i < childrenNum; i += 1) {
          const child = container.children[i] as HTMLElement;

          if (loop) {
            if (i >= prevIndex) {
              child.style.transform = transformStrLeft;
            } else {
              child.style.transform = transformStrRight;
            }
          } else {
            child.style.transform = transformStrLeft;
          }
        }

        if (elapsed < 1) {
          reqIDRef.current = window.requestAnimationFrame(moveNext);
        }
      }

      reqIDRef.current = window.requestAnimationFrame(moveNext);

      return newIndex;
    });
  };

  useEffect(() => {
    if (!ref || !ref.current) return;

    const container = ref.current;

    setParentWidth(container.clientWidth);

    container.classList.add("slider-container");

    for (let i = 0; i < container.children.length; i += 1) {
      const child = container.children[i] as HTMLElement;

      child.classList.add("slider-container__slide");

      child.style.width = `${(1 / slidesPerView) * 100}%`;
    }
  }, [speed, ref, slidesPerView]);

  useAutoPlay(ref, next, autoPlaySpeed, autoPlay);

  const slide = {
    prev,
    next
  };

  return [ref, slide];
}
