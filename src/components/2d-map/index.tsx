import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./style.css";
import { Animate, BackgroundLayer, PointPlotter } from "./lib";

const WIDTH = 807;
const HEIGHT = 605;

export default function ChinaMap() {
  const backgroundLayer = useRef<BackgroundLayer>();
  useEffect(() => {
    d3.json("https://geojson.cn/api/data/china.json").then((geojson: any) => {
      if (backgroundLayer.current) {
        return;
      }

      backgroundLayer.current = new BackgroundLayer(
        "#bc",
        geojson,
        d3.geoMercator().fitExtent(
          [
            [0, 0],
            [WIDTH, HEIGHT],
          ],
          geojson
        ) as d3.GeoProjection
      );

      new Animate(
        "#animate-container",
        geojson,
        [
          [
            [121.473701, 31.230416],
            [114.077429, 44.331087],
          ],
          [
            [121.473701, 31.230416],
            [85.294711, 41.371801],
          ],
          [
            [121.473701, 31.230416],
            [88.388277, 31.56375],
          ],
        ],
        d3.geoMercator().fitExtent(
          [
            [0, 0],
            [WIDTH, HEIGHT],
          ],
          geojson
        ) as d3.GeoProjection
      );
    });
  }, []);
  return (
    <div id="content">
      <canvas id="bc" width={WIDTH} height={HEIGHT}></canvas>
      <canvas id="animate-container" width={WIDTH} height={HEIGHT}></canvas>
    </div>
  );
}
