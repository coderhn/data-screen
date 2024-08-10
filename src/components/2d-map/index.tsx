import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./style.css";
type Props = {};

function quadraticBezier(p0, p1, p2, t) {
  const x = Math.pow(1 - t, 2) * p0[0] + 2 * (1 - t) * t * p1[0] + Math.pow(t, 2) * p2[0];
  const y = Math.pow(1 - t, 2) * p0[1] + 2 * (1 - t) * t * p1[1] + Math.pow(t, 2) * p2[1];
  return [x, y];
}

export default function ChinaMap({}: Props) {
  const isCreatedRef = useRef(false);
  const geojsonRef = useRef<any>({});
  const contextRef = useRef<CanvasRenderingContext2D>();
  let londonLonLat: [number, number] = [116.407526, 39.90403];
  let newYorkLonLat: [number, number] = [121.473701, 31.230416];
  // @ts-ignore
  let geoInterpolator = d3.geoInterpolate(londonLonLat, newYorkLonLat);
  let u = 0;

  const update = (
    context: CanvasRenderingContext2D,
    geoGenerator: d3.GeoPath<any, d3.GeoPermissibleObjects>,
    projection: d3.GeoProjection
  ) => {
    isCreatedRef.current = true;
    context?.clearRect(0, 0, 800, 800);

    let circleGenerator = d3.geoCircle().center([116.407526, 39.90403]).radius(1);
    contextRef.current?.beginPath();
    contextRef.current!.strokeStyle = "red";
    geoGenerator(circleGenerator());
    contextRef.current?.stroke();
    context.lineWidth = 0.5;
    context.strokeStyle = "#333";
    context.beginPath();

    geoGenerator({ type: "FeatureCollection", features: geojsonRef.current.features });
    context.stroke();
    context.beginPath();

    context.strokeStyle = "red";
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

    u += 0.01;
    if (u > 1) u = 0;
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
      let projection = d3.geoEquirectangular().fitExtent(
        [
          [5, 5],
          [800, 800],
        ],
        geojson
      );
      // 2、声明路径生成器
      const geoGenerator = d3
        .geoPath()
        .projection(projection)
        .pointRadius(4)
        .context(contextRef.current!);
      geojsonRef.current = geojson;
      // 3、定时绘制canvas
      window.setInterval(update.bind(this, contextRef.current!, geoGenerator, projection), 50);
    });
  }, []);
  return (
    <div id="content">
      <canvas width="800" height="800"></canvas>
    </div>
  );
}
