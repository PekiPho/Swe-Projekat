import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../services/report.service';
import { FilterService } from '../../../services/filter.service';
import { Report } from '../../../interfaces/report';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { SmallPostComponent } from '../../shared/smallpost/smallpost.component';
import { BigPostComponent } from '../../shared/bigpost/bigpost.component';
import { FormsModule } from '@angular/forms';
import { Region, Severity, Tag } from '../../../interfaces/media';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, SmallPostComponent, BigPostComponent, FormsModule],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  
  reports$: Observable<Report[] | null> = of(null);
  selectedReport: Report | null = null;
  selectedSortOption: string = 'newest';
  
  tags: Tag[] = [];
  regions: Region[] = [];
  severities: Severity[] = [];
  
  selectedTags: string[] = [];
  selectedSeverity: string | null = null;
  selectedRegion: string | null = null;
  
  constructor(
    private reportService: ReportService,
    private filterService: FilterService
  ) { }

  ngOnInit(): void {
    this.loadFilters();
    this.getReports();
  }

  loadFilters(): void {
    forkJoin({
      tags: this.filterService.loadTags(),
      regions: this.filterService.loadRegion(),
      severities: this.filterService.loadSeverity()
    }).pipe(
      catchError(err => {
        console.error('Greška pri učitavanju filtera:', err);
        return of({ tags: [], regions: [], severities: [] });
      })
    ).subscribe(results => {
      this.tags = results.tags;
      this.regions = results.regions;
      this.severities = results.severities;
    });
  }

  getReports(): void {
    let sortOptions: { [key: string]: { severityLevel?: string, resolutionStatus?: string } } = {
      'newest': {},
      'resolved': { resolutionStatus: 'Resolved' },
      'unresolved': { resolutionStatus: 'Unresolved' },
      'critical': { severityLevel: 'Critical' },
      'low': { severityLevel: 'Low' }
    };
    
    const options = sortOptions[this.selectedSortOption] || {};
    
    this.reports$ = this.reportService.getReportsFiltered(
      1, 
      this.selectedTags.length > 0 ? this.selectedTags : undefined,
      this.selectedSeverity || options.severityLevel || undefined,
      this.selectedRegion || options.resolutionStatus || undefined
    ).pipe(
      catchError(err => {
        console.error('Došlo je do greške prilikom dobavljanja izveštaja:', err);
        return of([]);
      })
    );
  }

  onReportClicked(report: Report): void {
    this.selectedReport = report;
  }

  onCloseBigPost(): void {
    this.selectedReport = null;
  }

  onSortChange(): void {
    this.selectedSeverity = null;
    this.selectedRegion = null;
    this.selectedTags = [];
    this.getReports();
  }

  onFilterChange(event: Event, filterType: 'severity' | 'region' | 'tags'): void {
    this.selectedSortOption = ''; 

    if (filterType === 'severity') {
      this.selectedSeverity = (event.target as HTMLSelectElement).value;
    } else if (filterType === 'region') {
      this.selectedRegion = (event.target as HTMLSelectElement).value;
    } else if (filterType === 'tags') {
      const value = (event.target as HTMLInputElement).value;
      if ((event.target as HTMLInputElement).checked) {
        this.selectedTags.push(value);
      } else {
        this.selectedTags = this.selectedTags.filter(tag => tag !== value);
      }
    }
    this.getReports();
  }
}