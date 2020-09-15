import { useEffect } from "react";

export default function usePagination(options: {
  container: HTMLDivElement | null;
  pagination: boolean;
  curIndex: number;
  initial: number;
  moveTo: (index: number) => void;
}): void {
  const { container, pagination, curIndex, initial, moveTo } = options;

  useEffect(() => {
    if (!container) return;
    if (pagination) {
      const oldPaginationNode = container.querySelector(
        ".slider-pagination-container"
      );

      if (oldPaginationNode) container.removeChild(oldPaginationNode);

      const paginationContainer = document.createElement("div");
      paginationContainer.classList.add("slider-pagination-container");

      for (
        let i = 0;
        i < container.querySelectorAll(".slider-slide").length;
        i += 1
      ) {
        const paginationItem = document.createElement("span");
        paginationItem.classList.add("slider-pagination-dot");
        paginationItem.classList.add("slider-pagination-dot__default");

        if (initial === i) paginationItem.classList.add("active");

        paginationItem.addEventListener("click", () => moveTo(i));
        paginationContainer.appendChild(paginationItem);
      }

      container.appendChild(paginationContainer);
    }
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
