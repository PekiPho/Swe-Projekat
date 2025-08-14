import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router'; 
import { UserService } from '../../services/user.service';
import { HttpResponseBase } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-login',
  imports: [NgIf, RouterLink, RouterModule, HttpClientModule], 
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
  constructor(private userService:UserService,private router: Router) {}
  public checked:boolean = true;

  public user:string='';

  
  checkLoginInfo()
  {
   
    let email = (document.querySelector("#email") as HTMLInputElement).value;
    let password = (document.querySelector("#password") as HTMLInputElement).value;
    
    if(password!='' && email!=''){
      this.userService.checkLogin(email,password).subscribe({
        next:(data)=>{
          this.checked=true;
          this.user=data;
          this.userService.setUser(data);
          this.router.navigate(['/main-page']);
        },
        error:(err:HttpResponseBase)=>{
          console.log(err);
          if(err.status==400){
            this.checked=false;
          }          
        }
      })
    }
  }
}
