import { NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  imports: [NgIf],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {

  public used:boolean = true;

  constructor(){}

  addUser()
  {
    let username= (document.querySelector("#username") as HTMLInputElement).value;
    let mail= (document.querySelector("#email") as HTMLInputElement).value;
    let pass = (document.querySelector("#password") as HTMLInputElement).value;
  }

}
