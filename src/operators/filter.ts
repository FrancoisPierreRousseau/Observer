import { Observable, OperatorFunction } from "..";

export function filter<T>(
  predicate: (value: T) => boolean
): OperatorFunction<T, T> {
  return (source: Observable<T>) =>
    new Observable<T>((observer) => {
      return source.subscribe({
        next: (value) => {
          if (predicate(value)) observer.next(value);
        },
        error: (err) => observer.error(err),
        complete: () => observer.complete(),
      });
    });
}
