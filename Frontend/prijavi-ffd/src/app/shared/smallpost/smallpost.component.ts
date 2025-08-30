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
  @Output() followClicked = new EventEmitter<{ reportId: string, isFollowing: boolean }>();

  public currentUserUsername: string | null = null;
  private userSubscription: Subscription | undefined;

  constructor(private reportService: ReportService, private userService: UserService) {}

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
    
    if (!this.report || !this.currentUserUsername) {
      console.error('Izveštaj ili korisničko ime nisu dostupni.');
      return;
    }

    const isFollowing = this.isUserFollowing();
    
    // Optimistic UI: Ažuriraj lokalno stanje pre poziva ka backendu
    if (isFollowing) {
      this.report.followerUsernames = this.report.followerUsernames!.filter(username => username !== this.currentUserUsername);
      this.reportService.unfollowReport(this.currentUserUsername, this.report.id).subscribe({
        next: () => console.log('Successfully unfollowed on backend.'),
        error: (err) => {
          console.error('Greška pri otpraćivanju izveštaja:', err);
          // Opcionalno: vrati promenu ako backend poziv ne uspe
          this.report.followerUsernames!.push(this.currentUserUsername!);
        }
      });
    } else {
      this.report.followerUsernames!.push(this.currentUserUsername!);
      this.reportService.followReport(this.currentUserUsername, this.report.id).subscribe({
        next: () => console.log('Successfully followed on backend.'),
        error: (err) => {
          console.error('Greška pri praćenju izveštaja:', err);
          // Opcionalno: vrati promenu ako backend poziv ne uspe
          this.report.followerUsernames = this.report.followerUsernames!.filter(username => username !== this.currentUserUsername);
        }
      });
    }

    this.followClicked.emit({ reportId: this.report.id, isFollowing: !isFollowing });
  }
  
  isUserFollowing(): boolean {
    if (!this.report || !this.report.followerUsernames || !this.currentUserUsername) {
      return false;
    }
    return this.report.followerUsernames.includes(this.currentUserUsername);
  }
}