import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./style.css";
type Props = {};

let zoom = d3.zoom().on("zoom", handleZoom);

function handleZoom(e) {
  d3.select("#content g.map").attr("transform", e.transform);
  d3.select("#content g.centroid").attr("transform", e.transform);
  d3.selectAll("#content path").attr("transform", e.transform);
}

function initZoom() {
  d3.select("#content svg").call(zoom);
}
export default function SvgChinaMap({}: Props) {
  const isCreatedRef = useRef(false);

  useEffect(() => {
    d3.json("https://geojson.cn/api/data/china.json").then((geojson: any) => {
      if (isCreatedRef.current) {
        return;
      }
      const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
      //   这个根据自己的布局要求来，内容宽度和高度自己定
      let projection = d3.geoEquirectangular().fitExtent(
        [
          [5, 5],
          [800, 800],
        ],
        geojson
      );
      let geoGenerator = d3.geoPath().projection(projection);
      d3.select("#content g.map")
        .selectAll("path")
        .data(geojson.features)
        .join("path")
        // @ts-ignore
        .attr("d", (d) => {
          // @ts-ignore
          return geoGenerator(d);
        })
        .attr("fill", (d) => {
          // @ts-ignore
          return colorScale(d.properties.name);
        })
        .attr("stroke", "#fff")
        .attr("stroke-width", 1)
        .attr("opacity", 0.8)
        .on("mouseenter", (event, d) => {
          d3.select(event.currentTarget).attr("opacity", 1);
          // @ts-ignore
          let centroid = geoGenerator.centroid(d);
          d3.select("#content .centroid")
            .style("display", "inline")
            .attr("transform", "translate(" + centroid + ")");
          // @ts-ignore
          d3.select("#content .centroid text").text(d.properties.name);
        })
        .on("mouseleave", (event) => {
          d3.select(event.currentTarget).attr("opacity", 0.8);
        });
      const svg = d3.select("#content svg");

      // 多条飞线的起点和终点数组
      const locationsArr = [
        [
          [116.407526, 39.90403], // 北京
          [121.473701, 31.230416], // 上海
        ],
        [
          [116.407526, 39.90403], // 北京
          [113.429919, 23.334643], // 广州
        ],
        [
          [116.407526, 39.90403], // 北京
          [88.388277, 31.56375], // 西藏
        ],
        [
          [116.407526, 39.90403], // 北京
          [101.485106, 25.008643], // 云南
        ],
      ];

      locationsArr.forEach((locations) => {
        const source = projection(locations[0]);
        const target = projection(locations[1]);
        const controlPoint = [(source[0] + target[0]) / 2, source[1] - 100];

        // 生成贝塞尔曲线路径
        const pathData = `M${source[0]},${source[1]} Q${controlPoint[0]},${controlPoint[1]} ${target[0]},${target[1]}`;

        // 添加飞线
        const flyLine = svg
          .append("path")
          .attr("d", pathData)
          .attr("fill", "none")
          .attr("stroke", "red")
          .attr("stroke-width", 2)
          .attr("opacity", 0.8);

        // 添加飞线的动画
        const totalLength = flyLine.node().getTotalLength();

        flyLine
          .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
          .attr("stroke-dashoffset", totalLength)
          .transition()
          .duration(2000)
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0)
          .attrTween("stroke-width", function () {
            return function (t) {
              return d3.interpolateString("0", "2")(t);
            };
          })
          .attrTween("opacity", function () {
            return function (t) {
              return d3.interpolateNumber(0, 1)(t);
            };
          });
      });

      // initZoom();
      isCreatedRef.current = true;
    });
  }, []);
  return (
    <div id="content">
      <svg width={800} height={800}>
        <g className="map"></g>
        <g className="centroid">
          <circle r="4"></circle>
          <text></text>
        </g>
      </svg>
    </div>
  );
}
