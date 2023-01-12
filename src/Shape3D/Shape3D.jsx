import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import React, { useEffect, useState } from "react";
import Line from "../common/Line/Line";
import { MOCK_DATA } from "../../utils/constant";
import * as THREE from "three";
import { generateShapeGeometry, angleToRadians } from "../../utils";
import gsap from "gsap";
import { useThree } from "@react-three/fiber";

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

  const createShapeElements = () => {
    const newMeshState = [];
    const shapeGeometries = [];
    const meshMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x9c8d7b),
      side: THREE.DoubleSide,
      wireframe: true,
    });
    const mesh = new THREE.Mesh();
    mesh.isObject3D = true;
    mesh.material = meshMaterial;

    faces.forEach((face) => {
      const shapeGeometry = generateShapeGeometry(face.dlist);
      shapeGeometry.name = face.name;
      shapeGeometry.translate(
        transform.position.x,
        transform.position.y,
        transform.position.z
      );

      shapeGeometries.push(shapeGeometry);
    });

    if (shapeGeometries.length > 0) {
      folds.forEach((fold, idx) => {
        const [firstName, secondName] = fold.name.split("_");
        const mesh = new THREE.Mesh();
        mesh.isObject3D = true;
        const geometryByFirstNameIdx = shapeGeometries.findIndex(
          (mesh) => mesh.name === firstName
        );
        const geometryBySecondNameIdx = shapeGeometries.findIndex(
          (mesh) => mesh.name === secondName
        );

        const firstMesh = new THREE.Mesh(
          shapeGeometries[geometryByFirstNameIdx],
          meshMaterial
        );
        const secondMesh = new THREE.Mesh(
          shapeGeometries[geometryBySecondNameIdx],
          meshMaterial
        );
        mesh.add(secondMesh);
        mesh.add(firstMesh);

        if (transform) {
          mesh.rotateX(transform.rotate.x);
          mesh.rotateY(transform.rotate.y);
          mesh.rotateZ(transform.rotate.z);
        }

        newMeshState.push(mesh);
      });
    }

    console.log("faces", newMeshState);
    setMeshState(newMeshState);
  };

  const updateShapeTransform = () => {
    meshState.forEach((mesh, idx) => {
      if (idx === 0) {
        mesh.rotation.y = animations.v;
      }
    });
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
        duration: 4,
        v: angleToRadians(90),
        ease: "power1.out",
      });
  }, [meshState]);

  return (
    meshState.length > 0 && (
      <group
      // position={[
      //   transform.position.x,
      //   transform.position.y,
      //   transform.position.z,
      // ]}
      >
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
        far={10000}
        position={[0, 0, 1000]}
      />
      <Faces />
    </>
  );
};

export default Shape3D;
