import React, { useEffect, useRef } from "react";
import Bar from "../../../../components/bar";

type Props = {};

export default function Left({}: Props) {
  const barRef = useRef<Bar>();

  const data = useRef([
    { label: "苹果", value: 1, color: "#000" },
    { label: "橘子", value: 2, color: "pink" },
    { label: "香蕉", value: 7, color: "yellow" },
    { label: "橙子", value: 3, color: "blue" },
  ]);

  const lastItem = useRef(data.current.pop());

  useEffect(() => {
    if (barRef.current) {
      return;
    }
    barRef.current = new Bar({
      selector: "#bar",
      data: [
        { label: "苹果", value: 1, color: "#000" },
        { label: "橘子", value: 2, color: "pink" },
        { label: "香蕉", value: 7, color: "yellow" },
      ],
    });
  }, []);
  return (
    <div>
      <svg width={400} height={400}>
        <g id="bar"></g>
      </svg>

      <button
        onClick={() => {
          // setInterval(() => {
          //   const shiftData = data.current.shift();
          //   data.current.push(lastItem.current!);
          //   barRef.current?.init(data.current);
          //   lastItem.current = shiftData;
          // }, 50);
          const shiftData = data.current.shift();
          data.current.push(lastItem.current!);
          barRef.current?.init(data.current);
          lastItem.current = shiftData;

          // const top = data.current.shift()!;
          // data.current.push(top);

          // setInterval(() => {
          //   const shiftData = data.current.shift();
          //   // const top = data.current.shift()!;
          //   // data.current.push(top);
          //   data.current.push(lastItem.current!);
          //   barRef.current?.init(data.current);
          //   lastItem.current = shiftData;
          // }, 3 * 1000);
          // barRef.current?.init([{ label: "苹果", value: 100 }]);
        }}
      >
        测试更新
      </button>
      {/* <Bar
        data={[
          { label: "苹果", value: 1 },
          { label: "橘子", value: 2 },
          { label: "香蕉", value: 7 },
          { label: "橙子", value: 3 },
        ]}
      /> */}
    </div>
  );
}
