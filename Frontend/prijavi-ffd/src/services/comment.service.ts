import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Comment } from '../interfaces/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private apiUrl = 'https://localhost:7080/Comments'; 

  constructor(private http: HttpClient) { }

  createComment(username: string, reportId: string, commentContent: { content: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/CreateComment/${username}/${reportId}`, commentContent)
      .pipe(
        catchError(this.handleError)
      );
  }

  getCommentsFromReport(reportId: string, page?: number): Observable<Comment[]> {
    let url = `${this.apiUrl}/GetCommentsFromReport/${reportId}`;
    if (page) {
      url += `/${page}`;
    }
    return this.http.get<Comment[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  getComment(commentId: string): Observable<Comment> {
    return this.http.get<Comment>(`${this.apiUrl}/GetComment/${commentId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getCommentsFromUser(username: string, page?: number): Observable<Comment[]> {
    let url = `${this.apiUrl}/GetCommentsFromUser/${username}`;
    if (page) {
      url += `/${page}`;
    }
    return this.http.get<Comment[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateComment(commentId: string, newContent: { content: string }): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}/UpdateCommentContent/${commentId}`, newContent)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  deleteComment(commentId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteComment/${commentId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
     
      console.error('Došlo je do greške:', error.error.message);
    } else {
      
      console.error(
        `Backend je vratio statusni kod ${error.status}, ` +
        `telo odgovora je: ${JSON.stringify(error.error)}`);
    }
    return throwError(() => new Error('Nešto se desilo, pokušajte ponovo kasnije.'));
  }
}