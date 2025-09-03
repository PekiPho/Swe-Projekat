import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Report } from '../../../interfaces/report';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../../services/report.service';
import { UserService } from '../../../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-small-post',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './smallpost.component.html',
  styleUrls: ['./smallpost.component.scss'],
})
export class SmallPostComponent implements OnInit, OnDestroy {
  
  @Input() report!: Report;

  @Output() reportClicked = new EventEmitter<Report>();
  
  private currentUserUsername: string | null = null;
  private userSubscription: Subscription | undefined;

  constructor(private userService: UserService, private reportService: ReportService) {}

  ngOnInit(): void {
    this.userSubscription = this.userService.userr$.subscribe(user => {
      this.currentUserUsername = user?.username || null;
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  onReportClick(): void {
    this.reportClicked.emit(this.report);
  }

  onFollowClick(event: Event): void {
    event.stopPropagation();
    
    if (!this.currentUserUsername) {
      console.error('Korisnik nije prijavljen.');
      return;
    }

    const isFollowing = this.isUserFollowing();
    
    if (isFollowing) {
      this.reportService.unfollowReport(this.currentUserUsername, this.report.id).subscribe({
        next: () => {
          console.log('Uspešno otpraćenje na back-endu.');
     
          this.report.followerUsernames = this.report.followerUsernames!.filter(username => username !== this.currentUserUsername);
        },
        error: (err) => {
          console.error('Greška pri otpraćivanju izveštaja:', err);
        }
      });
    } else {
      this.reportService.followReport(this.currentUserUsername, this.report.id).subscribe({
        next: () => {
          console.log('Uspešno praćenje na back-endu.');
          if (!this.report.followerUsernames) {
            this.report.followerUsernames = [];
          }
          
          this.report.followerUsernames.push(this.currentUserUsername!);
        },
        error: (err) => {
          console.error('Greška pri praćenju izveštaja:', err);
        }
      });
    }
  }
  
  isUserFollowing(): boolean {
    if (!this.report || !this.report.followerUsernames || !this.currentUserUsername) {
      return false;
    }
    return this.report.followerUsernames.includes(this.currentUserUsername);
  }
}