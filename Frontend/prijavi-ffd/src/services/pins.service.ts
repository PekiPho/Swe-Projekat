import { HttpClient, HttpParams } from '@angular/common/http';
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

  getPinsFiltered(
  south: number,
  north: number,
  west: number,
  east: number,
  tags?: string[],
  severities?: string[],
  regions?: string[],
  resolutionStatuses?: string[]
  ) {
    let params = new HttpParams()
      .set('south', south.toString())
      .set('north', north.toString())
      .set('west', west.toString())
      .set('east', east.toString());

    tags?.forEach(tag => params = params.append('tags', tag));
    severities?.forEach(s => params = params.append('severities', s));
    regions?.forEach(r => params = params.append('regions', r));
    resolutionStatuses?.forEach(r => params = params.append('resolutionStatuses', r));


    console.log(`/Pins/GetFilteredPins?${params.toString()}`);

    return this.http.get<ReportPinDto[]>(`${this.url}/Pins/GetFilteredPins`, { params });
  }


  getPinByReport(reportId:string){
    return this.http.get<Pin>(`${this.url}/Pins/GetPinByReport/${reportId}`);
  }

  updatePinLatLon(pinId:string,lat:number,lon:number){
    return this.http.put<any>(`${this.url}/Pins/UpdatePinLatLon/${pinId}/${lat}/${lon}`,{});
  }
}
