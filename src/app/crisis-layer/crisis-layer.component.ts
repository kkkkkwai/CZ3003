import { Component, OnInit, NgZone, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import { Crisis } from '../crisis';
import { Marker, LayerGroup, icon, Icon, marker, layerGroup, Layer, divIcon } from 'leaflet';
import { DataService } from '../data.service';
import { CustomMarker } from '../map/custom-marker';
import { Temperature } from '../weather';

@Component({
  selector: 'app-crisis-layer',
  templateUrl: './crisis-layer.component.html',
  styleUrls: ['./crisis-layer.component.css']
})
export class CrisisLayerComponent implements OnInit, OnChanges {

  @Input() crises:Crisis[];
  @Input() temps:Temperature[];

  fireMarkers:CustomMarker[] = [];
  gasLeakMarkers:CustomMarker[] = [];
  diseaseMarkers:CustomMarker[] = [];
  otherMarkers:CustomMarker[] = [];
  tempMarkers:Marker[] = [];
  fireLayer:LayerGroup;
  gasLeakLayer:LayerGroup;
  diseaseLayer:LayerGroup;
  otherLayer:LayerGroup;
  tempLayer:LayerGroup;
  empty = layerGroup();
  
  crisisByType:Crisis[][] = [[],[],[],[]];
  markers = [{val:this.fireMarkers},{val:this.gasLeakMarkers},{val:this.diseaseMarkers},{val:this.otherMarkers},{val:this.tempMarkers}]
  layers:LayerGroup[] = [this.fireLayer, this.gasLeakLayer, this.diseaseLayer, this.otherLayer, this.tempLayer];

  checked_names = [['Fire',true], ['Gas Leak', true], ['Disease', true], ['Others', true], ["Temperature", false]];
  checked_layers = [{val:this.fireLayer}, {val:this.gasLeakLayer}, {val:this.diseaseLayer}, {val:this.otherLayer}, {val:this.tempLayer}];
  
  checkedCrisis:Crisis[];
  selected:Crisis;

  icon:Icon = icon({
    iconSize: [ 25, 41 ],
    iconAnchor: [ 13, 41 ],
    iconUrl: 'leaflet/marker-icon.png',
    shadowUrl: 'leaflet/marker-shadow.png'
  })

  @Output() selectEvent:EventEmitter<Crisis> = new EventEmitter();
  @Output() checkEvent:EventEmitter<Crisis[]> = new EventEmitter();
  
  constructor(private dataService:DataService, private _ngZone:NgZone) { }

  ngOnInit() {
  }
  
  ngOnChanges(){
    this.initLayers();
  }

  initLayers():void{
    // this.emptyAll();
    this.crises.forEach( crisis => {
      var marker:CustomMarker = new CustomMarker(crisis.location, crisis.id).bindPopup(crisis.summary);
      marker.on("click", ()=>{this.onClickMarker(marker)});
      switch(crisis.type){
        case "fire":
          this.fireMarkers.push(marker.setIcon(this.icon));
          this.crisisByType[0].push(crisis);
          break;
        
        case "gasLeak":
          this.gasLeakMarkers.push(marker.setIcon(this.icon));
          this.crisisByType[1].push(crisis);
          break;
        
        case "disease":
          this.diseaseMarkers.push(marker.setIcon(this.icon));
          this.crisisByType[2].push(crisis);
          break;
        
        default:
          this.otherMarkers.push(marker.setIcon(this.icon));
          this.crisisByType[3].push(crisis);
      };
    });

    this.temps.forEach(temp =>{
      this.tempMarkers.push(marker(temp.location, {icon:divIcon({html:temp.value.toString()+" °C"})}))
    });
    console.log(this.temps);
    // console.log(this.tempMarkers);

    this.fireLayer = layerGroup(this.fireMarkers);
    this.gasLeakLayer = layerGroup(this.gasLeakMarkers);
    this.diseaseLayer = layerGroup(this.diseaseMarkers);
    this.otherLayer = layerGroup(this.otherMarkers);
    this.tempLayer = layerGroup(this.tempMarkers);
    this.checked_layers = [{val:this.fireLayer}, {val:this.gasLeakLayer}, {val:this.diseaseLayer}, {val:this.otherLayer}, {val:this.empty}];
    // this.checkEvent.emit(this.crises);
  }

  onClickMarker(marker:CustomMarker){
    this._ngZone.run(()=>{
        this.selected = this.crises.find(
        (c)=>c.id===marker.id
        );
        this.selectEvent.emit(this.selected);
        // console.log(this.selected);
      });
  }

  onClickCheckbox(index:number){
    if(this.checked_names[index][1]===true){
      this.checked_names[index][1]=false;
      this.checked_layers[index].val = this.empty;
    }
    else{
      this.checked_names[index][1]=true;
      this.checked_layers[index].val = layerGroup(this.markers[index].val);
      console.log(this.markers[index].val);
    }
    this.checkedCrisis = [];
    // console.log(this.checkedCrisis);
    this.checked_names.forEach((item, i)=>{
      if(i<4 && item[1]){
        this.checkedCrisis = this.checkedCrisis.concat(this.crisisByType[i]);
        // console.log(this.crisisByType[i]);
      }
    });
    // console.log(this.checkedCrisis);
    this.checkEvent.emit(this.checkedCrisis);
    // console.log(this.checkedCrisis);
  }

  emptyAll(){
    this.fireMarkers = [];
    this.gasLeakMarkers = [];
    this.diseaseMarkers = [];
    this.otherMarkers = [];
    this.tempMarkers = [];
    this.crisisByType.forEach(item =>{
      item = [];
    });
  }
}
