let reqID = 0;

export default function move(options: {
  slidesPerView: number;
  slideWidth: number;
  container: HTMLDivElement;
  animate?: boolean;
  speed: number;
  deltaX: number;
  leftStart: number;
  rightStart: number;
  curIndex: number;
  loop: boolean;
}): void {
  const {
    slidesPerView,
    slideWidth,
    container,
    loop,
    animate = true,
    speed,
    leftStart,
    deltaX,
    rightStart,
    curIndex
  } = options;

  if (!container) return;

  let startTime: number;

  const childrenNum = container.children.length;

  window.cancelAnimationFrame(reqID);

  function moveAnimation(timestamp: number) {
    if (!startTime) startTime = timestamp;

    const elapsed = animate ? Math.min((timestamp - startTime) / speed, 1) : 1;

    let transfromLeft = leftStart + elapsed * deltaX;

    while (transfromLeft <= -childrenNum * slideWidth && loop)
      transfromLeft += childrenNum * slideWidth;
    while (transfromLeft > 0 && loop) transfromLeft -= childrenNum * slideWidth;

    const transformStrLeft = `translateX(${transfromLeft}px)`;

    let transformRight =
      (rightStart + elapsed * deltaX) % (childrenNum * slideWidth);

    while (transformRight < 0) transformRight += childrenNum * slideWidth;

    const transformStrRight = `translateX(${transformRight}px)`;

    for (let i = 0; i < childrenNum; i += 1) {
      const child = container.children[i] as HTMLElement;

      if (loop) {
        if (deltaX > 0) {
          if (i >= curIndex + slidesPerView - childrenNum) {
            child.style.transform = transformStrLeft;
          } else {
            child.style.transform = transformStrRight;
          }
        } else {
          if (i >= curIndex) {
            child.style.transform = transformStrLeft;
          } else {
            child.style.transform = transformStrRight;
          }
        }
      } else {
        child.style.transform = transformStrLeft;
      }
    }

    if (elapsed < 1) {
      reqID = window.requestAnimationFrame(moveAnimation);
    }
  }

  reqID = window.requestAnimationFrame(moveAnimation);
}
