import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pin, ReportPinDto } from '../interfaces/media';

@Injectable({
  providedIn: 'root'
})
export class PinsService {
  
  private url:string;

  constructor(private http:HttpClient){
    this.url = 'https://localhost:7080';
  }

  getPinsForCoordinates(south:number, north:number,west:number,east:number){
    return this.http.get<ReportPinDto[]>(`${this.url}/Pins/GetPinsForCoordinates`,{
      params:{
        south: south.toString(),
        north: north.toString(),
        west:west.toString(),
        east: east.toString()
      }
    });
  } 

  getPinByReport(reportId:string){
    return this.http.get<Pin>(`${this.url}/Pins/GetPinByReport/${reportId}`);
  }

  updatePinLatLon(pinId:string,lat:number,lon:number){
    return this.http.put<any>(`${this.url}/Pins/UpdatePinLatLon/${pinId}/${lat}/${lon}`,{});
  }
}
