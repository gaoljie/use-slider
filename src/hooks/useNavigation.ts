import { cloneElement, ReactElement, useEffect } from "react";
import ReactDOM from "react-dom";

function initNavigation<T extends HTMLElement>(
  container: T,
  navigation: boolean,
  prev: () => void,
  next: () => void,
  arrowLeft?: ReactElement,
  arrowRight?: ReactElement
) {
  if (navigation || arrowLeft || arrowRight) {
    const oldNavigationNode = container.querySelector(
      ".slider-navigation-container"
    );

    if (oldNavigationNode) container.removeChild(oldNavigationNode);

    const navigationContainer = document.createElement("div");
    navigationContainer.classList.add("slider-navigation-container");

    const navigationList = [];

    if (arrowLeft)
      navigationList.push(
        cloneElement(arrowLeft, {
          onClick: prev,
          className: `${
            arrowLeft.props.className ? arrowLeft.props.className : ""
          } slider-navigation-left`
        })
      );

    if (arrowRight)
      navigationList.push(
        cloneElement(arrowRight, {
          onClick: next,
          className: `${
            arrowRight.props.className ? arrowRight.props.className : ""
          } slider-navigation-right`
        })
      );

    if (navigationList.length) {
      ReactDOM.render(navigationList, navigationContainer);
    } else {
      const navigationLeft = document.createElement("div");
      navigationLeft.classList.add("slider-navigation-left");
      navigationLeft.classList.add("slider-navigation-left__default");

      const navigationRight = document.createElement("div");
      navigationRight.classList.add("slider-navigation-right");
      navigationRight.classList.add("slider-navigation-right__default");

      navigationContainer.appendChild(navigationLeft);
      navigationContainer.appendChild(navigationRight);

      navigationLeft.addEventListener("click", prev);
      navigationRight.addEventListener("click", next);
    }

    container.appendChild(navigationContainer);
  }
}
export default function useNavigation<T extends HTMLElement>(options: {
  container: T | null;
  navigation: boolean;
  prev: () => void;
  next: () => void;
  arrowLeft?: ReactElement;
  arrowRight?: ReactElement;
}): void {
  const { container, navigation, arrowLeft, arrowRight, prev, next } = options;

  useEffect(() => {
    if (!container) return;

    const observer = new MutationObserver(mutationList => {
      if (
        mutationList.every(
          mutationRecord =>
            Array.from(mutationRecord.addedNodes).every(
              node =>
                !(node as HTMLElement).classList.contains(
                  "slider-navigation-container"
                )
            ) &&
            Array.from(mutationRecord.removedNodes).every(
              node =>
                !(node as HTMLElement).classList.contains(
                  "slider-navigation-container"
                )
            )
        )
      ) {
        initNavigation(
          container,
          navigation,
          prev,
          next,
          arrowLeft,
          arrowRight
        );
      }
    });

    observer.observe(container, {
      childList: true,
      attributes: false,
      subtree: false
    });

    initNavigation(container, navigation, prev, next, arrowLeft, arrowRight);
  }, [container, arrowLeft, arrowRight, prev, next, navigation]);
}
