# Observer

Une implémentation légère du pattern Observer en TypeScript, inspirée de bibliothèques réactives comme RxJS. Ce projet propose des outils simples pour créer des flux de données observables, avec des opérateurs fonctionnels tels que `map` et `filter`.

## Fonctionnalités

- **Observable** : Crée des flux de données auxquels les observateurs peuvent s'abonner.
- **BehaviorSubject** : Émet la dernière valeur à chaque nouvel abonné et permet de diffuser de nouvelles valeurs.
- **Opérateurs fonctionnels** : Transforme et filtre les flux avec `map` et `filter`.
- **API fluide** : Utilise la méthode `pipe` pour chaîner les transformations.

## Installation

```bash
npm install
```



## Utilisation

```ts
import { BehaviorSubject } from "./src/behavior.subject";
import { map } from "./src/operators/map";
import { filter } from "./src/operators/filter";

const subject = new BehaviorSubject<number>(0);

const subscription = subject
  .pipe(
    map((x) => x * 2),
    filter((x) => x > 5)
  )
  .subscribe({
    next: (value) => console.log("Valeur filtrée :", value),
  });

subject.next(1); // Ignoré
subject.next(4); // Affiche : Valeur filtrée : 8

subscription.unsubscribe();
```



## Structure du projet

- `src/index.ts` : Définit les interfaces `Observer`, `Observable`, `Subscription` et la méthode `pipe`.
- `src/behavior.subject.ts` : Implémente `BehaviorSubject`, un observable avec une valeur initiale.
- `src/operators/map.ts` : Opérateur `map` pour transformer les valeurs d'un flux.
- `src/operators/filter.ts` : Opérateur `filter` pour filtrer les valeurs selon un prédicat.

## Exemple avancé

```ts
const observable = new Observable<number>((observer) => {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.complete();
});

observable
  .pipe(
    map((x) => x + 10),
    filter((x) => x % 2 === 0)
  )
  .subscribe({
    next: (value) => console.log("Valeur reçue :", value),
    complete: () => console.log("Flux terminé"),
  });

// Affiche :
// Valeur reçue : 12
// Flux terminé
```



## À propos

Ce projet est une exploration pédagogique du pattern Observer en TypeScript. Il vise à fournir une base simple et extensible pour comprendre les concepts de la programmation réactive.
