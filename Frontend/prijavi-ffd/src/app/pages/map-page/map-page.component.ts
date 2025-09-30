import { AfterViewChecked, AfterViewInit, Component } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-page',
  imports: [NavbarComponent],
  templateUrl: './map-page.component.html',
  styleUrl: './map-page.component.scss'
})
export class MapPageComponent implements AfterViewInit{

  private map!: L.Map;

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap():void{

    const srbijaCentar: L.LatLngExpression = [44.5,21.0];
    const zoom=7.5;


    this.map=L.map('map',{
      center:srbijaCentar,
      zoom:zoom
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom:19
    }).addTo(this.map);
  }
}
