import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import gsap from "gsap";
import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { angleToRadians, generateShapeGeometry } from "../../utils";
import { MOCK_DATA } from "../../utils/constant";
import Line from "../common/Line/Line";

const Faces = () => {
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
      for (const key in animations) {
        const meshByName = meshGroups[0].getObjectByName(key);
        // const { v } = ;
        // if (meshByName && vector !== "" && v) {
        //   console.log({ meshByName, vector, v });
        //   meshByName.rotation[vector] = v;
        // }

        console.log('animations[key]',animations[key]);
      }
    }
  };

  const getPositionByName = (name = "") => {
    let result = "";
    const [firstName, secondName] = name.split("_");
    if (firstName && secondName) {
      if (secondName.includes(firstName)) {
        result = secondName.split(firstName)[1];
      }
    }

    return result;
  };

  const groupMeshElements = (meshElements = []) => {
    const result = [];
    meshElements.forEach((mesh, idx, arr) => {
      const { foldlines, y, h, x, w } = mesh.userData;
      // group side and main side
      foldlines.forEach((foldLine) => {
        const meshFound = arr.find((it) => it.name === foldLine);
        if (meshFound) {
          const newMesh = new THREE.Mesh(
            meshFound.geometry,
            meshFound.material
          );
          newMesh.name = meshFound.name;
          if (meshFound.userData["foldlines"].length === 0) {
            const position = getPositionByName(meshFound.name);
            switch (position) {
              case "T":
                newMesh.geometry.translate(0, -y, 0);
                break;
              case "B":
                newMesh.geometry.translate(0, h, 0);
                break;
              case "L":
                newMesh.geometry.translate(-x, 0, 0);
                break;
              case "R":
                newMesh.geometry.translate(w, 0, 0);
                break;

              default:
                break;
            }
          }
          mesh.add(newMesh);
        }
      });
      result.push(mesh);
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
      }
    }

    console.log("result", result);

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
      ...face,
      foldlines: geometry.userData["foldlines"],
      isMainSide: false,
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

      const foldLineAxis = folds.find((fold) => {
        const meshName = fold.name.split("_")[1];
        return meshName === face.name;
      });
      if (foldLineAxis) {
        mesh.name = foldLineAxis.name;
      } else {
        mesh.name = face.name;
      }

      newMeshState.push(mesh);
    });

    const groupMeshState = groupMeshElements(newMeshState);
    setMeshState(newMeshState);
    setMeshGroups(groupMeshState);
  };

  const createAnimationVariable = () => {
    const newAnimations = {};
    folds.forEach((fold) => {
      newAnimations[fold.name] = {
        v: 0,
        action: "",
        vector: "",
      };
    });

    setAnimations(newAnimations);
  };

  const convertAnimation = (animationGroup = []) => {
    const animationUpdated = {};
    animationGroup.forEach((animate) => {
      let v = "";
      let vector = "";
      if (animate.action === "rotate") {
        v = angleToRadians(animate?.rotate);
      }

      if (animate.action === "translate") {
        v = animate?.translate;
      }

      for (const key in animate.vector) {
        if (animate.vector[key] !== 0) {
          vector = key;
        }
      }

      console.log({ [vector]: v });
      animationUpdated[animate.name] = {
        [vector]: v,
      };
    });

    return animationUpdated;
  };

  useEffect(() => {
    createShapeElements();
  }, []);

  useEffect(() => {
    createAnimationVariable();
  }, []);

  useEffect(() => {
    gsap.registerPlugin();

    // animationData.forEach((animationGroup, idx) => {
    //   const animationUpdated = convertAnimation(animationGroup);
    //   gsap
    //     .to(
    //       animations,
    //       {
    //         duration: 5,
    //         ...animationUpdated,
    //         ease: "power1.in",
    //       },
    //       5 + idx
    //     )
    //     .then(updateShapeTransform);
    // });

    const animate1 = convertAnimation(animationData[0]);
    const animate2 = convertAnimation(animationData[1]);
    const animate3 = convertAnimation(animationData[2]);

    gsap
      .timeline({
        onUpdate: updateShapeTransform,
      })
      .to(animations, {
        ...animate1,
        duration: 5,
      });
    // .to(
    //   animations,
    //   {
    //     ...animate2,
    //     duration: 5,
    //   },
    //   6
    // )
    // .to(
    //   animations,
    //   {
    //     ...animate3,
    //     duration: 5,
    //   },
    //   7
    // );
  }, [meshGroups]);

  return (
    <mesh
      rotation={[transform.rotate.x, transform.rotate.y, transform.rotate.z]}
      position={[
        transform.position.x,
        transform.position.y,
        transform.position.z,
      ]}
    >
      {meshGroups.length > 0 && (
        <primitive key={meshGroups[0].uuid} object={meshGroups[0]} />
      )}
    </mesh>
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
