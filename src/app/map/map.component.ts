import { Component, OnInit, NgZone } from '@angular/core';
import { tileLayer, latLng, Marker, marker, icon, Icon, layerGroup, Layer, LayerGroup } from 'leaflet'; 
import { DataService } from '../data.service';
import { Crisis } from '../crisis';
import { CustomMarker } from './custom-marker';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  crises:Crisis[];
  fireMarkers:CustomMarker[] = [];
  gasLeakMarkers:CustomMarker[] = [];
  diseaseMarkers:CustomMarker[] = [];
  otherMarkers:CustomMarker[] = [];
  fireLayer:LayerGroup;
  gasLeakLayer:LayerGroup;
  diseaseLayer:LayerGroup;
  otherLayer:LayerGroup;

  selected:Crisis;

  icon:Icon = icon({
    iconSize: [ 25, 41 ],
    iconAnchor: [ 13, 41 ],
    iconUrl: 'leaflet/marker-icon.png',
    shadowUrl: 'leaflet/marker-shadow.png'
  })

  constructor(private dataService:DataService, private _ngZone:NgZone) { }

  ngOnInit() {
    this.getCrises();
  }

  getCrises():void{
    this.dataService.getCrises().subscribe(
      crises => this.crises = crises
    );
    this.crises.forEach(crisis=>{
      var marker = new CustomMarker(crisis.location, crisis.id).bindPopup(crisis.summary);
      marker.on("click", ()=>{this.onClickMarker(marker)});
      switch(crisis.type){
        case "fire":
          this.fireMarkers.push(marker.setIcon(this.icon));
          break;
        
        case "gasLeak":
          this.gasLeakMarkers.push(marker.setIcon(this.icon));
          break;
        
        case "disease":
          this.diseaseMarkers.push(marker.setIcon(this.icon));
          break;
        
        default:
          this.otherMarkers.push(marker.setIcon(this.icon));
        
      };
    });
    this.fireLayer = layerGroup(this.fireMarkers);
    this.gasLeakLayer = layerGroup(this.gasLeakMarkers);
    this.diseaseLayer = layerGroup(this.diseaseMarkers);
    this.otherLayer = layerGroup(this.otherMarkers);
    this.layersControl.overlays = {
      "Fire": this.fireLayer,
      "Gas Leak": this.gasLeakLayer,
      "Disease": this.diseaseLayer,
      "Other": this.otherLayer
    };
    this.options.layers = [this.streetMap, this.fireLayer,this.gasLeakLayer, this.diseaseLayer, this.otherLayer]
  }

  streetMap =  tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    detectRetina: true
  })

  layersControl = {overlays: {}};

  options = {
    layers: [],
    zoom: 11,
    center: latLng([1.2904753, 103.8520359])
  };

  onClickMarker(marker:CustomMarker){
    this._ngZone.run(
      ()=>(this.selected = this.crises.find(
        (c)=>c.id===marker.id
      )
    ));
  }
}
