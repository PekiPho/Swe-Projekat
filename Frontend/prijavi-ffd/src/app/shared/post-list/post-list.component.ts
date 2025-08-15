

import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../services/report.service';
import { Report } from '../../../interfaces/report';
import { CommentService } from '../../../services/comment.service'; 
import { Comment } from '../../../interfaces/comment'; 

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  
  reports: Report[] = [];
  comments: Comment[] = []; 
  selectedReportId: string | null = null;

  constructor(
    private reportService: ReportService,
    private commentService: CommentService
  ) { }

  ngOnInit(): void {
    this.getReports();
  }

  private getReports(): void {
    this.reportService.getReportsFiltered(1).subscribe({
      next: (data:Report[]) => {
        this.reports = data;
      },
      error: (err) => {
        console.error('Došlo je do greške prilikom dobavljanja izveštaja:', err);
      }
    });
  }

  
  loadCommentsForReport(reportId: string): void {
    this.selectedReportId = reportId; 
    this.commentService.getCommentsFromReport(reportId).subscribe({
      next: (data) => {
        this.comments = data; 
      },
      error: (err) => {
        console.error('Došlo je do greške prilikom dobavljanja komentara:', err);
      }
    });
  }

  onReportClicked(report: Report): void {
    console.log('Report clicked:', report.id);
    this.loadCommentsForReport(report.id); 
  }
}