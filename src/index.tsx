import {
  useRef,
  useEffect,
  useState,
  RefObject,
  ReactElement,
  useCallback
} from "react";
import "./slider.scss";
import move from "./utils/move";
import useAutoPlay from "./hooks/useAutoPlay";
import useEvent from "./hooks/useEvent";
import usePagination from "./hooks/usePagination";
import useNavigation from "./hooks/useNavigation";

export interface SlideProps {
  prev: () => void;
  next: () => void;
  moveTo: (index: number) => void;
}

export default function useSlider(
  options: {
    autoPlay?: boolean;
    initial?: number;
    duration?: number;
    slidesPerView?: number;
    speed?: number;
    loop?: boolean;
    pagination?: boolean;
    navigation?: boolean;
    arrowLeft?: ReactElement;
    arrowRight?: ReactElement;
  } = {}
): [RefObject<HTMLDivElement>, SlideProps] {
  const {
    speed = 300,
    initial = 0,
    autoPlay = false,
    duration = 3000,
    loop = false,
    slidesPerView = 1,
    pagination = false,
    navigation = false,
    arrowLeft,
    arrowRight
  } = options;

  const ref = useRef<HTMLDivElement>(null);

  const [parentWidth, setParentWidth] = useState(0);

  const slideWidth = parentWidth / slidesPerView;

  const [curIndex, setCurIndex] = useState(initial);

  const prev = useCallback(() => {
    setCurIndex(prev => {
      if (!ref.current) return prev;

      if (!loop && prev === 0) return prev;

      let newIndex;

      const childrenNum = ref.current.querySelectorAll(".slider-slide").length;

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

      const childrenNum = ref.current.querySelectorAll(".slider-slide").length;

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

  const moveTo = useCallback(
    (index: number) => {
      setCurIndex(prev => {
        if (!ref.current) return prev;

        const childrenNum = ref.current.querySelectorAll(".slider-slide")
          .length;

        move({
          slideWidth,
          slidesPerView,
          container: ref.current,
          loop,
          speed,
          leftStart: -prev * slideWidth,
          deltaX: (prev - index) * slideWidth,
          curIndex: prev,
          rightStart: (childrenNum - prev) * slideWidth,
          animate: true
        });

        return index;
      });
    },
    [loop, slideWidth, slidesPerView, speed]
  );

  useEffect(() => {
    if (!ref.current) return;

    setParentWidth(ref.current.clientWidth);

    ref.current.classList.add("slider-container");

    for (let i = 0; i < ref.current.children.length; i += 1) {
      const child = ref.current.children[i] as HTMLElement;

      child.classList.add("slider-slide");

      child.style.width = `${(1 / slidesPerView) * 100}%`;
    }
  }, [slidesPerView]);

  useEvent({
    container: ref.current,
    curIndex,
    slideWidth,
    speed,
    setCurIndex,
    loop,
    slidesPerView
  });

  useAutoPlay({
    container: ref.current,
    cb: next,
    duration,
    autoPlay
  });

  useNavigation({
    container: ref.current,
    navigation,
    prev,
    next,
    arrowLeft,
    arrowRight
  });

  usePagination({
    container: ref.current,
    pagination,
    curIndex,
    initial,
    moveTo
  });

  const slide = {
    prev,
    next,
    moveTo
  };

  return [ref, slide];
}
