/* eslint-disable react-hooks/exhaustive-deps */
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as THREE from "three";
import { angleToRadians, createSideGeometry } from "../../utils";

const initialState = {
  params: {
    width: 21.4,
    length: 43.4,
    depth: 27.8,
    flapGap: 1,
    thickness: 1,
    fluteFreq: 0.9,
    widthSegments: 300,
  },
  els: {
    backHalf: {
      width: {
        top: new THREE.Mesh(),
        side: new THREE.Mesh(),
        bottom: new THREE.Mesh(),
      },
      length: {
        top: new THREE.Mesh(),
        side: new THREE.Mesh(),
        bottom: new THREE.Mesh(),
      },
    },
    frontHalf: {
      width: {
        top: new THREE.Mesh(),
        side: new THREE.Mesh(),
        bottom: new THREE.Mesh(),
      },
      length: {
        top: new THREE.Mesh(),
        side: new THREE.Mesh(),
        bottom: new THREE.Mesh(),
      },
    },
  },
  animated: {
    openingAngle: 0.02 * Math.PI,
  },
};

const Boxes = ({ initialSize }) => {
  const [boxesGroup, setBoxesGroup] = useState([]);
  const [angle] = useState(() => ({
    v: 0,
    flapAngles: {
      backHalf: {
        width: {
          top: 0,
          bottom: Math.PI,
        },
        length: {
          top: 0,
          bottom: Math.PI,
        },
      },
      frontHalf: {
        width: {
          top: 0,
          bottom: Math.PI,
        },
        length: {
          top: 0,
          bottom: Math.PI,
        },
      },
    },
  }));
  
  function updatePanelTransform() {
    boxesGroup.forEach((b, idx) => {
      b.rotation.y = angle.v;
      boxesGroup.forEach((b, idx) => {
        if (b.name === "front") {
          b.children.forEach((flap) => {
            switch (flap.name) {
              case "top-width":
                flap.rotation.x = angle.flapAngles.frontHalf.width.top;
                break;
              case "top-length":
                flap.rotation.x = angle.flapAngles.frontHalf.length.top;
                break;
              case "bottom-width":
                flap.rotation.x = angle.flapAngles.frontHalf.width.bottom;
                break;
              case "bottom-length":
                flap.rotation.x = -angle.flapAngles.frontHalf.length.bottom;
                break;
              default:
                break;
            }
          });
        } else {
          b.children.forEach((flap) => {
            switch (flap.name) {
              case "top-width":
                flap.rotation.x = angle.flapAngles.backHalf.width.top;
                break;
              case "top-length":
                flap.rotation.x = angle.flapAngles.backHalf.length.top;
                break;
              case "bottom-width":
                flap.rotation.x = angle.flapAngles.backHalf.width.bottom;
                break;
              case "bottom-length":
                flap.rotation.x = angle.flapAngles.backHalf.length.bottom;
                break;
              default:
                break;
            }
          });
        }
      });
    });
  }

  const createBoxElements = () => {
    const newBox = { ...initialState, params: { ...initialSize } };
    const newBoxesGroup = [...boxesGroup];
    const boxMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x9c8d7b),
      side: THREE.DoubleSide,
    });
    const boxMesh = new THREE.Mesh();
    const numberOfBoxes = 4;

    for (let i = 0; i < numberOfBoxes; i++) {
      newBoxesGroup[i] = boxMesh.clone();
      const side = i % 2 === 0 ? "width" : "length";

      const half = i % 2 === 0 ? "front" : "back";
      const sideWidth =
        side === "width" ? newBox.params.width : newBox.params.length;
      const positionX =
        side === "width" ? newBox.params.length : newBox.params.width;

      const flapWidth = sideWidth - 0.5 * newBox.params.flapGap;
      const flapHeight = 0.5 * newBox.params.width;

      const sidePlaneGeometry = new THREE.PlaneGeometry(
        sideWidth,
        newBox.params.depth,
        Math.floor(5 * sideWidth),
        Math.floor(0.2 * newBox.params.depth)
      );
      const flapPlaneGeometry = new THREE.PlaneGeometry(
        flapWidth,
        flapHeight,
        Math.floor(5 * flapWidth),
        Math.floor(0.2 * flapHeight)
      );

      const sideGeometry = createSideGeometry(
        sidePlaneGeometry,
        newBox.params,
        [sideWidth, newBox.params.depth],
        [true, true, true, true],
        false
      );
      const topGeometry = createSideGeometry(
        flapPlaneGeometry,
        newBox.params,
        [flapWidth, flapHeight],
        [false, false, true, false],
        true
      );
      const bottomGeometry = createSideGeometry(
        flapPlaneGeometry,
        newBox.params,
        [flapWidth, flapHeight],
        [true, false, false, false],
        true
      );

      sideGeometry.translate(-0.5 * sideWidth, 0.5 * newBox.params.depth, 0);
      newBoxesGroup[i].geometry = sideGeometry;
      newBoxesGroup[i].material = boxMaterial.clone();

      const flapTop = boxMesh.clone();
      flapTop.name = `top-${side}`;
      topGeometry.translate(-0.5 * flapWidth, 0.5 * flapHeight, 0);
      flapTop.geometry = topGeometry;
      flapTop.material = boxMaterial.clone();
      flapTop.position.y = newBox.params.depth;
      flapTop.position.x = 0;

      const flapBottom = boxMesh.clone();
      flapBottom.name = `bottom-${side}`;
      bottomGeometry.translate(-0.5 * flapWidth, 0.5 * flapHeight, 0);
      flapBottom.geometry = bottomGeometry;
      flapBottom.material = boxMaterial.clone();

      flapBottom.rotation.x = angle.flapAngles.frontHalf.width.bottom;
      flapBottom.position.x = 0;

      newBoxesGroup[i].add(flapBottom);
      newBoxesGroup[i].add(flapTop);

      newBoxesGroup[i].name = half;
      if (i > 0) {
        newBoxesGroup[i - 1].add(newBoxesGroup[i]);
        newBoxesGroup[i].position.x = -positionX;
      } else {
        newBoxesGroup[i].position.y = -0.5 * newBox.params.depth;
      }
    }

    console.log('newBoxesGroup',newBoxesGroup);
    setBoxesGroup(newBoxesGroup);
  };

  useLayoutEffect(() => {
    createBoxElements();
  }, [initialSize]);

  useEffect(() => {
    gsap
      .timeline({
        onUpdate: updatePanelTransform,
      })
      .to(angle, {
        duration: 1.5,
        v: angleToRadians(90),
        ease: "power1.out",
      })
      .to(
        [angle.flapAngles.backHalf.width, angle.flapAngles.frontHalf.width],
        {
          duration: 1,
          bottom: angleToRadians(90),
          ease: "back.in(3)",
        },
        1.6
      )
      .to(
        angle.flapAngles.backHalf.length,
        {
          duration: 1.5,
          bottom: angleToRadians(90),
          ease: "back.in(2)",
        },
        1.6
      )
      .to(
        angle.flapAngles.frontHalf.length,
        {
          duration: 1,
          bottom: angleToRadians(90),
          ease: "back.in(3)",
        },
        1.6
      )
      .to(
        [angle.flapAngles.backHalf.width, angle.flapAngles.frontHalf.width],
        {
          duration: 1,
          top: angleToRadians(90),
          ease: "back.in(3)",
        },
        2.8
      )
      .to(
        angle.flapAngles.backHalf.length,
        {
          duration: 1,
          top: angleToRadians(90),
          ease: "back.in(3)",
        },
        3.2
      )
      .to(
        angle.flapAngles.frontHalf.length,
        {
          duration: 1,
          top: angleToRadians(90),
          ease: "back.in(4)",
        },
        3.2
      );
  }, [boxesGroup]);

  return (
    boxesGroup.length > 0 && (
      <mesh position={[-(initialSize.length + initialSize.width) * 0.5, 0, 0]}>
        <primitive object={boxesGroup[0]} />
      </mesh>
    )
  );
};

