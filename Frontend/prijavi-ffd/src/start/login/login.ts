import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router'; 
@Component({
  selector: 'app-login',
  imports: [NgIf, RouterLink, RouterModule], 
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
  constructor(private router: Router) {}
  public checked:boolean = true;

  public user:string='';

  
  checkLoginInfo()
  {
   
    let email = (document.querySelector("#email") as HTMLInputElement).value;
    let password = (document.querySelector("#password") as HTMLInputElement).value;
    this.router.navigate(['/main-page']);
  }
}
