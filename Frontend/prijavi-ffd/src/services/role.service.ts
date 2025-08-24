import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  
  private url:string;

  constructor(private http:HttpClient){
    this.url='https://localhost:7080';
  }
  giveUserARole(username:string, roleName:string):Observable<string>{
    return this.http.put(`${this.url}/Role/GiveUserARole/${username}/${roleName}`,{}, { responseType: 'text' });
  }
  removeRoleFromUser(username:string):Observable<string>{
    return this.http.put(`${this.url}/Role/RemoveRoleFromUser/${username}`,{}, { responseType: 'text' });
  }
  getRoleByName(roleName:string):Observable<string>{
    return this.http.get<string>(`${this.url}/Role/GetRoleByName/${roleName}`);
  }
}
