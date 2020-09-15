import { useRef, useEffect, useState, RefObject, useCallback } from "react";
import useAutoPlay from "./hooks/useAutoPlay";
import useEvent from "./hooks/useEvent";
import "./slider.scss";
import move from "./utils/move";

export interface SlideProps {
  prev: () => void;
  next: () => void;
}

export default function useSlider(
  options: {
    autoPlay?: boolean;
    duration?: number;
    slidesPerView?: number;
    speed?: number;
    loop?: boolean;
    navigation?: boolean;
  } = {}
): [RefObject<HTMLDivElement>, SlideProps] {
  const {
    speed = 300,
    autoPlay = false,
    duration = 3000,
    loop = false,
    slidesPerView = 1,
    navigation = false
  } = options;

  const ref = useRef<HTMLDivElement>(null);

  const [parentWidth, setParentWidth] = useState(0);

  const slideWidth = parentWidth / slidesPerView;

  const [curIndex, setCurIndex] = useState(0);

  const prev = useCallback(() => {
    setCurIndex(prev => {
      if (!ref.current) return prev;

      if (!loop && prev === 0) return prev;

      let newIndex;

      const childrenNum = ref.current.querySelectorAll(".use-slider__slide")
        .length;

      if (prev === 0) {
        newIndex = childrenNum - 1;
      } else {
        newIndex = prev - 1;
      }

      let updatedIndex = prev;

      while (updatedIndex <= 0) updatedIndex += childrenNum;

      move({
        slideWidth,
        slidesPerView,
        container: ref.current,
        loop,
        speed,
        leftStart: -prev * slideWidth,
        deltaX: slideWidth,
        curIndex: updatedIndex,
        rightStart: (childrenNum - prev) * slideWidth,
        animate: true
      });

      return newIndex;
    });
  }, [loop, slideWidth, slidesPerView, speed]);

  const next = useCallback(() => {
    setCurIndex(prev => {
      if (!ref.current) return prev;

      const childrenNum = ref.current.querySelectorAll(".use-slider__slide")
        .length;

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

    ref.current.classList.add("use-slider");

    for (let i = 0; i < ref.current.children.length; i += 1) {
      const child = ref.current.children[i] as HTMLElement;

      child.classList.add("use-slider__slide");

      child.style.width = `${(1 / slidesPerView) * 100}%`;
    }
  }, [slidesPerView]);

  useEffect(() => {
    if (!ref.current) return;
    if (navigation) {
      const oldNavigationNode = ref.current.querySelector(
        ".use-slider__arrow__container"
      );

      if (oldNavigationNode) ref.current.removeChild(oldNavigationNode);

      const navigationContainer = document.createElement("div");
      navigationContainer.classList.add("use-slider__arrow__container");

      const navigationLeft = document.createElement("div");
      navigationLeft.classList.add("use-slider__arrow__left");

      const navigationRight = document.createElement("div");
      navigationRight.classList.add("use-slider__arrow__right");

      navigationContainer.appendChild(navigationLeft);
      navigationContainer.appendChild(navigationRight);

      ref.current.appendChild(navigationContainer);

      navigationLeft.addEventListener("click", prev);
      navigationRight.addEventListener("click", next);
    }
  }, [prev, next, navigation]);

  useEvent(
    ref.current,
    curIndex,
    slideWidth,
    parentWidth,
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
