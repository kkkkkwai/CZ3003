import { Component, OnInit, NgZone } from '@angular/core';
import { Crisis } from '../crisis';
import { Marker, LayerGroup, icon, Icon, marker, layerGroup, Layer } from 'leaflet';
import { DataService } from '../data.service';
import { CustomMarker } from '../map/custom-marker';

@Component({
  selector: 'app-crisis-layer',
  templateUrl: './crisis-layer.component.html',
  styleUrls: ['./crisis-layer.component.css']
})
export class CrisisLayerComponent implements OnInit {

  crises:Crisis[];
  fireMarkers:CustomMarker[] = [];
  gasLeakMarkers:CustomMarker[] = [];
  diseaseMarkers:CustomMarker[] = [];
  otherMarkers:CustomMarker[] = [];
  fireLayer:LayerGroup;
  gasLeakLayer:LayerGroup;
  diseaseLayer:LayerGroup;
  otherLayer:LayerGroup;
  layers:Layer[];

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
    this.crises.forEach( crisis => {
      var marker:CustomMarker = new CustomMarker(crisis.location, crisis.id).bindPopup(crisis.summary);
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
    this.layers = [this.fireLayer, this.gasLeakLayer, this.diseaseLayer, this.otherLayer]
  }

  onClickMarker(marker:CustomMarker){
    this._ngZone.run(
      ()=>(this.selected = this.crises.find(
        (c)=>c.id===marker.id
      )
    ));
  }
}
