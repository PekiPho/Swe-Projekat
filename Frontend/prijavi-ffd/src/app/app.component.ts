import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterModule, HttpClientModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'prijavi-ffd';

  constructor(private userService:UserService){}

  ngOnInit() {
  this.userService.getEntry().subscribe({
      next:(data)=>{
        var user = JSON.parse(data);
        this.userService.setUser(user);
        //console.log(user);
      },
      error:(err)=>{
        
      }
    });
}
}
