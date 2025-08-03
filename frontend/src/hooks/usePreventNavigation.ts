import { useEffect } from "react";

export const usePreventNavigation = (isActive: boolean) => {
  useEffect(() => {
    if (isActive) {
      document.body.classList.add("react-dropzone-active");
      return () => document.body.classList.remove("react-dropzone-active");
    }
  }, [isActive]);
};
