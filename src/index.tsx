import {
  useRef,
  useEffect,
  useState,
  RefObject,
  ReactElement,
  cloneElement,
  useCallback
} from "react";
import ReactDOM from "react-dom";
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
    index => {
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

  useEffect(() => {
    if (!ref.current) return;
    if (navigation || arrowLeft || arrowRight) {
      const oldNavigationNode = ref.current.querySelector(
        ".slider-arrow-container"
      );

      if (oldNavigationNode) ref.current.removeChild(oldNavigationNode);

      const navigationContainer = document.createElement("div");
      navigationContainer.classList.add("slider-arrow-container");

      const navigationList = [];

      if (arrowLeft)
        navigationList.push(
          cloneElement(arrowLeft, {
            onClick: prev,
            className: `${
              arrowLeft.props.className ? arrowLeft.props.className : ""
            } slider-arrow-left`
          })
        );

      if (arrowRight)
        navigationList.push(
          cloneElement(arrowRight, {
            onClick: next,
            className: `${
              arrowRight.props.className ? arrowRight.props.className : ""
            } slider-arrow-right`
          })
        );

      if (navigationList.length) {
        ReactDOM.render(navigationList, navigationContainer);
      } else {
        const navigationLeft = document.createElement("div");
        navigationLeft.classList.add("slider-arrow-left");
        navigationLeft.classList.add("slider-arrow-left__default");

        const navigationRight = document.createElement("div");
        navigationRight.classList.add("slider-arrow-right");
        navigationRight.classList.add("slider-arrow-right__default");

        navigationContainer.appendChild(navigationLeft);
        navigationContainer.appendChild(navigationRight);

        navigationLeft.addEventListener("click", prev);
        navigationRight.addEventListener("click", next);
      }

      ref.current.appendChild(navigationContainer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prev, next, navigation]);

  useEffect(() => {
    if (!ref.current) return;
    if (pagination) {
      const oldPaginationNode = ref.current.querySelector(
        ".slider-pagination-container"
      );

      if (oldPaginationNode) ref.current.removeChild(oldPaginationNode);

      const paginationContainer = document.createElement("div");
      paginationContainer.classList.add("slider-pagination-container");

      for (
        let i = 0;
        i < ref.current.querySelectorAll(".slider-slide").length;
        i += 1
      ) {
        const paginationItem = document.createElement("span");
        paginationItem.classList.add("slider-pagination-dot");
        paginationItem.classList.add("slider-pagination-dot__default");

        if (initial === i) paginationItem.classList.add("active");

        paginationItem.addEventListener("click", () => moveTo(i));
        paginationContainer.appendChild(paginationItem);
      }

      ref.current.appendChild(paginationContainer);
    }
  }, [initial, prev, next, pagination, moveTo]);

  useEffect(() => {
    if (!ref.current || !pagination) return;

    const paginationContainer = ref.current.querySelector(
      ".slider-pagination-container"
    );

    if (!paginationContainer) return;

    for (let i = 0; i < paginationContainer.children.length; i += 1) {
      const child = paginationContainer.children[i] as HTMLElement;

      if (i === curIndex) {
        child.classList.add("active");
      } else {
        child.classList.remove("active");
      }
    }
  }, [curIndex, pagination]);

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
