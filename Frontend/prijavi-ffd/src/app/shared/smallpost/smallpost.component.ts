import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Report } from '../../../interfaces/report';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-small-post',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './smallpost.component.html',
  styleUrls: ['./smallpost.component.scss'],
})
export class SmallPostComponent {
  
  @Input() report!: Report;

  @Output() reportClicked = new EventEmitter<Report>();

  @Output() followClicked = new EventEmitter<{ reportId: string, isFollowing: boolean }>();

  
  onReportClick(): void {
    this.reportClicked.emit(this.report);
  }

  
  onFollowClick(event: Event): void {
    event.stopPropagation(); 
    
    const isFollowing = this.isUserFollowing();
    if (isFollowing) {
      this.report.followerUsernames = this.report.followerUsernames!.filter(username => username !== 'currentUser');
    } else {
      this.report.followerUsernames!.push('currentUser');
    }
    this.followClicked.emit({ reportId: this.report.id, isFollowing: !isFollowing });
  }
  
  isUserFollowing(): boolean {
    return this.report && this.report.followerUsernames ? this.report.followerUsernames.includes('currentUser') : false;
  }
}