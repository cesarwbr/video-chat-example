export type Listerner<T> = (event: T) => void;
export type Observer<T> = {
  subscribe: (listerner: Listerner<T>) => () => void;
  publish: (event: T) => void;
};

export function createObserver<T>(): Observer<T> {
  let listeners: Listerner<T>[] = [];

  return {
    subscribe: (listener: Listerner<T>): (() => void) => {
      listeners.push(listener);
      return () => {
        listeners = listeners.filter((l) => l !== listener);
      };
    },
    publish: (event: T) => {
      listeners.forEach((listener) => listener(event));
    },
  };
}
