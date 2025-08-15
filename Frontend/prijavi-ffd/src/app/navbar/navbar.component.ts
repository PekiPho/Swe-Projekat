import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { SearchService, Report } from '../../services/search.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user';
import { CommonModule, NgIf } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [FormsModule, RouterLink, RouterModule, NgIf,  CommonModule],
})
export class NavbarComponent implements OnInit{
  currentUser: User | null = null;

ngOnInit() {
  this.userService.userr$.subscribe(user => {
    this.currentUser = user;
    console.log(this.currentUser);
  });
}
  searchQuery = '';
  suggestions: Report[] = [];
  private searchSubject = new Subject<string>();

  constructor(private router: Router, private searchService: SearchService, private userService : UserService) {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(query => {
        if (query.length >= 3) {
          this.searchService.onTypeReports(query).subscribe(res => {
            this.suggestions = res;
          });
        } else {
          this.suggestions = [];
        }
      });
  }

  onSearchChange() {
    this.searchSubject.next(this.searchQuery);
  }

  selectSuggestion(title: string) {
    this.searchQuery = title;
    this.goToSearchPage();
  }

  goToSearchPage() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search-page'], { queryParams: { q: this.searchQuery } });
      this.suggestions = [];
    }
  }
}
