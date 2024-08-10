import React from "react";
import Title from "./components/title";
import Content from "./components/content";
type Props = {};

export default function Home({}: Props) {
  return (
    <>
      <Title />
      <Content />
    </>
  );
}
