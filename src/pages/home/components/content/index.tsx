import React from "react";
import ChinaMap from "../../../../components/2d-map";
import SvgChinaMap from "../../../../components/2d-map/svg-map";
import "./style.css";
export default function Content() {
  return (
    <div className="body">
      <ChinaMap />
      {/* <SvgChinaMap /> */}
    </div>
  );
}
