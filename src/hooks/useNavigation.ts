import { cloneElement, ReactElement, useEffect } from "react";
import ReactDOM from "react-dom";

export default function useNavigation(options: {
  container: HTMLDivElement | null;
  navigation: boolean;
  prev: () => void;
  next: () => void;
  arrowLeft?: ReactElement;
  arrowRight?: ReactElement;
}): void {
  const { container, navigation, arrowLeft, arrowRight, prev, next } = options;

  useEffect(() => {
    if (!container) return;
    if (navigation || arrowLeft || arrowRight) {
      const oldNavigationNode = container.querySelector(
        ".slider-arrow-container"
      );

      if (oldNavigationNode) container.removeChild(oldNavigationNode);

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

      container.appendChild(navigationContainer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prev, next, navigation]);
}
