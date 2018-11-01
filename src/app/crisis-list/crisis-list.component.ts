import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Crisis } from '../crisis';

@Component({
  selector: 'app-crisis-list',
  templateUrl: './crisis-list.component.html',
  styleUrls: ['./crisis-list.component.css']
})
export class CrisisListComponent implements OnInit, OnChanges {

  @Input() list:Crisis[];
  @Input() selected:Crisis;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(){
  }

  onClick(crisis:Crisis){
    this.selected = crisis;
  }

}
