import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommentService } from '../../../services/comment.service';
import { UserService } from '../../../services/user.service';
import { ReportService } from '../../../services/report.service';
import { Observable, of, Subscription, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

import { Report } from '../../../interfaces/report';
import { User } from '../../../interfaces/user';
import { Media } from '../../../interfaces/media';
import { Comment } from '../../../interfaces/comment';

@Component({
  selector: 'app-big-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bigpost.component.html',
  styleUrls: ['./bigpost.component.scss'],
})
export class BigPostComponent implements OnInit, OnDestroy {

  @Input() report!: Report;

  @Output() close = new EventEmitter<void>();
  @Output() followToggled = new EventEmitter<Report>();
  @Output() resolvedClicked = new EventEmitter<{ reportId: string, isResolved: boolean }>();

  public comments$: BehaviorSubject<Comment[]> = new BehaviorSubject<Comment[]>([]);
  public media$: Observable<Media[]> = of([]);
  public newCommentText: string = '';
  
  private currentUser: User | null = null;
  private userSubscription: Subscription | undefined;

  constructor(private commentService: CommentService, private userService: UserService, private reportService: ReportService) {}

  ngOnInit(): void {
    if (this.report) {
      this.commentService.getCommentsFromReport(this.report.id).pipe(
        catchError(err => {
          console.error('Greška pri učitavanju komentara:', err);
          return of([]);
        })
      ).subscribe(comments => {
        this.comments$.next(comments);
      });

      this.media$ = this.getMediaFromReport(this.report.mediaIds || []);
    }

    this.userSubscription = this.userService.userr$.subscribe(user => {
      this.currentUser = user;
    });
  }
  
  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  getMediaFromReport(mediaIds: string[]): Observable<Media[]> {
    if (mediaIds.length === 0) {
      return of([]);
    }
    
    return of(
      mediaIds.map(id => ({
        id: id,
        url: `https://placehold.co/400x250/E9D5FF/6B46C1?text=Media+ID+${id}`,
        contentType: 'image',
        reportId: this.report.id
      }))
    );
  }

  onClose(): void {
    this.close.emit();
  }

  onFollowClick(): void {
    if (!this.report || !this.currentUser || !this.currentUser.username) {
      console.error('Izveštaj ili korisničko ime nisu dostupni.');
      return;
    }

    const isFollowing = this.isUserFollowing();
    
    if (isFollowing) {
      this.report.followerUsernames = this.report.followerUsernames!.filter(username => username !== this.currentUser!.username);
      this.reportService.unfollowReport(this.currentUser!.username, this.report.id).subscribe({
        next: () => {
          console.log('Uspešno otpraćenje na back-endu.');
          this.followToggled.emit(this.report);
        },
        error: (err) => {
          console.error('Greška pri otpraćivanju izveštaja:', err);
          this.report.followerUsernames!.push(this.currentUser!.username);
        }
      });
    } else {
      this.report.followerUsernames!.push(this.currentUser!.username);
      this.reportService.followReport(this.currentUser!.username, this.report.id).subscribe({
        next: () => {
          console.log('Uspešno praćenje na back-endu.');
          this.followToggled.emit(this.report);
        },
        error: (err) => {
          console.error('Greška pri praćenju izveštaja:', err);
          this.report.followerUsernames = this.report.followerUsernames!.filter(username => username !== this.currentUser!.username);
        }
      });
    }
  }

  isUserFollowing(): boolean {
    if (!this.report || !this.report.followerUsernames || !this.currentUser || !this.currentUser.username) {
      return false;
    }
    return this.report.followerUsernames.includes(this.currentUser.username);
  }

  onResolvedClick(): void {
    if (!this.report) {
      return;
    }
    
    const updatedReportDto = {
      resolutionStatus: 'Resolved'
    };

    this.reportService.updateReport(this.report.id, updatedReportDto).subscribe({
      next: () => {
        this.report.resolutionStatus = 'Resolved';
        this.resolvedClicked.emit({ reportId: this.report.id, isResolved: true });
        console.log('Izveštaj je uspešno označen kao rešen.');
      },
      error: (err) => {
        console.error('Greška pri označavanju izveštaja kao rešenog:', err);
      }
    });
  }

 onSubmitComment(): void {
    if (this.newCommentText.trim() && this.currentUser && this.currentUser.username && this.report.id) {
      const commentContent = { content: this.newCommentText.trim() };
      
      this.commentService.createComment(this.currentUser.username, this.report.id, commentContent).subscribe({
        next: (response: any) => {
          console.log('Komentar je uspešno poslat.', response);

          // Učitavanje komentara ponovo da se prikaže novi komentar
          this.commentService.getCommentsFromReport(this.report.id).pipe(
            catchError(err => {
              console.error('Greška pri ponovnom učitavanju komentara:', err);
              return of([]);
            })
          ).subscribe(comments => {
            this.comments$.next(comments);
          });
          
          this.newCommentText = '';
        },
        error: (err) => {
          console.error('Greška pri slanju komentara:', err);
        }
      });
    } else {
      console.error('Komentar ne može biti prazan, korisnik ili izveštaj nisu dostupni.');
    }
  }

  onDeleteClick(){
    this.reportService.deleteReport(this.report.id).subscribe({
      next:()=>{
        console.log('report deleted');
      },
      error:(err)=>console.error(err)
    });
  }
}