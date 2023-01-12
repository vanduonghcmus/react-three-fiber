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
  const [meshGroups, setMeshGroups] = useState([]);

  const {
    faces,
    folds,
    transform,
    animations: animationData,
  } = MOCK_DATA.traditional;

  //  foldLines.forEach((foldLine) => {
  //         const meshName = foldLine.split("_")[1];
  //         const meshFound = arr.find((it) => it.name === meshName);
  //         if (meshFound) {
  //           mesh.add(new THREE.Mesh(meshFound.geometry, meshFound.material));
  //         }
  //       });

  const groupMeshElements = (meshElements = []) => {
    const result = [];
    meshElements.forEach((mesh, idx, arr) => {
      const foldLines = mesh.userData["foldlines"];

      const meshExistIdx = result.findIndex((it) => it.name === mesh.name);
      console.log("meshExistIdx", meshExistIdx);
      if (foldLines.length > 0) {
        foldLines.forEach((foldLine) => {
          const meshName = foldLine.split("_")[1];
          const meshFound = arr.find((it) => it.name === meshName);
          const newMesh = new THREE.Mesh(
            meshFound.geometry,
            meshFound.material
          );
          newMesh.name = meshName;
          if (meshFound) {
            if (meshExistIdx > 0) {
              result[meshExistIdx].add(newMesh);
            } else {
              mesh.add(newMesh);
              result.push(mesh);
              result.push(newMesh);
            }
          }
        });
      }
    });

    // for (let i = 0; i < result.length; i++) {
    //   if (i > 0) {
    //     result[i - 1].add(
    //       new THREE.Mesh(result[i].geometry, result[i].material)
    //     );
    //   }
    // }

    return result;
  };

  const createMeshElement = (geometry) => {
    const meshMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x9c8d7b),
      side: THREE.DoubleSide,
      wireframe: true,
    });
    const mesh = new THREE.Mesh(geometry, meshMaterial);
    mesh.isObject3D = true;
    mesh.userData["foldlines"] = geometry.userData["foldlines"];

    return mesh;
  };

  const createShapeElements = () => {
    const newMeshState = [];
    const shapeGeometries = [];

    faces.forEach((face) => {
      const shapeGeometry = generateShapeGeometry(face.dlist);
      shapeGeometries.push(shapeGeometry);
      const mesh = createMeshElement(shapeGeometry);
      mesh.name = face.name;

      if (transform) {
        mesh.rotateX(transform.rotate.x);
        mesh.rotateY(transform.rotate.y);
        mesh.rotateZ(transform.rotate.z);
        mesh.position.set(
          transform.position.x,
          transform.position.y,
          transform.position.z
        );
      }

      newMeshState.push(mesh);
    });

    const groupMeshState = groupMeshElements(newMeshState);
    console.log("groupMeshState", groupMeshState);
    setMeshState(newMeshState);
    setMeshGroups(groupMeshState);
  };

  const updateShapeTransform = () => {
    meshState.forEach((mesh, idx) => {
      if (idx === 1) {
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
    meshGroups.length > 0 && (
      <group
      // position={[
      //   transform.position.x,
      //   transform.position.y,
      //   transform.position.z,
      // ]}
      >
        {meshGroups.map((mesh) => (
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
