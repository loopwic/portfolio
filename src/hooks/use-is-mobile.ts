import { useEffect, useState } from "react";

export function useIsMobile(mobileBreakpoint = 768) {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${mobileBreakpoint - 1}px)`);
    const onChange = () => {
      setIsMobile(mql.matches);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth <= mobileBreakpoint);
    return () => {
      mql.removeEventListener("change", onChange);
    };
  }, [mobileBreakpoint]);

  return isMobile;
}
