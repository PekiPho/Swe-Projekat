import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { Report } from '../../interfaces/report';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true, 
  imports: [
    FormsModule, 
    RouterLink, 
    RouterModule, 
    NgIf, 
    CommonModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;

  public query='';
  public reports:Report[]=[];
  public showSug:boolean=false;

  constructor(
    private router: Router, 
    private searchService: SearchService, 
    private userService: UserService
  ) {}

  

  ngOnInit() {
    this.userService.userr$.subscribe(user => {
      this.currentUser = user;
    });
  }



  onType(event:Event){
    var input=event.target as HTMLInputElement;
    this.query=input.value;

    
    if(input.value.length>3){
      this.reports=[];


      this.searchService.onTypeReports(input.value).subscribe({
        next:(data)=>{
          this.reports=data;
          this.showSug=true;
          
        },
        error:(err)=>{
          console.log(err);
          this.showSug=false;
        }
      });

      
    }
    else{
      this.showSug=false;
    }

  }

  selectSuggestion(title:string){
    this.query=title;
    this.onSearch();
  }

  onSearch(){
    this.reports=[];

    console.log(this.query)
    if(!this.query?.trim()) return;

    this.router.navigate(['/search-page',this.query]);
  }
  logout() {
  localStorage.clear();
  this.userService.setUser(null);
  this.router.navigate(['/get-started']);
}
}