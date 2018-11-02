import { Component, OnInit, NgZone } from '@angular/core';
import { tileLayer, latLng, Marker, marker, icon, Icon, layerGroup, Layer, LayerGroup, map } from 'leaflet'; 
import { DataService } from '../data.service';
import { Crisis } from '../crisis';
import { CustomMarker } from './custom-marker';
import { Temperature } from '../weather';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  crises:Crisis[] = [];
  selected:Crisis;
  checked:Crisis[] = [];

  temps:Temperature[] = [];

  icon:Icon = icon({
    iconSize: [ 25, 41 ],
    iconAnchor: [ 13, 41 ],
    iconUrl: 'leaflet/marker-icon.png',
    shadowUrl: 'leaflet/marker-shadow.png'
  })

  constructor(private dataService:DataService, private _ngZone:NgZone) { }

  ngOnInit() {
    this.getCrises();
    this.getWeather();
  }

  getCrises():void{
    this.dataService.getCrises().subscribe(crises => {
      crises.forEach(c => {
        this.checked.push(c);
        this.crises.push(c);
      });
    }
    );
    this.options.layers = [this.streetMap];
  }

  getWeather():void{
    this.dataService.getTemperature().subscribe(raw => {
        this.dataService.parseRawWeather(raw).forEach(t => this.temps.push(t));
        console.log(this.temps);
      }
    )
  }

  streetMap =  tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    detectRetina: true
  })

  layersControl = {overlays: {}};

  options = {
    layers: [],
    zoom: 11,
    center: latLng([1.2904753, 103.8520359]),
    doubleClickZoom: false
  };

  mapClick(){
    this.selected = null;
  }

  receiveSelect(selected:Crisis){
    this.selected = selected;
    // console.log(selected);
  }

  receiveCheck(checked:Crisis[]){
    this.checked = checked;
  }
}
