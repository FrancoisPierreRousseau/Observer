import { BehaviorSubject } from "../behavior.subject";

const firstName$ = new BehaviorSubject<string>("Alice");

firstName$.subscribe({
  next: (firstName) => console.log(`Prénom mis à jour : ${firstName}`),
});

firstName$.next("Bob"); // Affiche "Prénom mis à jour : Bob"
