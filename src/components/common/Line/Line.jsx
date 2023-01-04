import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";

const Line = ({ start, end, color }) => {
  const ref = useRef();
  useLayoutEffect(() => {
    ref.current.geometry.setFromPoints(
      [start, end].map((point) => new THREE.Vector3(...point))
    );
  }, [start, end]);
  return (
    <line ref={ref}>
      <bufferGeometry />
      <lineBasicMaterial color={color} />
    </line>
  );
};

export default Line;
