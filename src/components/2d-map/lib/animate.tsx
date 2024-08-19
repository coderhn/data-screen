import { MapUtil } from "./map-util";
import * as d3 from "d3";
function quadraticBezier(p0, p1, p2, t) {
  // 原生实现方法
  const x = Math.pow(1 - t, 2) * p0[0] + 2 * (1 - t) * t * p1[0] + Math.pow(t, 2) * p2[0];
  const y = Math.pow(1 - t, 2) * p0[1] + 2 * (1 - t) * t * p1[1] + Math.pow(t, 2) * p2[1];
  return [x, y];
  // d3内置插值函数方法
  // const interpolate = d3.interpolateNumber; // D3的数值插值函数
  // const x = interpolate(interpolate(p0[0], p1[0])(t), interpolate(p1[0], p2[0])(t))(t);
  // const y = interpolate(interpolate(p0[1], p1[1])(t), interpolate(p1[1], p2[1])(t))(t);
  // return [x, y];
}

export class Animate extends MapUtil {
  geoCoordinatePairs: Array<[[number, number], [number, number]]>;
  screenCoordinatePairs: Array<[[number, number], [number, number]]>;
  u = 0;
  mousemoveFeature: any;
  constructor(
    selector: d3.BaseType | string,
    geojson: d3.ExtendedFeatureCollection,
    geoCoordinatePairs: Array<[[number, number], [number, number]]>,
    projection?: d3.GeoProjection,
    geoGenerator?: d3.GeoPath<any, d3.GeoPermissibleObjects>
  ) {
    super(selector, geojson, projection, geoGenerator);
    this.geoCoordinatePairs = geoCoordinatePairs;
    this.screenCoordinatePairs = this.convertToScreenCoordinates();
    if (this.ctx) {
      this.draw();
      this.selection.on("mousemove", this.onMousemove.bind(this));
    }
  }

  convertToScreenCoordinates() {
    return this.geoCoordinatePairs?.map(([starts, ends]) => {
      return [this.projection(starts), this.projection(ends)];
    }) as Array<[[number, number], [number, number]]>;
  }

  drawCircle() {
    this.ctx.clearRect(0, 0, 807, 605);
    this.screenCoordinatePairs?.forEach(([starts, ends]) => {
      if (starts && ends) {
        const [x, y] = starts; // 使用 starts 坐标作为圆心
        const radius = 5 + 10 * this.u; // 固定半径，可以根据需要调整
        this.ctx.beginPath();

        this.ctx.arc(x, y, radius, 0, (1 / 3) * Math.PI);
        this.ctx.stroke();
        this.ctx.beginPath();

        this.ctx.arc(x, y, radius, (2 / 3) * Math.PI, Math.PI);
        this.ctx.stroke();
        this.ctx.beginPath();

        this.ctx.arc(x, y, radius, (4 / 3) * Math.PI, (5 / 3) * Math.PI);
        this.ctx.stroke();
        this.ctx.beginPath();

        this.ctx.arc(x, y, radius, 0, 2 * Math.PI); // 绘制圆
        const interpolateRed = d3.interpolate("rgba(255,255,255, 0)", "rgba(255,255,255, 1)");
        this.ctx.fillStyle = interpolateRed(1 - this.u); // 根据 u 进行颜色插值
        this.ctx.lineWidth = 0.5;
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = "rgba(29,245,245,1)";
        const midPoint = [(starts[0] + ends[0]) / 2, (starts[1] + ends[1]) / 2];
        const controlPoint = [midPoint[0], midPoint[1] - 125]; // 控制点的Y坐标提升，使得曲线向上弯曲
        this.ctx.moveTo(starts[0], starts[1]);
        this.ctx.quadraticCurveTo(controlPoint[0], controlPoint[1], ends[0], ends[1]);
        this.ctx.stroke();

        this.ctx.beginPath();
        const point = quadraticBezier(starts, controlPoint, ends, this.u);
        this.ctx.arc(point[0], point[1], 5, 0, 2 * Math.PI); // 半径为5的圆
        this.ctx.fillStyle = "rgb(29,245,245)";
        this.ctx.fill();
      }
    });
  }

  draw() {
    this.drawCircle();
    this.u += 0.006;
    if (this.u > 1) {
      this.u = 0;
    }
    this.drawFeature();

    requestAnimationFrame(() => {
      this.draw();
    });
  }

  /**
   *
   * @param mousemoveLocation
   * @returns 根据地理位置坐标找到对应的地理集合
   */
  getFeatureAtMousePosition(mousemoveLocation: [number, number] | null) {
    if (!mousemoveLocation) {
      return false;
    }
    return this.geojson.features.find((item) => d3.geoContains(item, mousemoveLocation));
  }

  onMousemove(e: any) {
    let pos = d3.pointer(e);
    // @ts-ignore 投影可逆
    const mousemoveLocation = this.projection.invert(pos);
    this.mousemoveFeature = this.getFeatureAtMousePosition(mousemoveLocation);
  }

  drawFeature() {
    if (this.mousemoveFeature) {
      this.geoGenerator(this.mousemoveFeature);
      this.ctx.fillStyle = "rgba(255,255,255,0.4)";
      this.ctx.fill();
      console.log("this.mousemoveFeature", this.mousemoveFeature);
      this.ctx.fillStyle = "#fff";
    }
  }
}
