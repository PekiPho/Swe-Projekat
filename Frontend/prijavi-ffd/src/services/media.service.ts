import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Media } from '../interfaces/media';

@Injectable({
 providedIn: 'root'
})
export class MediaService {
 private apiUrl = 'https://localhost:7080'; 
 private mediaControllerUrl = `${this.apiUrl}/Media`;

 constructor(private http: HttpClient) { }

 getMediaByReportId(reportId: string): Observable<Media[]> {
     return this.http.get<Media[]>(`${this.mediaControllerUrl}/GetMediaFromReport/${reportId}`);
 }

 getMediaBaseUrl(): string {  
     return this.apiUrl;
 }
}