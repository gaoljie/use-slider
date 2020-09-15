import React from "react";
import { SlideProps } from "../index";

const Arrow: React.FC<{ slide: SlideProps }> = ({ children, slide }) => {
  return (
    <div className={"use-slider__arrow__container"}>
      {children ? (
        children
      ) : (
        <>
          <div
            onClick={() => slide && slide.prev()}
            className={"use-slider__arrow__left"}
          />
          <div
            onClick={() => slide && slide.next()}
            className={"use-slider__arrow__right"}
          />
        </>
      )}
    </div>
  );
};

export default Arrow;
