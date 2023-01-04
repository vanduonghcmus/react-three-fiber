import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
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
import { ELS } from "../../utils/constant";

const Camera = () => {
  const camera = useRef();
  const { aspect } = useThree();
  return (
    <PerspectiveCamera
      ref={camera}
      aspect={aspect}
      fov={45}
      position={[40, 90, 110]}
      makeDefault
      onUpdate={(self) => self.updateProjectionMatrix()}
    />
  );
};

const initialState = {
  backHalf: {
    width: {
      top: null,
      side: null,
      bottom: null,
    },
    length: {
      top: null,
      side: null,
      bottom: null,
    },
  },
  frontHalf: {
    width: {
      top: null,
      side: null,
      bottom: null,
    },
    length: {
      top: null,
      side: null,
      bottom: null,
    },
  },
};

const Boxes = () => {
  const boxSize = [30, 40, 1];
  const [boxRender, setBoxRender] = useState([]);
  const [angle] = useState(() => ({ v: 0 }));
  function updateSceneScroll() {
    console.log("asdsd", boxRender, angle.v);
    boxRender.forEach((b, idx) => {
      if (idx > 0) {
        b.rotation.y = angle.v;
      }
    });
  }

  const createBoxElements = () => {
    const newBoxes = [...boxRender];
    const boxGeometry = new THREE.PlaneGeometry(boxSize[0], boxSize[1]);
    const boxMaterial = new THREE.MeshBasicMaterial({
      color: 0x3c9aa0,
      wireframe: true,
    });
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    const numberOfBoxes = 4;
    boxGeometry.translate(-0.5 * boxSize[0], 0.5 * boxSize[1], 0);
    for (let i = 0; i < numberOfBoxes; i++) {
      newBoxes[i] = boxMesh.clone();

      if (i > 0) {
        newBoxes[i - 1].add(newBoxes[i]);
        newBoxes[i].position.x = -boxSize[0];
      }
    }

    setBoxRender(newBoxes);
  };

  useLayoutEffect(() => {
    createBoxElements();
  }, []);

  useEffect(() => {
    gsap.to(angle, {
      duration: 3,
      v: 0.5 * Math.PI,
      ease: "power1.out",
      onUpdate: updateSceneScroll,
    });
  }, [boxRender]);

  return boxRender.length > 0 && <primitive object={boxRender[0]} />;
};

const Canvas3D = ({ initialSize }) => {
  const [box, setBox] = useState({ params: initialSize, els: ELS });
  const canvasRef = useRef();

  return (
    <Canvas ref={canvasRef} dpr={[window.devicePixelRatio, 2]}>
      <Camera />
      <OrbitControls
        enableZoom={false}
        enableDamping
        autoRotate
        autoRotateSpeed={0.25}
      />
      {/* <Line start={[0, -1000, 0]} end={[0, 1000, 0]} color="#000000" />
      <Line start={[-1000, 0, 0]} end={[1000, 0, 0]} color="#000000" /> */}
      <Suspense fallback={null}>
        <Boxes />
      </Suspense>
    </Canvas>
  );
};

export default Canvas3D;
