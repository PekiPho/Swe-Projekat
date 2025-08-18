import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { ActivatedRoute } from '@angular/router';
import { Report } from '../../../interfaces/report';
import { Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { PostListComponent } from '../../shared/post-list/post-list.component'; 
import { SearchService } from '../../../services/search.service';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [NavbarComponent, CommonModule, PostListComponent], 
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
})
export class SearchPageComponent implements OnInit {
  
  reports$: Observable<Report[] | null> = of(null);
  searchQuery: string | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService
  ) { }

  ngOnInit(): void {
    
    this.reports$ = this.route.queryParams.pipe(
      switchMap(params => {
        
        this.searchQuery = params['q'] || null;
        if (this.searchQuery) {
          
          return this.searchService.searchReports(this.searchQuery).pipe(
            catchError(error => {
              console.error('Greška pri dohvatanju objava na osnovu pretrage:', error);
              return of([]);
            })
          );
        }
        
        return of([]);
      })
    );
  }
}