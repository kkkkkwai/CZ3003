import { Injectable } from '@angular/core';
import { Crises, CrisisDetails } from './mock-crisis';
import { Crisis } from './crisis';
import { Observable, of } from 'rxjs'; 
import { CrisisDetail } from './crisis-detail';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  getCrises():Observable<Crisis[]>{
    return of(Crises);
  }

  getCrisisDetail(id:number):Observable<CrisisDetail>{
    return of(CrisisDetails.find(crisis => crisis.id === id))
  }

}
