import { SetStateAction, useEffect } from "react";

function init<T extends HTMLElement>(container: T, slidesPerView: number) {
  container.classList.add("slider-container");

  for (let i = 0; i < container.children.length; i += 1) {
    const child = container.children[i] as HTMLElement;

    child.classList.add("slider-slide");

    child.style.width = `${(1 / slidesPerView) * 100}%`;
  }
}

export default function useInit<T extends HTMLElement>(options: {
  container: T | null;
  setCurIndex: (value: SetStateAction<number>) => void;
  setParentWidth: (value: SetStateAction<number>) => void;
  slidesPerView: number;
}) {
  const { container, setParentWidth, setCurIndex, slidesPerView } = options;

  useEffect(() => {
    if (!container) return;
    setCurIndex(0);
    setParentWidth(container.clientWidth);

    const observer = new MutationObserver(() => {
      init(container, slidesPerView);
    });

    observer.observe(container, {
      childList: true
    });

    init(container, slidesPerView);
  }, [setCurIndex, setParentWidth, container, slidesPerView]);
}
