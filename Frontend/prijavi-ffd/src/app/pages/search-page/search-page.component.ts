
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
  
  reports: Report[] =[];
  searchQuery: string ='';
  
  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService
  ) { }

  ngOnInit(): void {
    
    this.route.paramMap.subscribe(params=>{
      this.searchQuery=params.get('query') || '';
      this.doSearch();
    });
  }

  doSearch(){

    if(!this.searchQuery){
      this.reports=[];
      return;
    }

    this.searchService.searchReports(this.searchQuery).subscribe({
      next:(data)=>{
        this.reports=data;
      },
      error:(err)=>{
        console.log(err);
        this.reports=[];
      }
    })
  }
}