const Canvas3D = ({ initialSize }) => {
  const orbitControlRef = useRef(null);
  const { camera } = useThree();

  useFrame(() => {
    if (orbitControlRef.current) {
      orbitControlRef.current.update();
    }
  });

  useEffect(() => {
    if (initialSize) {
      camera.position.set(
        0,
        initialSize.depth ,
        initialSize.width + initialSize.length + initialSize.depth
      );
    }
  }, [initialSize]);
  return (
    <>
      <OrbitControls
        ref={orbitControlRef}
        enableZoom
        enableDamping
        autoRotateSpeed={0.25}
        autoRotate={true}
      />
      <PerspectiveCamera
        makeDefault
        position={[
          0,
          initialSize.depth,
          initialSize.width + initialSize.length + initialSize.depth,
        ]}
        fov={45}
        far={1000}
        near={10}
      />
      {/* <Line start={[0, -1000, 0]} end={[0, 1000, 0]} color="#000000" />
      <Line start={[-1000, 0, 0]} end={[1000, 0, 0]} color="#000000" /> */}
      <ambientLight args={["#ffffff", 1]}>
        <group>
          <pointLight color="#fff" position={[100, 0, 50]} intensity={0.7} />
          <pointLight color="#fff" position={[-30, 300, 0]} intensity={0.5} />
        </group>
      </ambientLight>
      <Boxes initialSize={initialSize} />
    </>
  );
};

export default Canvas3D;
