import { Component, Input, ViewChild, ElementRef, AfterContentInit, OnChanges, SimpleChanges } from '@angular/core'
import * as d3 from "d3"
import { getUniqueId } from '../chart/utils';
import { DimensionsType, ScaleType } from '../utils/types';

@Component({
  selector: 'app-histogram',
  templateUrl: './histogram.component.html',
  styleUrls: ['./histogram.component.css'],
})
export class HistogramComponent {
  @Input() data: Array<Object>
  @Input() label: string
  @Input() xAccessor: Function


}
