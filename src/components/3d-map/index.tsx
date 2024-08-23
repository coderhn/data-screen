import React, { useEffect, useRef } from "react";
import { CameraArray } from "./lib";

type Props = {};

export default function CameraArrayDom({}: Props) {
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) {
      return;
    }
    const a = new CameraArray();
    ref.current = true;
  }, []);
  return <div>index</div>;
}
