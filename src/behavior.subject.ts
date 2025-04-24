import { Observable, Observer, OperatorFunction, Subscription } from "./index";

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

  pipe<A>(op1: OperatorFunction<T, A>): Observable<A>;
  pipe<A, B>(
    op1: OperatorFunction<T, A>,
    op2: OperatorFunction<A, B>
  ): Observable<B>;
  pipe<A, B, C>(
    op1: OperatorFunction<T, A>,
    op2: OperatorFunction<A, B>,
    op3: OperatorFunction<B, C>
  ): Observable<C>;
  pipe(...operations: OperatorFunction<any, any>[]): Observable<any> {
    // On crée un Observable qui s'abonne à ce BehaviorSubject
    const source = new Observable<T>((observer) => {
      const sub = this.subscribe(observer);
      return () => sub.unsubscribe();
    });
    return source.pipe(...operations);
  }
}
