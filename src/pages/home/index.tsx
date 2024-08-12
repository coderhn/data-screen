import React from "react";
import Title from "./components/title";
import Content from "./components/content";
import Left from "./components/left";
import "./style.css";

export default function Home() {
  return (
    <div className="screen">
      <Title />
      {/* <Left /> */}
      <Content />
    </div>
  );
}
