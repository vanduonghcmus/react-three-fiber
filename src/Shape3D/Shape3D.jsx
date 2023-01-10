import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import React, { useEffect, useState } from "react";
import Line from "../components/common/Line/Line";
import { MOCK_DATA } from "../utils/constant";
import * as THREE from "three";
import { generateShapeGeometry } from "../utils";

const Faces = () => {
  const [facesState, setFacesState] = useState([]);

  const [meshState, setMeshState] = useState([]);

  const { faces, folds } = MOCK_DATA.traditional;

  useEffect(() => {
    const newMeshState = [];
    const meshMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x9c8d7b),
      // side: THREE.DoubleSide,
      // wireframe:true,
    });
    faces.forEach((face) => {
      const plane = generateShapeGeometry(face.dlist);
      const mesh = new THREE.Mesh(plane, meshMaterial);
      mesh.name = face.name;
      newMeshState.push(mesh);
    });

    setMeshState(newMeshState);
  }, [folds]);

  return (
    meshState.length > 0 &&
    meshState.map((mesh) => <primitive key={mesh.uuid} object={mesh} />)
  );
};

const Shape3D = () => {
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
          -MOCK_DATA.traditional.totalX * 0.5 + MOCK_DATA.traditional.bleedline,
          -MOCK_DATA.traditional.totalY * 0.5 + MOCK_DATA.traditional.bleedline,
          0,
        ]}
      >
        <Faces />
        {/* {MOCK_DATA.traditional.folds.map((fold) => {
          return (
            <mesh>
              <Line
                color="#ff0000"
                start={[fold.x1, fold.y1, 0]}
                end={[fold.x2, fold.y2, 0]}
              />
            </mesh>
          );
        })} */}

        {/* <mesh position={[46.5, 108, 0]}>
          <meshStandardMaterial color="#9c8d7b" />
          <planeGeometry args={[200, 200]} />
        </mesh> */}
      </group>
    </>
  );
};

export default Shape3D;
