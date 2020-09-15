import { useRef, useEffect, useState, RefObject } from "react";
import useAutoPlay from "./hooks/useAutoPlay";
import useEvent from "./hooks/useEvent";
import "./slider.scss";
import move from "./utils/move";

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

    setCurIndex(prev => {
      let newIndex;

      if (prev === 0) {
        newIndex = childrenNum - 1;
      } else {
        newIndex = prev - 1;
      }

      move({
        slideWidth,
        slidesPerView,
        container,
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
  };

  const next = () => {
    if (!ref || !ref.current) return;

    const container = ref.current;
    const childrenNum = container.children.length;

    if (!loop && curIndex >= childrenNum - slidesPerView) return;

    setCurIndex(prev => {
      move({
        slideWidth,
        slidesPerView,
        container,
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
