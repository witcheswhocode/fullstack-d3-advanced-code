import { Component, Input, SimpleChanges, OnChanges } from '@angular/core'
import * as d3 from "d3"
import { DimensionsType, ScaleType } from '../../../utils/types'

@Component({
  selector: '[appAxis]',
  templateUrl: './axis.component.html',
  styleUrls: ['./axis.component.css']
})
export class AxisComponent implements OnChanges {
  @Input() dimensions: DimensionsType
  @Input() dimension: "x" | "y"
  @Input() scale: ScaleType
  @Input() label: string
  @Input() formatTick: Function
  private ticks: Array<Function>

  constructor() {
    this.dimension = "x"
    this.formatTick = d3.format(",")
  }

  updateTicks() {
    if (!this.dimensions || !this.scale) return

    const numberOfTicks = this.dimension == "x"
      ? this.dimensions.boundedWidth < 600
        ? this.dimensions.boundedWidth / 100
        : this.dimensions.boundedWidth / 250
      : this.dimensions.boundedHeight / 70

    this.ticks = this.scale.ticks(numberOfTicks)
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateTicks()
  }
}
