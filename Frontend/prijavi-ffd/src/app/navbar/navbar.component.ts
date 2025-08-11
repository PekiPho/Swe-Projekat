import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { SearchService, Report } from '../../services/search.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [FormsModule, RouterLink, RouterModule],
})
export class NavbarComponent {
  searchQuery = '';
  suggestions: Report[] = [];
  private searchSubject = new Subject<string>();

  constructor(private router: Router, private searchService: SearchService) {
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
