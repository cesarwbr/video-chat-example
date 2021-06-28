import { useCallback, useRef, useState } from "react";

export function useCallTimer() {
  const [callTimer, setCallTimer] = useState<string>("00:00");
  const intervalID = useRef<number | null>(null);

  const startTimer = useCallback(() => {
    let min = 0;
    let seg = 0;
    intervalID.current = window.setInterval(() => {
      if (seg === 59) {
        seg = 0;
        min++;
      } else {
        seg++;
      }

      const segStr = seg.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      });
      const minStr = min.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      });

      setCallTimer(`${minStr}:${segStr}`);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (intervalID.current) {
      clearInterval(intervalID.current);
    }
  }, []);

  return { callTimer, startTimer, stopTimer };
}
