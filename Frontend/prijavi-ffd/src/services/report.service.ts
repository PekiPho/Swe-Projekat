import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { Report } from '../interfaces/report';
@Injectable({
  providedIn: 'root'
})
export class ReportService {
  
  private url:string;
  
  constructor(private http:HttpClient){
    this.url='https://localhost:7080';
  }

addReport(username: string, report: any, file?: File) {
  const formData = new FormData();

  formData.append('reportJson', JSON.stringify(report));

  if (file) {
    formData.append('files', file);
  }

  return this.http.post(
    this.url + "/Report/AddReport/" + username,
    formData,
    { responseType: 'json' }
  );
}
getReportsFromUser(username:string,page?:number){
  if(!page)
    return this.http.get<Report[]>(`${this.url}/Report/GetReportsByUser/${username}`);
  else return this.http.get<Report[]>(`${this.url}/Report/GetReportsByUser/${username}/${page}`);
}
getReportById(reportId:string){
  return this.http.get<Report>(`${this.url}/Report/GetReportById/${reportId}`);
}
getReportsThatUserIsFollowing(username:string, page?:number){
  if(!page)
    return this.http.get<Report[]>(`${this.url}/Report/GetReportsThatUserIsFollowing/${username}`);
  else return this.http.get<Report[]>(`${this.url}/Report/GetReportsThatUserIsFollowing/${username}/${page}`);
}
getFollowersFromReport(reportId:string){
  return this.http.get<User[]>(`${this.url}/Report/GetFollowersFromReport/${reportId}`);
}
getFollowedReports(username:string){
  return this.http.get<Report[]>(`${this.url}/Report/GetFollowedReports/${username}`);
}
getReportsFiltered(
  page: number = 1,
  tags?: string[],
  severityLevel?: string,
  resolutionStatus?: string,
  region?: string
) {
  let params = new HttpParams();

  if (tags?.length) params = params.set('tags', tags.join(','));
  if (severityLevel) params = params.set('severityLevel', severityLevel);
  if (resolutionStatus) params = params.set('resolutionStatus', resolutionStatus);
  if (region) params = params.set('region', region);

  return this.http.get<Report[]>(`${this.url}/Report/GetReportsFiltered/${page}`, { params });
}
}
