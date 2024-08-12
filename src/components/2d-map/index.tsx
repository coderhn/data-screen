import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./style.css";
import mapBc1 from "../../assets/map_bc_1.png";
import mapBc from "../../assets/map.png";

type Props = {};

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

const WIDTH = 807;
const HEIGHT = 605;
let u = 0;

let sequentialScale = d3.scaleSequential().domain([0, 100]).interpolator(d3.interpolateRainbow);

let zoom = d3.zoom().on("zoom", handleZoom);

function handleZoom(e) {
  // const context = d3
  //   .select("#content canvas")
  //   .node()
  //   // @ts-ignore
  //   ?.getContext("2d") as CanvasRenderingContext2D;
  // context.save();
  // context.setTransform(e.transform);
  d3.select("#content canvas").attr("zoom", e.zoom);
  // context.restore();
}

function initZoom() {
  d3.select("#content canvas").call(zoom);
}

export default function ChinaMap({}: Props) {
  const isCreatedRef = useRef(false);
  const contextRef = useRef<CanvasRenderingContext2D>();
  const intervalRef = useRef<number>();
  let londonLonLat: [number, number] = [116.407526, 39.90403];
  let newYorkLonLat: [number, number] = [121.473701, 31.230416];

  const mousemoveLocationRef = useRef<[number, number]>();

  // @ts-ignore
  let geoInterpolator = d3.geoInterpolate(londonLonLat, newYorkLonLat);

  const update = (
    context: CanvasRenderingContext2D,
    geoGenerator: d3.GeoPath<any, d3.GeoPermissibleObjects>,
    projection: d3.GeoProjection,
    geoJson: d3.ExtendedFeatureCollection
  ) => {
    context?.clearRect(0, 0, WIDTH, HEIGHT);
    context.drawImage(document.getElementById("mapBc") as HTMLImageElement, 0, 0, WIDTH, HEIGHT);
    context.drawImage(document.getElementById("mapBc1") as HTMLImageElement, -5, 20, WIDTH, HEIGHT);
    // 遍历geojson对象根据每个feature对象生成地图（为什么这样做，方便后面按省进行鼠标交互），填充、描边地图
    geoJson.features?.forEach((d, i) => {
      const centroid = geoGenerator.centroid(d);

      context.beginPath();

      const isHover =
        mousemoveLocationRef.current && d3.geoContains(d, mousemoveLocationRef.current);
      geoGenerator(d);
      context.fillStyle = isHover ? "rgba(125,125,125,1)" : sequentialScale(i + 70);
      context.fill();
      context.strokeStyle = "#fff";
      context.stroke();

      if (isHover) {
        context.beginPath();
        context.arc(centroid[0], centroid[1], 2, 0, 2 * Math.PI);
        context.fill();
        context.fillStyle = "#fff";
        context.font = "25px serif";
        context.fillText(d.properties!.name, centroid[0], centroid[1]);
      }
    });

    context.beginPath();
    // 绘制圆圈
    let circleGenerator = d3.geoCircle().radius(1 * u);
    context.lineWidth = 0.5;
    const interpolateRed = d3.interpolate("rgba(255, 0, 0, 0)", "rgba(255, 0, 0, 1)");
    context.strokeStyle = "red";
    geoGenerator(circleGenerator.center(londonLonLat)());
    context.fillStyle = interpolateRed(1 - u);
    context.fill();
    context.stroke();

    // 绘制两省之间的弧线
    // 将地理坐标转换为屏幕坐标
    const london = projection(londonLonLat)!;
    const newYork = projection(newYorkLonLat)!;

    // 计算贝塞尔曲线的控制点，位于起点和终点的中间位置，并向上移动一定距离
    const midPoint = [(london[0] + newYork[0]) / 2, (london[1] + newYork[1]) / 2];
    const controlPoint = [midPoint[0], midPoint[1] - 125]; // 控制点的Y坐标提升，使得曲线向上弯曲

    context.moveTo(london[0], london[1]);
    context.quadraticCurveTo(controlPoint[0], controlPoint[1], newYork[0], newYork[1]);
    context.stroke();

    // Point
    context.beginPath();
    const point = quadraticBezier(london, controlPoint, newYork, u);
    context.arc(point[0], point[1], 5, 0, 2 * Math.PI); // 半径为5的圆
    context.fillStyle = "red";
    context.fill();

    u += 0.006;

    if (u > 1) {
      u = 0;
    }
    isCreatedRef.current = true;
  };

  useEffect(() => {
    contextRef.current = d3
      .select("#content canvas")
      .node()
      // @ts-ignore
      ?.getContext("2d") as CanvasRenderingContext2D;
    d3.json("https://geojson.cn/api/data/china.json").then((geojson: any) => {
      if (isCreatedRef.current) {
        return;
      }

      // 1、声明矩形投影
      const projection = d3
        .geoMercator()
        // .center([107, 31])
        .fitExtent(
          [
            [0, 0],
            [WIDTH, HEIGHT],
          ],
          geojson
        ) as d3.GeoProjection;

      // 2、声明路径生成器
      const geoGenerator = d3
        .geoPath()
        .projection(projection)
        .pointRadius(4)
        .context(contextRef.current!);

      function animate(
        context: CanvasRenderingContext2D,
        geoGenerator: d3.GeoPath<any, d3.GeoPermissibleObjects>,
        projection: d3.GeoProjection,
        geoJson: d3.ExtendedFeatureCollection
      ) {
        update(contextRef.current!, geoGenerator, projection, geojson);
        window.requestAnimationFrame(() => animate(context, geoGenerator, projection, geoJson));
      }

      animate(contextRef.current!, geoGenerator, projection, geojson);

      const onMousemove = (e: any) => {
        if (!projection) {
          return;
        }
        let pos = d3.pointer(e);
        mousemoveLocationRef.current = projection.invert(pos)!;
        // update(contextRef.current!, geoGenerator, projection, geojson);
      };

      d3.select("#content canvas").on("mousemove", onMousemove);
      initZoom();

      return () => {
        window.clearInterval(intervalRef.current);
      };
    });
  }, []);
  return (
    <div id="content">
      <canvas width={WIDTH} height={HEIGHT}></canvas>
      <img id="mapBc" src={mapBc} style={{ display: "none" }} />
      <img id="mapBc1" src={mapBc1} style={{ display: "none" }} />
      {/* <div className="bounding-box"></div> */}
    </div>
  );
}
