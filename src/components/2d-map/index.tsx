import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./style.css";
import { Animate, BackgroundLayer, PointPlotter } from "./lib";
import CameraArrayDom from "../3d-map";

const WIDTH = 807;
const HEIGHT = 605;

export default function ChinaMap() {
  const backgroundLayer = useRef<BackgroundLayer>();
  // useEffect(() => {
  //   d3.json("https://geojson.cn/api/data/china.json").then((geojson: any) => {
  //     if (backgroundLayer.current) {
  //       return;
  //     }

  //     backgroundLayer.current = new BackgroundLayer(
  //       "#bc",
  //       geojson,
  //       d3.geoMercator().fitExtent(
  //         [
  //           [0, 0],
  //           [WIDTH, HEIGHT],
  //         ],
  //         geojson
  //       ) as d3.GeoProjection
  //     );

  //     new Animate(
  //       "#animate-container",
  //       geojson,
  //       [
  //         [
  //           [121.473701, 31.230416],
  //           [114.077429, 44.331087],
  //         ],
  //         [
  //           [121.473701, 31.230416],
  //           [85.294711, 41.371801],
  //         ],
  //         [
  //           [121.473701, 31.230416],
  //           [88.388277, 31.56375],
  //         ],
  //       ],
  //       d3.geoMercator().fitExtent(
  //         [
  //           [0, 0],
  //           [WIDTH, HEIGHT],
  //         ],
  //         geojson
  //       ) as d3.GeoProjection
  //     );
  //   });
  // }, []);

  return (
    <div id="content">
      <CameraArrayDom />
      <canvas id="bc" width={WIDTH} height={HEIGHT}></canvas>
      <canvas id="animate-container" width={WIDTH} height={HEIGHT}></canvas>

      {/* <div className="point-container">
        <img
          src="https://easyv.assets.dtstack.com/data/100464/608484/img/b9u452re7p_1637822498613_ozuwa7q59j.png"
          alt=""
        />
        <img
          src="https://easyv.assets.dtstack.com/data/100464/608484/img/1m06p34k2_1637822605721_nl60o5b6h3.png"
          alt=""
        />
        <img
          src="https://easyv.assets.dtstack.com/data/100464/608484/img/dybn0e7lf8_1637822520826_vu2sm2smwf.png"
          alt=""
        />
        <img
          src="https://easyv.assets.dtstack.com/data/100464/608484/img/tpyxwkgtf8_1637822529356_4mkxwe9n3m.png"
          alt=""
        />
        <img
          src="https://easyv.assets.dtstack.com/data/100464/608484/img/fv3swciuc7_1637822538887_yqcosdj91p.png"
          alt=""
        />
      </div> */}
    </div>
  );
}
