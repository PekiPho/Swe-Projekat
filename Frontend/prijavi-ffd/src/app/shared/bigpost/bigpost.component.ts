import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Report } from '../../../interfaces/report';
import { Comment } from '../../../interfaces/comment';
import { Media } from '../../../interfaces/media';
import { CommentService } from '../../../services/comment.service';
import { Observable, of } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../interfaces/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-big-post',
  standalone: true,
  imports: [CommonModule],
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

  constructor(private commentService: CommentService, private http: HttpClient) {}

  ngOnInit(): void {
    if (this.report) {
      this.comments$ = this.commentService.getCommentsFromReport(this.report.id).pipe(
        catchError(err => {
          return of([]);
        })
      );

      this.media$ = this.getMediaFromReport(this.report.mediaIds || []);
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
        this.report.followerUsernames = this.report.followerUsernames.filter(username => username !== 'currentUser');
      } else {
        this.report.followerUsernames.push('currentUser');
      }
      this.followClicked.emit({ reportId: this.report.id, isFollowing: !isFollowing });
    }
  }

  isUserFollowing(): boolean {
    return this.report && this.report.followerUsernames ? this.report.followerUsernames.includes('currentUser') : false;
  }

  onResolvedClick(): void {
    this.report.resolutionStatus = 'Resolved';
    this.resolvedClicked.emit({ reportId: this.report.id, isResolved: true });
  }

  onSubmitComment(): void {
    if (this.newCommentText.trim()) {
      const currentUserUsername = 'Current User';
      const newCommentContent = { content: this.newCommentText.trim() };
      
      this.commentService.createComment(currentUserUsername, this.report.id, newCommentContent)
        .pipe(
          switchMap(() => this.commentService.getCommentsFromReport(this.report.id)),
          tap(() => this.newCommentText = ''),
          catchError(err => {
            return of([]);
          })
        )
        .subscribe((updatedComments: Comment[]) => {
          if (updatedComments) {
            this.comments$ = of(updatedComments);
          }
        });
    }
  }
}