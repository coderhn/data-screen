import * as d3 from "d3";
import { MapUtil } from "./map-util";

export class BackgroundLayer extends MapUtil {
  constructor(
    selector: d3.BaseType | string,
    geojson: d3.ExtendedFeatureCollection,
    projection?: d3.GeoProjection,
    geoGenerator?: d3.GeoPath<any, d3.GeoPermissibleObjects>
  ) {
    super(selector, geojson, projection, geoGenerator);
    this.draw();
  }
  draw() {
    this.clearCanvas();
    this.geojson.features.forEach((feature, index) => {
      this.drawFeature(feature, index);
    });
  }

  clearCanvas() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, 800, 800);
    }
  }

  drawFeature(feature: d3.GeoPermissibleObjects, index: number) {
    if (this.ctx) {
      this.ctx.beginPath();
      this.geoGenerator(feature);
      this.ctx.fillStyle = this.getColor(index);
      this.ctx.fill();
      this.ctx.strokeStyle = "rgba(255,255,255,0.4)";
      this.ctx.stroke();
    }
  }

  getColor(index: number) {
    return this.sequentialScale(index + 70);
  }

  init() {
    this.draw();
  }
}
