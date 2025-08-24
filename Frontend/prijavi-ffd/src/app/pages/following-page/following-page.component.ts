import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { CommonModule, DatePipe } from '@angular/common'; 
import { UserService } from '../../../services/user.service'; 
import { ReportService } from '../../../services/report.service'; // Koristite ReportService
import { Report } from '../../../interfaces/report';
import { Comment } from '../../../interfaces/comment';
import { Media } from '../../../interfaces/media';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SmallPostComponent } from '../../shared/smallpost/smallpost.component';
import { BigPostComponent } from '../../shared/bigpost/bigpost.component';

@Component({
  selector: 'app-following-page',
  standalone: true,
  imports: [NavbarComponent, CommonModule, DatePipe, SmallPostComponent, BigPostComponent],
  templateUrl: './following-page.component.html',
  styleUrl: './following-page.component.scss'
})
export class FollowingPageComponent implements OnInit {
  
  followingReports$: Observable<Report[] | null>;
  
  selectedReport: Report | null = null;
  reportComments: Comment[] = [];
  reportMedia: Media[] = [];

  constructor(
    private userService: UserService, 
    private reportService: ReportService // Ubrizgajte ReportService
  ) {
    this.followingReports$ = of(null);
  }

  ngOnInit(): void {
    const user = this.userService.userSource.value;

    if (user && user.username) {
      this.followingReports$ = this.reportService.getReportsThatUserIsFollowing(user.username).pipe(
        catchError(error => {
          console.error('Greška pri dohvatanju praćenih objava:', error);
          return of([]);
        })
      );
    } else {
      this.followingReports$ = of([]);
    }
  }
  
  onReportClicked(report: Report): void {
    this.selectedReport = report;
  }

  onCloseBigPost(): void {
    this.selectedReport = null;
  }
}