import { AfterViewChecked, AfterViewInit, Component } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import * as L from 'leaflet';
import { ReportPinDto } from '../../../interfaces/media';
import { PinsService } from '../../../services/pins.service';

@Component({
  selector: 'app-map-page',
  imports: [NavbarComponent],
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.scss']
})
export class MapPageComponent implements AfterViewInit{

  private map!: L.Map;

  private pinsLayer= L.layerGroup();

  private pins:ReportPinDto[]=[];
  private loadedPins = new Set<string>();

  constructor(private pinService:PinsService){}

  ngAfterViewInit(): void {
    this.initMap();

    this.loadPins();

    this.map.on('moveend', ()=> this.loadPins());
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

    this.pinsLayer.addTo(this.map);
  }


  currentFilters={
    tags: [] as string[],
    severities: [] as string[],
    regions: [] as string[],
    resolutionStatuses: ['unsolved'] as string[]
  };

  private loadPins(){

    
    if(!this.map) return;

    const bounds = this.map.getBounds();

    const south = bounds.getSouth();
    const north = bounds.getNorth();
    const west = bounds.getWest();
    const  east = bounds.getEast();

    this.pinService.getPinsFiltered(south,north,west,east,
      this.currentFilters.tags,
      this.currentFilters.severities,
      this.currentFilters.regions,
      this.currentFilters.resolutionStatuses
    ).subscribe({
      next:(newPins)=>{

        newPins.forEach(pin =>{
          if(this.loadedPins.has(pin.reportId)) return;

          this.loadedPins.add(pin.reportId);

          this.pins.push(pin);

          let fillColor = '#999';
          if (pin.tags && pin.tags.length > 0) {
            const tag = pin.tags[0].toLowerCase();
            if (tag.includes('electricity')) fillColor = 'yellow';
            else if (tag.includes('water')) fillColor = 'blue';
            else if (tag.includes('road')) fillColor = 'gray';
            else if (tag.includes('building')) fillColor = 'orange';
            else if (tag.includes('land')) fillColor = 'green';
          }

          let borderColor = 'black';
          if (pin.resolutionStatus === 'solving') borderColor = 'yellow';
          else if (pin.resolutionStatus === 'solved') borderColor = 'green';

          let severityColor = 'green';
          const severity = parseInt(pin.severityLevel || '1', 10);
          if (severity === 2) severityColor = '#a2d149';
          else if (severity === 3) severityColor = 'yellow';
          else if (severity === 4) severityColor = 'orange';
          else if (severity >= 5) severityColor = 'red';


          const marker=L.circleMarker([pin.latitude,pin.longitude],{
            radius: 8,
            color:borderColor,
            fillColor:fillColor,
            fillOpacity: 1,
            weight:2
          });

          const outerStick=L.polyline([
            [pin.latitude,pin.longitude],
            [pin.latitude-0.0002,pin.longitude]
          ],{
            color:borderColor,
            weight:6
          });

          const stick= L.polyline([
            [pin.latitude,pin.longitude],
            [pin.latitude-0.0002,pin.longitude]
          ],{
            color:severityColor,
            weight:4
          });

          
          outerStick.addTo(this.pinsLayer);
          stick.addTo(this.pinsLayer);
          marker.addTo(this.pinsLayer);
          
        });

        console.log(newPins);
      },
      error:(err)=>{
        console.log(err);
      }
    });
  }
}
