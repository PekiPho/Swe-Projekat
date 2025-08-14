import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-get-started',
  imports: [RouterLink,RouterModule],
  templateUrl: './get-started.html',
  styleUrl: './get-started.scss'
})
export class GetStarted implements OnInit{

  constructor(private userService:UserService, private router:Router){}
  ngOnInit(): void {
    this.userService.getEntry().subscribe({
      next:(data)=>{
        var user = JSON.parse(data);
        this.userService.setUser(user);
        if(this.router.url.includes('login') || this.router.url.includes('get-started'))
          this.router.navigate(['./main-page']);
                   
      },
      error:(err)=>{
        
      }
    });
  }
}
