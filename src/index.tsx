import { useRef, useEffect, useState, RefObject, useCallback } from "react";
import useAutoPlay from "./hooks/useAutoPlay";
import useEvent from "./hooks/useEvent";
import "./slider.scss";
import move from "./utils/move";

export default function useSlider(
  options: {
    autoPlay?: boolean;
    duration?: number;
    slidesPerView?: number;
    speed?: number;
    loop?: boolean;
  } = {}
): [RefObject<HTMLDivElement>, { prev: () => void; next: () => void }] {
  const {
    speed = 300,
    autoPlay = false,
    duration = 3000,
    loop = false,
    slidesPerView = 1
  } = options;

  const ref = useRef<HTMLDivElement>(null);

  const [parentWidth, setParentWidth] = useState(0);

  const reqIDRef = useRef(0);

  const slideWidth = parentWidth / slidesPerView;

  const [curIndex, setCurIndex] = useState(0);

  const prev = useCallback(() => {
    setCurIndex(prev => {
      if (!ref.current) return prev;

      if (!loop && prev === 0) return prev;

      let newIndex;

      const childrenNum = ref.current.children.length;

      if (prev === 0) {
        newIndex = childrenNum - 1;
      } else {
        newIndex = prev - 1;
      }

      move({
        slideWidth,
        slidesPerView,
        container: ref.current,
        loop,
        speed,
        leftStart: -prev * slideWidth,
        deltaX: slideWidth,
        curIndex: prev,
        rightStart: (childrenNum - prev) * slideWidth,
        animate: true
      });

      return newIndex;
    });
  }, [loop, slideWidth, slidesPerView, speed]);

  const next = useCallback(() => {
    if (!ref.current) return;

    setCurIndex(prev => {
      if (!ref.current) return prev;

      const childrenNum = ref.current.children.length;

      if (!loop && prev >= childrenNum - slidesPerView) return prev;

      move({
        slideWidth,
        slidesPerView,
        container: ref.current,
        loop,
        speed,
        leftStart: -prev * slideWidth,
        deltaX: -slideWidth,
        curIndex: prev,
        rightStart: (childrenNum - prev) * slideWidth,
        animate: true
      });

      return (prev + 1) % childrenNum;
    });
  }, [loop, slideWidth, slidesPerView, speed]);

  useEffect(() => {
    if (!ref.current) return;

    setParentWidth(ref.current.clientWidth);

    ref.current.classList.add("slider-container");

    for (let i = 0; i < ref.current.children.length; i += 1) {
      const child = ref.current.children[i] as HTMLElement;

      child.classList.add("slider-container__slide");

      child.style.width = `${(1 / slidesPerView) * 100}%`;
    }
  }, [slidesPerView]);

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

  useAutoPlay(ref.current, next, duration, autoPlay);

  const slide = {
    prev,
    next
  };

  return [ref, slide];
}
