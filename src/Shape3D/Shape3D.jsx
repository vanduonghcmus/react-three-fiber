import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import React, { useEffect, useState } from "react";
import Line from "../components/common/Line/Line";
import { MOCK_DATA } from "../utils/constant";
import * as THREE from "three";
import { generateShapeGeometry, angleToRadians } from "../utils";
import gsap from "gsap";

const Faces = () => {
  const [facesState, setFacesState] = useState([]);
  const [animations, setAnimations] = useState({ v: 0 });
  const [meshState, setMeshState] = useState([]);

  const {
    faces,
    folds,
    transform,
    animations: animationData,
  } = MOCK_DATA.traditional;

  const setGeometryHierarchy = () => {};

  // const convertAnimation = (animations = []) => {
  //   const result = {};
  //   if (animations.length > 0) {
  //     animations.forEach((animation) => {
  //       if (animation?.length > 0) {
  //         animation.forEach((it) => {
  //           result[it.name]=
  //         });
  //       }
  //     });
  //   }

  //   return result;
  // };

  const updateShapeTransform = () => {
    if (meshState.length > 0) {
      meshState.forEach((mesh, idx) => {
        if (idx === 4) {
          mesh.rotateY(angleToRadians(animations.v));
        }
      });
    }
  };

  const createShapeElements = () => {
    const newMeshState = [];
    const meshMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x9c8d7b),
      side: THREE.DoubleSide,
      wireframe: true,
    });
    faces.forEach((face, idx) => {
      const plane = generateShapeGeometry(face.dlist);
      const mesh = new THREE.Mesh(plane, meshMaterial);

      mesh.name = face.name;
      newMeshState.push(mesh);

      if (transform) {
        mesh.position.set(
          transform.position.x,
          transform.position.y,
          transform.position.z
        );

        mesh.rotateX(transform.rotate.x);
        mesh.rotateY(transform.rotate.y);
        mesh.rotateZ(transform.rotate.z);
      }
    });
    setMeshState(newMeshState);
  };

  useEffect(() => {
    createShapeElements();
  }, []);

  useEffect(() => {
    gsap
      .timeline({
        onUpdate: updateShapeTransform,
      })
      .to(animations, {
        duration: 1.5,
        v: angleToRadians(-90),
        ease: "power1.out",
      });
  }, [meshState]);

  return (
    meshState.length > 0 && (
      <group>
       
        {meshState.map((mesh) => (
          <primitive key={mesh.uuid} object={mesh} />
        ))}
      </group>
    )
  );
};

const Shape3D = () => {
  return (
    <>
      <OrbitControls enableZoom enableDamping={false} />
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
          (MOCK_DATA.traditional.totalX + MOCK_DATA.traditional.totalY) * 0.5,
        ]}
      />
      <Faces />
    </>
  );
};

export default Shape3D;
