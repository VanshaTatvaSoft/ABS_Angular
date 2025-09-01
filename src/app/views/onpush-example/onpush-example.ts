import { Component } from '@angular/core';
import { OnpushChild } from './onpush-child/onpush-child';

@Component({
  selector: 'app-onpush-example',
  imports: [OnpushChild],
  templateUrl: './onpush-example.html',
  styleUrl: './onpush-example.css'
})
export class OnpushExample {
  user: {name: string} = {name: 'Xyz'};

  onReplaceUser(){
    this.user = {name: 'Abc'};
  }

  onMutateUser(){
    this.user.name = 'Qwe';
  }
}
