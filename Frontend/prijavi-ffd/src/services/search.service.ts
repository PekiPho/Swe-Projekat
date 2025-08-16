
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Report } from '../interfaces/report';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private baseUrl = 'https://localhost:5001/Search'; 

  constructor(private http: HttpClient) {}

  onTypeReports(query: string): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.baseUrl}/OnTypeReports/${query}`);
  }

  searchReports(query: string, page: number = 1): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.baseUrl}/SearchReports/${query}/${page}`);
  }
}