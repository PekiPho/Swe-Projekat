import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommentService } from '../../../services/comment.service';
import { UserService } from '../../../services/user.service';
import { Observable, of, Subscription } from 'rxjs'; 
import { switchMap, catchError, tap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

// Importi tvojih interfejsa
import { Report } from '../../../interfaces/report';
import { User } from '../../../interfaces/user';
import { Media } from '../../../interfaces/media';
import { Comment } from '../../../interfaces/comment';
import { ReportService } from '../../../services/report.service';

@Component({
  selector: 'app-big-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bigpost.component.html',
  styleUrls: ['./bigpost.component.scss'],
})
export class BigPostComponent implements OnInit {

  @Input() report!: Report;

  @Output() close = new EventEmitter<void>();
  @Output() followClicked = new EventEmitter<{ reportId: string, isFollowing: boolean }>();
  @Output() resolvedClicked = new EventEmitter<{ reportId: string, isResolved: boolean }>();

  public comments$: Observable<Comment[]> = of([]);
  public media$: Observable<Media[]> = of([]);
  public newCommentText: string = '';
  
  private currentUserUsername: string | null = null;
  private userSubscription: Subscription | undefined;

  constructor(private commentService: CommentService, private userService: UserService, private reportService:ReportService) {}

  ngOnInit(): void {
    if (this.report) {
      this.comments$ = this.commentService.getCommentsFromReport(this.report.id).pipe(
        catchError(err => {
          console.error('Error loading comments:', err);
          return of([]);
        })
      );

      this.media$ = this.getMediaFromReport(this.report.mediaIds || []);
    }

    this.userSubscription = this.userService.userr$.subscribe(user => {
      this.currentUserUsername = user?.username || null;
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
    if (this.report && this.report.followerUsernames) {
      const isFollowing = this.isUserFollowing();
      if (isFollowing) {
        this.report.followerUsernames = this.report.followerUsernames.filter(username => username !== this.currentUserUsername);
      } else {
        if (this.currentUserUsername) {
          this.report.followerUsernames.push(this.currentUserUsername);
        }
      }
      this.followClicked.emit({ reportId: this.report.id, isFollowing: !isFollowing });
    }
  }

  isUserFollowing(): boolean {
    return this.report && this.report.followerUsernames && this.currentUserUsername ? this.report.followerUsernames.includes(this.currentUserUsername) : false;
  }

  onResolvedClick(): void {
    this.report.resolutionStatus = 'Resolved';
    this.resolvedClicked.emit({ reportId: this.report.id, isResolved: true });
  }

  onSubmitComment(): void {
    if (this.newCommentText.trim() && this.currentUserUsername) {
      const newCommentContent = { content: this.newCommentText.trim() };
      
      this.commentService.createComment(this.currentUserUsername, this.report.id, newCommentContent)
        .pipe(
          switchMap(() => this.commentService.getCommentsFromReport(this.report.id)),
          tap(() => this.newCommentText = ''),
          catchError(err => {
            console.error('Error submitting comment:', err);
            return of([]);
          })
        )
        .subscribe((updatedComments: Comment[]) => {
          if (updatedComments) {
            this.comments$ = of(updatedComments);
          }
        });
    } else {
      console.error('Komentar ne može biti prazan ili korisnik nije prijavljen.');
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