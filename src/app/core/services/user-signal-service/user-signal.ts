import { Injectable, signal } from '@angular/core';

export interface User {
  name: string;
  age: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserSignal {
  private _user = signal<User>({name: 'Vansha', age: 21});

  user = this._user.asReadonly();

  changeName(newName: string) {
    this._user.update(u => ({ ...u, name: newName }));
  }
}
