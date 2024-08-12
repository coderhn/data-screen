import React from "react";
import ChinaMap from "../../../../components/2d-map";
import SvgChinaMap from "../../../../components/2d-map/svg-map";

type Props = {};

export default function Content({}: Props) {
  return (
    <div>
      <ChinaMap />
      {/* <SvgChinaMap /> */}
    </div>
  );
}
