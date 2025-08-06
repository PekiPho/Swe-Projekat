import { NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [NgIf],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  
  public checked:boolean = true;

  public user:string='';

  constructor()
  {

  }
  checkLoginInfo()
  {
    let email = (document.querySelector("#email") as HTMLInputElement).value;
    let password = (document.querySelector("#password") as HTMLInputElement).value; 
  }
}
