import { Observer, Subscription } from "./index";

export class BehaviorSubject<T> {
  private observers: Observer<T>[] = [];
  private currentValue: T;

  constructor(initialValue: T) {
    this.currentValue = initialValue;
  }

  subscribe(observer: Partial<Observer<T>>): Subscription {
    const safeObserver: Observer<T> = {
      next: observer.next ?? (() => {}),
      error: observer.error ?? (() => {}),
      complete: observer.complete ?? (() => {}),
    };
    this.observers.push(safeObserver);

    // Émet la valeur courante immédiatement
    safeObserver.next(this.currentValue);

    return {
      unsubscribe: () => {
        this.observers = this.observers.filter((o) => o !== safeObserver);
      },
    };
  }

  next(value: T): void {
    this.currentValue = value;
    this.observers.forEach((observer) => observer.next(value));
  }

  getValue(): T {
    return this.currentValue;
  }
}
