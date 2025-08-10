import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { User } from '../../interfaces/user';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  imports: [NgIf],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {

  public used:boolean = true;

  constructor(private router:Router, private userService:UserService){}

  addUser()
  {
    let username= (document.querySelector("#username") as HTMLInputElement).value;
    let mail= (document.querySelector("#email") as HTMLInputElement).value;
    let pass = (document.querySelector("#password") as HTMLInputElement).value;

    let user:User = {
      username:username,
      email:mail,
      password:pass
    };
    this.userService.createUser(user).subscribe({
      next:(data)=>{
        console.log(data);
        this.used=true;
        this.router.navigate(['./login']);

        var fullData=JSON.parse(data);
        localStorage.setItem('token',fullData.token);
        localStorage.setItem('expiration',fullData.expiration);
      },
      error:(err)=>{
        this.used=false;
        username='';
        mail='';
        pass='';
      }
    })
  }

}
