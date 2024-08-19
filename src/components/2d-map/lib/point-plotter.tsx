import { CSSProperties } from "react";
import { MapUtil } from "./map-util";

interface BasePointConfig {
  lng: number;
  lat: number;
  value: number;
}

interface SvgPointConfig extends BasePointConfig {
  elementType?: "circle" | "rect" | "triangle";
  type: "svg";
}

interface CanvasPointConfig extends BasePointConfig {
  elementType?: "circle" | "rect" | "triangle";
  type: "canvas";
}

interface PicturePointConfig extends BasePointConfig {
  style: CSSProperties;
  type: "picture";
}

interface VideoPointConfig extends BasePointConfig {
  style: CSSProperties;
  type: "video";
}

type GeoCoordinatePairs =
  | SvgPointConfig[]
  | CanvasPointConfig[]
  | PicturePointConfig[]
  | VideoPointConfig[];

export class PointPlotter extends MapUtil {
  geoCoordinatePairs: GeoCoordinatePairs;
  constructor(
    selector: d3.BaseType | string,
    geojson: d3.ExtendedFeatureCollection,
    geoCoordinatePairs: GeoCoordinatePairs,
    projection?: d3.GeoProjection,
    geoGenerator?: d3.GeoPath<any, d3.GeoPermissibleObjects>
  ) {
    super(selector, geojson, projection, geoGenerator);
    this.geoCoordinatePairs = geoCoordinatePairs;
    if (this.ctx) {
      this.draw();
    }
  }

  draw() {
    this.geoCoordinatePairs.forEach((item) => {
      this.ctx.beginPath();
      if (item.type === "canvas") {
        this.drawCircle(item);
      }
    });
  }

  drawCircle(item: CanvasPointConfig) {
    const [x, y] = this.projection([item.lng, item.lat])!;
    this.ctx.fillStyle = "#fff";
    this.ctx.arc(x, y, item.value, 0, 2 * Math.PI);
    this.ctx.fill();
  }
}
