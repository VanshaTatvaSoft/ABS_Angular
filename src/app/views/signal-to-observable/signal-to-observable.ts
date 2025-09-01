import { Component } from '@angular/core';
import { UserSignal } from '../../core/services/user-signal-service/user-signal';

@Component({
  selector: 'app-signal-to-observable',
  imports: [],
  templateUrl: './signal-to-observable.html',
  styleUrl: './signal-to-observable.css'
})
export class SignalToObservable {
  constructor(public userSignal: UserSignal){}

  changeUserName(){
    this.userSignal.changeName('Vansha2824');
  }
}
