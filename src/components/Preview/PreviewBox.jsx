import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as THREE from "three";
import { angleToRadians } from "../../utils";

const initialState = {
  params: {
    width: 21.4,
    widthLimits: [15, 70],
    length: 43.4,
    lengthLimits: [70, 120],
    depth: 27.8,
    depthLimits: [15, 70],
    flapGap: 1,
    thickness: 1,
    thicknessLimits: [0.1, 1],
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
    openingAngle: angleToRadians(0),
  },
};

const Boxes = () => {
  const [box, setBox] = useState(initialState);
  const [boxesGroup, setBoxesGroup] = useState([]);
  const [angle] = useState(() => ({
    v: angleToRadians(90),
    flapAngles: {
      backHalf: {
        width: {
          top: angleToRadians(90),
          bottom: angleToRadians(90),
        },
        length: {
          top: angleToRadians(90),
          bottom: angleToRadians(90),
        },
      },
      frontHalf: {
        width: {
          top: angleToRadians(90),
          bottom: angleToRadians(90),
        },
        length: {
          top: angleToRadians(90),
          bottom: angleToRadians(90),
        },
      },
    },
  }));

  function updateSceneScroll() {
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
    const newBox = { ...box };
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

      const sidePlaneGeometry = new THREE.PlaneGeometry(
        sideWidth,
        newBox.params.depth
      );

      const sideGeometry = sidePlaneGeometry;
      sideGeometry.translate(-0.5 * sideWidth, 0.5 * newBox.params.depth, 0);
      newBoxesGroup[i].geometry = sideGeometry;
      newBoxesGroup[i].material = boxMaterial.clone();

      const flapWidth = sideWidth - 0.5 * newBox.params.flapGap;
      const flapHeight = 0.5 * newBox.params.width;
      const flapPlaneGeometry = new THREE.PlaneGeometry(flapWidth, flapHeight);

      const flapTop = boxMesh.clone();
      flapTop.name = `top-${side}`;
      const topGeometry = flapPlaneGeometry.clone();
      topGeometry.translate(-0.5 * flapWidth, 0.5 * flapHeight, 0);
      flapTop.geometry = topGeometry;
      flapTop.material = boxMaterial.clone();
      flapTop.position.y = box.params.depth;
      flapTop.position.x = 0;

      const flapBottom = boxMesh.clone();
      flapBottom.name = `bottom-${side}`;
      const bottomGeometry = flapPlaneGeometry.clone();
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
        newBoxesGroup[i].rotation.y = angle.v;
      } else {
        newBoxesGroup[i].position.y = -0.5 * newBox.params.depth;
        newBoxesGroup[i].rotation.y = angle.v;
      }
    }
    setBoxesGroup(newBoxesGroup);
  };

  useLayoutEffect(() => {
    createBoxElements();
  }, []);

  useEffect(() => {
    gsap
      .timeline({
        onUpdate: updateSceneScroll,
      })

      .to(
        angle.flapAngles.backHalf.length,
        {
          duration: 1,
          top: angleToRadians(-90),
          ease: "power1.out",
        },
        0
      )
      .to(
        angle.flapAngles.frontHalf.length,
        {
          duration: 1,
          top: angleToRadians(-90),
          ease: "back.in(4)",
        },
        1
      )
      .to(
        [angle.flapAngles.backHalf.width, angle.flapAngles.frontHalf.width],
        {
          duration: 1,
          top: angleToRadians(-90),
          ease: "power1.out",
        },
        1
      );
  }, [boxesGroup]);

  return (
    boxesGroup.length > 0 && (
      <mesh position={[-(box.params.length + box.params.width) * 0.5, 0, 0]}>
        <primitive object={boxesGroup[0]} />
      </mesh>
    )
  );
};

const PreviewBox = ({ initialSize }) => {
  const orbitControlRef = useRef(null);
  useFrame(() => {
    if (orbitControlRef.current) {
      orbitControlRef.current.update();
    }
  });
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
        position={[-20, 60, 100]}
        fov={45}
        far={1000}
        near={10}
      />
      <ambientLight args={["#ffffff", 1]}>
        <group>
          <pointLight color="#fff" position={[100, 0, 50]} intensity={0.7} />
          <pointLight color="#fff" position={[-30, 300, 0]} intensity={0.5} />
        </group>
      </ambientLight>
      <Boxes />
    </>
  );
};

export default PreviewBox;
