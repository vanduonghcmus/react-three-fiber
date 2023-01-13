import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import gsap from "gsap";
import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { angleToRadians, generateShapeGeometry } from "../../utils";
import { MOCK_DATA } from "../../utils/constant";
import Line from "../common/Line/Line";

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

  const updateShapeTransform = () => {
    if (meshGroups.length > 0) {
      meshGroups.forEach((mesh, idx) => {
        if (idx !== 0) {
          // console.log('mesh',mesh);
          mesh.rotation.y = animations.v;
          // mesh.position.x = 479;
          // mesh.position.z = -479;
        }
      });
    }
  };

  const groupMeshElements = (meshElements = []) => {
    const result = [];
    meshElements.forEach((mesh, idx, arr) => {
      const foldLines = mesh.userData["foldlines"];
      const userParentData = mesh.userData;

      if (foldLines.length > 0) {
        foldLines.forEach((foldLine) => {
          const meshName = foldLine.split("_")[1];
          const foldLineAxis = folds.find((fold) => fold.name === foldLine);
          const meshFound = arr.find((it) => it.name === meshName);

          if (meshFound && foldLineAxis) {
            const userData = meshFound.userData;
            const newMesh = new THREE.Mesh(
              meshFound.geometry,
              meshFound.material
            );
            newMesh.name = meshName;
            if (meshName.includes("T")) {
              newMesh.position.y = -userData.h;
            }
            if (meshName.includes("B")) {
              newMesh.position.y = userParentData.h;
            }

            if (meshName.includes("HL")) {
              newMesh.position.x = -userData.w;
            }
            mesh.add(newMesh);
          }
        });
        result.push(mesh);
      }
    });

    let meshElementChild = result[0]?.children;
    for (let i = 0; i < result.length; i++) {
      const meshElement = result[i];
      if (i !== 0) {
        const meshElementExistIdx = meshElementChild.findIndex(
          (value) => value.name === meshElement.name
        );
        if (meshElementExistIdx >= 0) {
          result[i - 1].remove(result[i - 1].children[meshElementExistIdx]);
          result[i - 1].add(meshElement);
          const userDataPrevious = result[i - 1].userData;
          meshElement.position.set(userDataPrevious.w, 0, 0);
          meshElementChild = meshElement.children;
        }
      } else {
        if (transform) {
          meshElement.rotateX(transform.rotate.x);
          meshElement.rotateY(transform.rotate.y);
          meshElement.rotateZ(transform.rotate.z);
        }
      }
    }

    return result;
  };

  const createMeshElement = (geometry, face) => {
    const meshMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x9c8d7b),
      side: THREE.DoubleSide,
      wireframe: true,
    });
    const mesh = new THREE.Mesh(geometry, meshMaterial);
    mesh.isObject3D = true;
    const userData = {
      foldlines: geometry.userData["foldlines"],
      w: face.w,
      h: face.h,
    };
    mesh.userData = { ...userData };
    return mesh;
  };

  const createShapeElements = () => {
    const newMeshState = [];
    faces.forEach((face) => {
      const shapeGeometry = generateShapeGeometry(face.dlist);
      shapeGeometry.translate(-face.x, -face.y, 0);
      const mesh = createMeshElement(shapeGeometry, face);
      mesh.name = face.name;
      newMeshState.push(mesh);
    });

    const groupMeshState = groupMeshElements(newMeshState);
    setMeshState(newMeshState);
    setMeshGroups(groupMeshState);
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
        duration: 3,
        v: angleToRadians(-90),
        ease: "power1.out",
      });
  }, [meshGroups]);

  return (
    meshGroups.length > 0 && (
      <primitive key={meshGroups[0].uuid} object={meshGroups[0]} />
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
