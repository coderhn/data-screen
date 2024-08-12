import React, { useEffect } from "react";
import * as d3 from "d3";

export const data = [
  { label: "苹果", value: 1 },
  { label: "橘子", value: 2 },
  { label: "香蕉", value: 7 },
  { label: "橙子", value: 3 },
];

export default class Bar {
  public data;
  public selection: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
  constructor(props: {
    data: Array<{ label: string; value: number; color: string }>;
    selector: string;
  }) {
    this.data = props.data;
    this.selection = d3.select(props.selector);
    this.init(props.data);
  }

  init(data: Array<{ label: string; value: number; color: string }>) {
    this.selection
      .selectAll("rect")
      .data(data, (d) => d.label)
      .join(
        function (enter) {
          return enter
            .append("rect")
            .attr("fill", (d) => d.color)
            .attr("width", 10)
            .attr("height", 10)
            .transition()
            .duration(1 * 1000)
            .attr("x", (d, i) => {
              return i * 20 + 20;
            });
        },
        function (update) {
          console.log("update", update.data());
          return update
            .transition()
            .duration(1000)
            .attr("opacity", 1)
            .attr("x", (d, i) => {
              return i * 20 + 20;
            });
        },
        function (exit) {
          return exit.remove();
        }
      );
  }
}
