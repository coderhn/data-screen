import React, { useEffect } from "react";
import Title from "./components/title";
import Content from "./components/content";
import Left from "./components/left";
import "./style.css";

export default function Home() {
  useEffect(() => {
    console.log("wind", window.devicePixelRatio);
  }, []);
  return (
    <div className="screen">
      <Title />
      {/* <Left /> */}
      <Content />
    </div>
  );
}
