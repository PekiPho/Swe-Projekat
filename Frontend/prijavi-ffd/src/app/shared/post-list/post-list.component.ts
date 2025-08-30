// src/app/pages/shared/post-list/post-list.component.ts

import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
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
export class PostListComponent implements OnInit, OnChanges {
  
  // Ovo svojstvo će primiti rezultate od roditeljske komponente (npr. SearchPageComponent)
  @Input() reportsFromParent: Report[] | null = null;
  
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
    // Provera da li je komponenta na main-page
    if (!this.reportsFromParent) {
      this.loadFilters();
      this.getReports();
    }
  }

  // Ova metoda se poziva kada se promeni @Input() svojstvo (npr. na search-page)
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reportsFromParent'] && changes['reportsFromParent'].currentValue !== undefined) {
      this.reports$ = of(this.reportsFromParent);
    }
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
    let severityLevel: string | undefined = this.selectedSeverity || undefined;
    let resolutionStatus: string | undefined = undefined;

    switch (this.selectedSortOption) {
      case 'resolved':
        resolutionStatus = 'Resolved';
        break;
      case 'unresolved':
        resolutionStatus = 'Unresolved';
        break;
      case 'critical':
        severityLevel = 'Critical';
        break;
      case 'low':
        severityLevel = 'Low';
        break;
      default:
        // 'newest' ili drugi, bez posebnog statusa/severity
        break;
    }

    this.reports$ = this.reportService.getReportsFiltered(
      1, 
      this.selectedTags.length > 0 ? this.selectedTags : undefined,
      severityLevel,
      this.selectedRegion || undefined,
      resolutionStatus
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
    const value = (event.target as HTMLInputElement).value;

    if (filterType === 'severity') {
      this.selectedSeverity = value;
    } else if (filterType === 'region') {
      this.selectedRegion = value;
    } else if (filterType === 'tags') {
      if ((event.target as HTMLInputElement).checked) {
        this.selectedTags.push(value);
      } else {
        this.selectedTags = this.selectedTags.filter(tag => tag !== value);
      }
    }
    this.getReports();
  }
}