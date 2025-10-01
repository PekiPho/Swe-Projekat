import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../interfaces/user';
import { Report } from '../interfaces/report';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private readonly url: string;

  constructor(private http: HttpClient) {
    this.url = 'https://localhost:7080/Report';
  }

  addReport(username: string, report: any, file?: File, pinLatLng?: { lat: number, lng: number }): Observable<Report> {
    const formData = new FormData();
    formData.append('reportJson', JSON.stringify(report));
    if (file) {
      formData.append('files', file);
    }

    if (pinLatLng) {
    formData.append('pinLat', pinLatLng.lat.toString());
    formData.append('pinLon', pinLatLng.lng.toString());
  }
  
    return this.http.post<Report>(`${this.url}/AddReport/${username}`, formData).pipe(
      catchError(this.handleError)
    );
  }

  getReportsFromUser(username: string, page?: number): Observable<Report[]> {
    const requestUrl = page ? `${this.url}/GetReportsByUser/${username}/${page}` : `${this.url}/GetReportsByUser/${username}`;
    return this.http.get<Report[]>(requestUrl).pipe(
      catchError(this.handleError)
    );
  }

  getReportById(reportId: string){
    return this.http.get<any>(`${this.url}/GetReportById/${reportId}`);
  }

  getReportsThatUserIsFollowing(username: string, page?: number): Observable<Report[]> {
    const requestUrl = page ? `${this.url}/GetReportsThatUserIsFollowing/${username}/${page}` : `${this.url}/GetReportsThatUserIsFollowing/${username}`;
    return this.http.get<Report[]>(requestUrl).pipe(
      catchError(this.handleError)
    );
  }

  getFollowersFromReport(reportId: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}/GetFollowersFromReport/${reportId}`).pipe(
      catchError(this.handleError)
    );
  }

  getFollowedReports(username: string): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.url}/GetFollowedReports/${username}`).pipe(
      catchError(this.handleError)
    );
  }

  getReportsFiltered(
    page: number = 1,
    tags?: string[],
    severityLevel?: string,
    resolutionStatus?: string,
    region?: string
  ): Observable<Report[]> {
    let params = new HttpParams();
    if (tags?.length) {
      params = params.set('tags', tags.join(','));
    }
    if (severityLevel) {
      params = params.set('severityLevel', severityLevel);
    }
    if (resolutionStatus) {
      params = params.set('resolutionStatus', resolutionStatus);
    }
    if (region) {
      params = params.set('region', region);
    }
    return this.http.get<Report[]>(`${this.url}/GetReportsFiltered/${page}`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('Došlo je do klijentske ili mrežne greške:', error.error.message);
    } else {
      console.error(
        `Backend je vratio statusni kod ${error.status}, telo odgovora je: ${JSON.stringify(error.error)}`);
    }
    return throwError(() => new Error('Nešto se desilo, pokušajte ponovo kasnije.'));
  }

  updateReport(reportId: string, dto: any): Observable<any> {
    return this.http.put(`${this.url}/UpdateReport/${reportId}`, dto).pipe(
      catchError(this.handleError)
    );
  }
  
 
  followReport(username: string, reportId: string): Observable<any> {
    return this.http.put(`${this.url}/FollowReport/${username}/${reportId}`, {});
  }

 
  unfollowReport(username: string, reportId: string): Observable<any> {
    return this.http.delete(`${this.url}/UnfollowReport/${username}/${reportId}`).pipe(
      catchError(this.handleError)
    );
  }

  deleteReport(reportId: string): Observable<string> {
  return this.http.delete(`${this.url}/DeleteReport/${reportId}`,{responseType: 'text'});
}
}