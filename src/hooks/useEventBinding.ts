import { useEffect } from "react";

export default function useEventBinding<K extends keyof HTMLElementEventMap>(
  container: HTMLDivElement | null,
  type: K,
  callback: (this: HTMLDivElement, ev: HTMLElementEventMap[K]) => any
): (this: HTMLDivElement, ev: HTMLElementEventMap[K]) => any {
  useEffect(() => {
    if (!container) return;
    container.addEventListener(type, callback);
    return () => container.removeEventListener(type, callback);
  }, [container, callback, type]);

  return callback;
}
