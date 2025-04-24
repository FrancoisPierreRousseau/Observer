import { map } from "./operators/map";

export interface Observer<T> {
  next: (value: T) => void;
  error: (err: any) => void;
  complete: () => void;
}

export interface Subscription {
  unsubscribe: () => void;
}

export type OperatorFunction<T, R> = (source: Observable<T>) => Observable<R>;

export class Observable<T> {
  constructor(private producer: (observer: Observer<T>) => void) {}

  subscribe(observer: Partial<Observer<T>>): Subscription {
    const safeObserver: Observer<T> = {
      next: observer.next ?? (() => {}),
      error: observer.error ?? (() => {}),
      complete: observer.complete ?? (() => {}),
    };
    this.producer(safeObserver);
    return {
      unsubscribe: () => {
        // Pas de gestion d'observers ici pour un Observable froid
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
  pipe<R>(...operations: OperatorFunction<any, any>[]): Observable<R>;
  pipe(...operations: OperatorFunction<any, any>[]): Observable<any> {
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
    }, 1000);
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
    map((names) => names.filter((name) => name.startsWith("A")))
  )
  .subscribe({
    next: (result) => console.log("Résultat filtré :", result),
    complete: () => console.log("Terminé"),
  });
