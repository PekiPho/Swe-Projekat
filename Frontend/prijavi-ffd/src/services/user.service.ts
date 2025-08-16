
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { User } from '../interfaces/user';
import { Report } from '../interfaces/report';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private url: string;

  constructor(private http: HttpClient) {
    this.url = 'https://localhost:7080';
  }

  public userSource = new BehaviorSubject<User | null>(null);
  userr$ = this.userSource.asObservable();

  setUser(user: User) {
    this.userSource.next(user);
  }

  createUser(user: User) {
    return this.http.post(this.url + '/User/AddUser', user, { responseType: 'text' });
  }

  getEntry() {
    const token = localStorage.getItem('token');
    if (!token)
      throw new Error("No token found");
    else {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.get(this.url + "/User/GetEntry", { responseType: 'text', headers });
    }
  }

  checkLogin(mail: string, password: string) {
    return this.http.get(this.url + "/User/GetUserByMailAndPassword/" + mail + "/" + password, { responseType: 'json' })
      .pipe(
        tap((data: any) => {
          if (data.token) {
            localStorage.setItem('token', data.token);
          }
        })
      );
  }

 
  getReportsByUser(username: string) {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.get<Report[]>(`${this.url}/User/GetReportsByUser/${username}`, { headers });
  }

  
  getReportsThatUserIsFollowing(username: string) {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.get<Report[]>(`${this.url}/User/GetReportsThatUserIsFollowing/${username}`, { headers });
  }
}