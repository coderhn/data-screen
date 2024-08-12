import React from "react";
import Title from "./components/title";
import Content from "./components/content";
import Left from "./components/left";
type Props = {};

export default function Home({}: Props) {
  return (
    <>
      <Title />
      {/* <Left /> */}
      <Content />
    </>
  );
}
