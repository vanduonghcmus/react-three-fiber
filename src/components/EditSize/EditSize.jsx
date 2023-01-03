import { Canvas } from "@react-three/fiber";
import React, { useLayoutEffect, useRef, useState } from "react";
import * as THREE from "three";
import { extend } from "@react-three/fiber";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { Html } from "@react-three/drei";

extend({ TextGeometry });

function Line({ start, end, color }) {
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
}

function Text({ fontSize = 12, color = "#000000", position = [], children }) {
  return (
    <Html position={position}>
      <div
        style={{ width: "100px", color, fontSize, marginTop: 5, marginLeft: 5 }}
      >
        {children}
      </div>
    </Html>
  );
}

function LineBox2D({ length, width, position = { x: 0, y: 0 }, color = "" }) {
  const ref = useRef();
  useLayoutEffect(() => {
    const points = [];
    points.push(new THREE.Vector3(0, 0, 0));
    points.push(new THREE.Vector3(0, length, 0));
    points.push(new THREE.Vector3(width, length, 0));
    points.push(new THREE.Vector3(width, 0, 0));
    points.push(new THREE.Vector3(0, 0, 0));
    ref.current.geometry.setFromPoints(points);
  }, [width, length]);

  return (
    <line ref={ref} position={[position.x, position.y, 0]}>
      <bufferGeometry />
      <lineBasicMaterial color={color} />
    </line>
  );
}

const EditSize = ({ initialValues }) => {
  const [box, setBox] = useState(initialValues);

  function createBoxElements() {
    const newBox = { ...initialValues };

    let previousPositionX = 0;
    for (let halfIdx = 0; halfIdx < 2; halfIdx++) {
      for (let sideIdx = 0; sideIdx < 2; sideIdx++) {
        const half = halfIdx ? "frontHalf" : "backHalf";
        const side = sideIdx ? "width" : "length";

        const sideWidth =
          side === "width" ? newBox.params.width : newBox.params.length;

        const flapWidth = sideWidth - 2 * newBox.params.flapGap;
        const flapHeight =
          0.5 * newBox.params.width - 0.75 * newBox.params.flapGap;

        const flapBoxTop = (
          <LineBox2D
            width={flapWidth}
            length={flapHeight}
            position={{ x: previousPositionX, y: newBox.params.depth }}
            color="#FD3F40"
          />
        );

        const flapBoxBottom = (
          <LineBox2D
            width={flapWidth}
            length={flapHeight}
            position={{ x: previousPositionX, y: -flapHeight }}
            color="#FD3F40"
          />
        );

        newBox.els[half][side].side = (
          <LineBox2D
            width={sideWidth}
            length={newBox.params.depth}
            position={{ x: previousPositionX, y: 0 }}
            color="#FD3F40"
          />
        );

        box.els[half][side].top = flapBoxTop;
        box.els[half][side].bottom = flapBoxBottom;
        previousPositionX = previousPositionX += sideWidth;
      }
    }
    setBox(newBox);
  }

  function renderLineInfo() {
    return (
      <>
        <Text
          position={[box.params.length * 0.5, 0.25 * box.params.depth, 0]}
          color="#FF9E84"
        >
          L: {box.params.length}mm
        </Text>
        <Line
          start={[0, 0.25 * box.params.depth, 0]}
          end={[box.params.length, 0.25 * box.params.depth, 0]}
          color="#FF9E59"
        />
        <Text
          position={[
            box.params.width * 0.25 + box.params.length,
            0.75 * box.params.depth,
            0,
          ]}
          color="#FF9E84"
        >
          L: {box.params.width}mm
        </Text>
        <Line
          start={[box.params.length, 0.75 * box.params.depth, 0]}
          end={[
            box.params.width + box.params.length,
            0.75 * box.params.depth,
            0,
          ]}
          color="#FF9E59"
        />

        <Text
          position={[
            1.5 * (box.params.width + box.params.length),
            0.5 * box.params.depth,
            0,
          ]}
          color="#FF9E84"
        >
          H: {box.params.depth}mm
        </Text>
        <Line
          start={[1.5 * (box.params.width + box.params.length), 0, 0]}
          end={[
            1.5 * (box.params.width + box.params.length),
            box.params.depth,
            0,
          ]}
          color="#FF9E59"
        />
      </>
    );
  }

  useLayoutEffect(() => {
    createBoxElements();
  }, [initialValues]);

  return (
    <Canvas
      dpr={[window.devicePixelRatio, 2]}
      camera={{
        fov: 35,
        near: 10,
        far: 1000,
        position: [0, 0, 800],
      }}
    >
      <Line start={[0, -1000, 0]} end={[0, 1000, 0]} color="000000" />
      <Line start={[-1000, 0, 0]} end={[1000, 0, 0]} color="000000" />

      <group
        position={[
          -(box.params.width + box.params.length),
          -0.5 * box.params.depth,
          0,
        ]}
      >
        {renderLineInfo()}

        {box.els.frontHalf.width.side}
        {box.els.frontHalf.length.side}

        {box.els.backHalf.width.side}
        {box.els.backHalf.length.side}

        {box.els.frontHalf.length.top}
        {box.els.frontHalf.width.top}

        {box.els.backHalf.length.top}
        {box.els.backHalf.width.top}

        {box.els.frontHalf.length.bottom}
        {box.els.frontHalf.width.bottom}

        {box.els.backHalf.length.bottom}
        {box.els.backHalf.width.bottom}
      </group>
    </Canvas>
  );
};

export default EditSize;
