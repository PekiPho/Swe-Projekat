

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
  searchQuery = '';
  suggestions: Report[] = [];
  private searchSubject = new Subject<string>();

  constructor(
    private router: Router, 
    private searchService: SearchService, 
    private userService: UserService
  ) {
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

  ngOnInit() {
    this.userService.userr$.subscribe(user => {
      this.currentUser = user;
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