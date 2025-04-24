import { filter } from "./operators/filter";
import { map } from "./operators/map";

// Le contrat Observer (pattern Observer)
export interface Observer<T> {
  next: (value: T) => void;
  error: (err: any) => void;
  complete: () => void;
}

// Le contrat Subscription (pour se désabonner)
export interface Subscription {
  unsubscribe: () => void;
}

export type OperatorFunction<T, R> = (source: Observable<T>) => Observable<R>;

export class Observable<T> {
  private observers: Observer<T>[] = [];

  constructor(private producer: (observer: Observer<T>) => void) {}

  subscribe(observer: Partial<Observer<T>>): Subscription {
    const safeObserver: Observer<T> = {
      next: observer.next ?? (() => {}),
      error: observer.error ?? (() => {}),
      complete: observer.complete ?? (() => {}),
    };
    this.observers.push(safeObserver);

    if (this.observers.length === 1) {
      this.producer({
        next: (value) => this.observers.forEach((o) => o.next(value)),
        error: (err) => this.observers.forEach((o) => o.error(err)),
        complete: () => this.observers.forEach((o) => o.complete()),
      });
    }

    return {
      unsubscribe: () => {
        this.observers = this.observers.filter((o) => o !== safeObserver);
      },
    };
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
  pipe<A>(...operations: OperatorFunction<T, A>[]): Observable<A> {
    return operations.reduce((prev, fn) => fn(prev), this as Observable<any>);
  }
}

function fakeApiCall(): Promise<{ id: number; name: string }[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 3, name: "Charlie" },
      ]);
    }, 1000); // Simule 1 seconde de délai
  });
}

const apiData$ = new Observable<{ id: number; name: string }[]>((observer) => {
  fakeApiCall()
    .then((data) => {
      observer.next(data);
      observer.complete();
    })
    .catch((error) => observer.error(error));
});

apiData$
  .pipe(
    map((users) => users.map((u) => u.name)),
    map((names) => names.filter((n) => n.startsWith("A")))
  )
  .subscribe({
    next: (result) => console.log("Résultat filtré :", result),
    complete: () => console.log("Terminé"),
  });
