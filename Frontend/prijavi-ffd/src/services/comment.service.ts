

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../interfaces/comment'; 

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private apiUrl = 'https://localhost:7080/Comments'; 

  constructor(private http: HttpClient) { }


  getCommentsFromReport(reportId: string, page?: number): Observable<Comment[]> {
    if (!page) {
      return this.http.get<Comment[]>(`${this.apiUrl}/GetCommentsFromReport/${reportId}`);
    } else {
      return this.http.get<Comment[]>(`${this.apiUrl}/GetCommentsFromReport/${reportId}/${page}`);
    }
  }


  createComment(username: string, reportId: string, commentContent: { content: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/CreateComment/${username}/${reportId}`, commentContent);
  }


  updateComment(commentId: string, newContent: { content: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateCommentContent/${commentId}`, newContent);
  }

  
  deleteComment(commentId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteComment/${commentId}`);
  }
}