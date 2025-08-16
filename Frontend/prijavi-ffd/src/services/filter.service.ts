import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Region, Severity, Tag } from '../interfaces/media';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  
    private url: string;
    tags:Tag[] = [];
    regions: Region[] = [];
    severities: Severity[] = [];

  constructor(private http:HttpClient){
    this.url = 'https://localhost:7080';
  }
loadTags(){
  return this.http.get<Tag[]>(`${this.url}/Filters/Tags/GetAllTags`);
}
loadRegion(){
  return this.http.get<Region[]>(`${this.url}/Filters/Regions/GetAllRegions`);
  };
loadSeverity(){
  return this.http.get<Severity[]>(`${this.url}/Filters/Severity/GetAllSeverities`);
}
}
