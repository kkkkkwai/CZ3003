import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Crises, CrisisDetails } from './mock-crisis';
import { Crisis } from './crisis';
import { Observable, of } from 'rxjs'; 
import { CrisisDetail } from './crisis-detail';
import { RawTemp } from './raw-weather';
import { Temperature } from './weather';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  crisisApi = "";
  weatherApi = "https://api.data.gov.sg/v1/environment/air-temperature";
  psiApi = "";

  constructor(private http:HttpClient) { }

  getCrises():Observable<Crisis[]>{
    return of(Crises);
  }

  getCrisisDetail(id:number):Observable<CrisisDetail>{
    return of(CrisisDetails.find(crisis => crisis.id === id))
  }

  getTemperature():Observable<RawTemp>{
    return this.http.get<RawTemp>(this.weatherApi);
  }

  parseRawWeather(raw: RawTemp):Temperature[]{
    var temps:Temperature[] = [];
    raw.metadata.stations.forEach((station) =>{
      raw.items[0].readings.forEach((reading) =>{
        if(station.id === reading.station_id){
          temps.push({location:[station.location.latitude,station.location.longitude], value: reading.value});
        }
      })
    });
    // console.log(temps);
    return temps;
  }

}
