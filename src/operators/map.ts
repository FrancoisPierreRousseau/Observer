import { Observable, OperatorFunction } from "..";

export function map<T, R>(project: (value: T) => R): OperatorFunction<T, R> {
  return (source: Observable<T>) =>
    new Observable<R>((observer) => {
      return source.subscribe({
        next: (value) => observer.next(project(value)),
        error: (err) => observer.error(err),
        complete: () => observer.complete(),
      });
    });
}
