import { cloneElement, ReactElement, useEffect } from "react";
import ReactDOM from "react-dom";

export default function usePagination(options: {
  container: HTMLDivElement | null;
  pagination: boolean | ((index: number) => ReactElement) | ReactElement;
  curIndex: number;
  initial: number;
  moveTo: (index: number) => void;
}): void {
  const { container, pagination, curIndex, initial, moveTo } = options;

  useEffect(() => {
    if (!container || !pagination) return;

    const oldPaginationNode = container.querySelector(
      ".slider-pagination-container"
    );

    if (oldPaginationNode) container.removeChild(oldPaginationNode);

    const paginationContainer = document.createElement("div");
    paginationContainer.classList.add("slider-pagination-container");
    const paginationList = [];

    for (
      let i = 0;
      i < container.querySelectorAll(".slider-slide").length;
      i += 1
    ) {
      if (pagination === true) {
        const paginationItem = document.createElement("span");
        paginationItem.classList.add("slider-pagination-dot");
        paginationItem.classList.add("slider-pagination-dot__default");

        if (initial === i) paginationItem.classList.add("active");

        paginationItem.addEventListener("click", () => moveTo(i));
        paginationContainer.appendChild(paginationItem);
      } else {
        const renderedComponent =
          typeof pagination === "function" ? pagination(i) : pagination;
        paginationList.push(
          cloneElement(renderedComponent, {
            onClick: () => moveTo(i),
            className: `${
              renderedComponent.props.className
                ? renderedComponent.props.className
                : ""
            } slider-pagination-dot ${initial === i ? "active" : ""}`
          })
        );
      }
    }

    if (paginationList.length) {
      ReactDOM.render(paginationList, paginationContainer);
    }

    container.appendChild(paginationContainer);
  }, [container, initial, pagination, moveTo]);

  useEffect(() => {
    if (!container || !pagination) return;

    const paginationContainer = container.querySelector(
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
  }, [container, curIndex, pagination]);
}
