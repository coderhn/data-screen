import * as d3 from "d3";
import { MapUtil } from "./map-util";

export class BackgroundLayer extends MapUtil {
  mousemoveFeature: any;
  constructor(
    selector: d3.BaseType | string,
    geojson: d3.ExtendedFeatureCollection,
    projection?: d3.GeoProjection,
    geoGenerator?: d3.GeoPath<any, d3.GeoPermissibleObjects>
  ) {
    super(selector, geojson, projection, geoGenerator);
    if (this.ctx) {
      this.draw();
    }
  }

  draw() {
    this.clearCanvas();
    this.geojson.features.forEach((feature, index) => {
      // @ts-ignore
      this.drawFeature(feature, index);
    });
  }

  clearCanvas() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, 800, 800);
    }
  }

  drawFeature(feature: d3.GeoGeometryObjects, index: number) {
    if (this.ctx) {
      this.ctx.beginPath();
      this.geoGenerator(feature);
      this.ctx.closePath();
      this.ctx.fillStyle = this.getColor(index);
      this.ctx.fill();
      this.ctx.strokeStyle = "rgba(255,255,255,0.4)";
      this.ctx.stroke();

      this.ctx.fillStyle = "#fff";
      //@ts-ignore
      if (feature.properties.name && feature.properties.filename) {
        this.ctx.font = "15px serif";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        // this.ctx.ali
        this.ctx.fillText(
          // @ts-ignore
          feature.properties.name,
          ...this.geoGenerator.centroid(feature)
        );
      }
    }
  }

  getColor(index: number) {
    return this.sequentialScale(index + 70);
  }
}
