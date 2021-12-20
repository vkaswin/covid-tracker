import React, { useEffect } from "react";

export const useOnClickOutSide = (ref, handler) => {
  useEffect(() => {
    document.addEventListener("touchstart", handleClickOutSide);
    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      document.removeEventListener("touchstart", handleClickOutSide);
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, []);

  const handleClickOutSide = (event) => {
    const { target } = event;
    if (ref.current && !ref.current.contains(target)) {
      handler();
    }
  };
};
