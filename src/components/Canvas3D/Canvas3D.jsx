import { OrbitControls, PerspectiveCamera, useHelper } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import gsap from "gsap";
import React, {
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

import Line from "../common/Line/Line";

const Camera = () => {
  const camera = useRef();
  const { aspect } = useThree();
  return (
    <PerspectiveCamera
      ref={camera}
      aspect={aspect}
      fov={45}
      far={1000}
      near={10}
      position={[50, 50, 50]}
      makeDefault
      onUpdate={(self) => self.updateProjectionMatrix()}
    />
  );
};

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
    openingAngle: 0.02 * Math.PI,
  },
};

const Boxes = () => {
  const [box, setBox] = useState(initialState);
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
  function updateSceneScroll() {
    boxesGroup.forEach((b, idx) => {
      if (idx > 0) {
        b.rotation.y = angle.v;
      }
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

  function createSideGeometry(baseGeometry) {
    const offset = (v) =>
      0.5 * box.params.thickness * Math.sin(box.params.fluteFreq * v);
    // const geometriesToMerge = [
    //   getLayerGeometry(-0.5 * box.params.thickness),
    //   getLayerGeometry(0),
    //   getLayerGeometry(0.5 * box.params.thickness),
    // ];

    function getLayerGeometry() {
      const layerGeometry = baseGeometry.clone();
      const positionAttr = layerGeometry.attributes.position;
      for (let i = 0; i < positionAttr.count; i++) {
        const x = positionAttr.getX(i);
        const y = positionAttr.getY(i);
        let z = positionAttr.getZ(i) + offset(x);
        console.log(offset(x));
        positionAttr.setXYZ(i, x, y, z);
      }
      return layerGeometry;
    }

    // const mergedGeometry = new mergeBufferGeometries(geometriesToMerge, false);
    // mergedGeometry.computeVertexNormals();

    return getLayerGeometry();
  }

  const createBoxElements = () => {
    const newBox = { ...box };
    const newBoxesGroup = [...boxesGroup];
    const boxMaterial = new THREE.MeshBasicMaterial({
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

      const flapWidth = sideWidth - newBox.params.flapGap;
      const flapHeight = 0.5 * newBox.params.width;
      const flapPlaneGeometry = new THREE.PlaneGeometry(flapWidth, flapHeight);
      const flapPotionX = -0.5 * newBox.params.flapGap;

      const flapTop = boxMesh.clone();
      flapTop.name = `top-${side}`;
      const topGeometry = flapPlaneGeometry.clone();
      topGeometry.translate(-0.5 * flapWidth, 0.5 * flapHeight, 0);
      flapTop.geometry = topGeometry;
      flapTop.material = boxMaterial.clone();
      flapTop.position.y = box.params.depth;
      flapTop.position.x = flapPotionX;

      const flapBottom = boxMesh.clone();
      flapBottom.name = `bottom-${side}`;
      const bottomGeometry = flapPlaneGeometry.clone();
      bottomGeometry.translate(-0.5 * flapWidth, 0.5 * flapHeight, 0);
      flapBottom.geometry = bottomGeometry;
      flapBottom.material = boxMaterial.clone();

      flapBottom.rotation.x = angle.flapAngles.frontHalf.width.bottom;
      flapBottom.position.x = flapPotionX;

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
      .to(angle, {
        duration: 1,
        v: 0.5 * Math.PI,
        ease: "power1.out",
      })
      .to(
        [angle.flapAngles.backHalf.width, angle.flapAngles.frontHalf.width],
        {
          duration: 0.6,
          bottom: 0.5 * Math.PI,
          ease: "back.in(3)",
        },
        1
      )
      .to(
        angle.flapAngles.backHalf.length,
        {
          duration: 0.7,
          bottom: 0.5 * Math.PI,
          ease: "back.in(2)",
        },
        1.1
      )
      .to(
        angle.flapAngles.frontHalf.length,
        {
          duration: 0.8,
          bottom: 0.49 * Math.PI,
          ease: "back.in(3)",
        },
        1.4
      )
      .to(
        [angle.flapAngles.backHalf.width, angle.flapAngles.frontHalf.width],
        {
          duration: 0.6,
          top: 0.5 * Math.PI,
          ease: "back.in(3)",
        },
        1.4
      )
      .to(
        angle.flapAngles.backHalf.length,
        {
          duration: 0.7,
          top: 0.5 * Math.PI,
          ease: "back.in(3)",
        },
        1.7
      )
      .to(
        angle.flapAngles.frontHalf.length,
        {
          duration: 0.9,
          top: 0.49 * Math.PI,
          ease: "back.in(4)",
        },
        1.8
      );
  }, [boxesGroup]);

  return boxesGroup.length > 0 && <primitive object={boxesGroup[0]} />;
};

const Canvas3D = ({ initialSize }) => {
  const canvasRef = useRef();

  return (
    <Canvas
      ref={canvasRef}
      dpr={[window.devicePixelRatio, 2]}
      camera={{ far: 1000, near: 10, fov: 45, position: [40, 90, 110] }}
      shadows
    >
      {/* <Camera /> */}
      <ambientLight args={["#ffffff", 1]}>
        <group>
          <pointLight color="#000" position={[40, 90, 110]} intensity={0.7} />
        </group>
      </ambientLight>
      <OrbitControls enableZoom enableDamping={false} autoRotate />
      {/* <Line start={[0, -1000, 0]} end={[0, 1000, 0]} color="#000000" />
      <Line start={[-1000, 0, 0]} end={[1000, 0, 0]} color="#000000" /> */}
      <Suspense fallback={null}>
        <Boxes />
      </Suspense>
    </Canvas>
  );
};

export default Canvas3D;
c