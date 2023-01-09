import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import React, { useEffect, useRef, useState } from "react";
import Line from "../common/Line/Line";
import * as THREE from "three";
import { MOCK_DATA } from "../../utils/constant";
import { polarToCartesian } from "../../utils";

function BleedsLine({ color = "#65C42F" }) {
  const [geometry, setGeometry] = useState(null);

  useEffect(() => {
    const path = new THREE.Path();
    MOCK_DATA.traditional.bleeds.forEach((bleed) => {
      if (bleed.mtd === "M") {
        path.moveTo(bleed.x, bleed.y);
      }
      if (bleed.mtd === "L") {
        path.lineTo(bleed.x, bleed.y);
      }

      if (bleed.mtd === "Z") {
        path.closePath();
      }
    });
    const points = path.getPoints();
    const newGeometry = new THREE.BufferGeometry().setFromPoints(points);
    setGeometry(newGeometry);
  }, []);

  return (
    <line>
      {geometry && <primitive object={geometry} />}
      <lineBasicMaterial color={color} />
    </line>
  );
}

function CutLine({ color = "#5152A8" }) {
  const [geometry, setGeometry] = useState(null);

  useEffect(() => {
    const path = new THREE.Path();
    MOCK_DATA.traditional.cuts.forEach((bleed) => {
      if (bleed.mtd === "M") {
        path.moveTo(bleed.x, bleed.y);
      }
      if (bleed.mtd === "L") {
        path.lineTo(bleed.x, bleed.y);
      }

      if (bleed.mtd === "A") {
        path.absellipse(
          bleed.x,
          bleed.y,
          bleed.rx,
          bleed.ry,
          0,
          0,
          true,
          0,
        );
      }

      if (bleed.mtd === "Z") {
        path.closePath(bleed.x, bleed.y);
      }
    });
    // path.lineTo(0, 800);
    // path.quadraticCurveTo(0, 1000, 200, 1000);
    // path.lineTo(1000, 1000);

    const points = path.getPoints();
    console.log("points", points);
    const newGeometry = new THREE.BufferGeometry().setFromPoints(points);
    setGeometry(newGeometry);
  }, []);

  return (
    <line>
      {geometry && <primitive object={geometry} />}
      <lineBasicMaterial color={color} />
    </line>
  );
}

const Shape2D = ({ initialSize }) => {
  return (
    <>
      <OrbitControls enableZoom enableDamping />
      <Line
        start={[0, -MOCK_DATA.traditional.totalX, 0]}
        end={[0, MOCK_DATA.traditional.totalX, 0]}
        color="#ccc"
      />
      <Line
        start={[-MOCK_DATA.traditional.totalY, 0, 0]}
        end={[MOCK_DATA.traditional.totalY, 0, 0]}
        color="#ccc"
      />
      <PerspectiveCamera
        makeDefault
        fov={45}
        near={10}
        far={(MOCK_DATA.traditional.totalX + MOCK_DATA.traditional.totalY) * 2}
        position={[
          0,
          0,
          MOCK_DATA.traditional.totalX + MOCK_DATA.traditional.totalY,
        ]}
      />
      <group
        position={[
          -MOCK_DATA.traditional.totalX * 0.5,
          -MOCK_DATA.traditional.totalY * 0.5,
          0,
        ]}
      >
        <BleedsLine />
      </group>
      <group
        position={[
          -MOCK_DATA.traditional.totalX * 0.5 + MOCK_DATA.traditional.bleedline,
          -MOCK_DATA.traditional.totalY * 0.5 + MOCK_DATA.traditional.bleedline,
          0,
        ]}
      >
        <CutLine />
      </group>
    </>
  );
};

export default Shape2D;
