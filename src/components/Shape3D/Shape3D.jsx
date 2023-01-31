import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import gsap from "gsap";
import { cloneDeep, isEmpty, isEqual } from "lodash";
import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { angleToRadians, generateShapeGeometry } from "../../utils";
import { MOCK_DATA, SAMPLE_DATA } from "../../utils/constant";
import Line from "../common/Line/Line";

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
  };
  mesh.userData = { ...userData };

  return mesh;
};

const Faces = () => {
  const [animations, setAnimations] = useState({});
  const [meshGroups, setMeshGroups] = useState([]);
  const [meshes, setMeshes] = useState([]);

  const {
    // faces,
    transform,
    animations: animationData,
  } = MOCK_DATA.traditional;

  const { faces, folds } = SAMPLE_DATA;

  const updateShapeTransform = () => {
    if (meshes.length > 0) {
      meshes.forEach((group) => {
        if (group.children.length > 0) {
          group.children.forEach((mesh) => {
            const animationByName = animations[mesh.name];
            for (const key in animationByName) {
              if (animationByName[key] !== 0) {
                mesh.rotation[key] = animationByName[key];
              }
            }
          });
        }
      });
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
    const newMeshElement = [...meshElements];
    const result = [];

    // group side with flap
    for (let i = 0; i < newMeshElement.length; i++) {
      const meshElement = newMeshElement[i];
      const meshData = meshElement.userData;
      if (meshData.parent) {
        const meshFoundIdx = newMeshElement.findIndex(
          (mesh) => mesh.name === meshData.parent
        );
        if (meshFoundIdx >= 0) {
          const meshFound = newMeshElement[meshFoundIdx];
          const userData = meshFound.userData;
          const meshExistIdx = result.findIndex(
            (it) => it.name === meshFound.name
          );
          const foldAxis = folds.find((fold) => {
            const meshChildName = fold.name.split("_")[1];
            return meshElement.name === meshChildName;
          });
          if (foldAxis) {
            if (foldAxis.x1 === foldAxis.x2) {
              let positionX = foldAxis.x1 - userData.x;
              if (positionX <= 0) {
                positionX = -userData.x;
              }
              meshElement.position.set(positionX, 0, 0);
            }
            if (foldAxis.y1 === foldAxis.y2) {
              let positionY = foldAxis.y1 - userData.y;
              if (positionY <= 0) {
                positionY = -userData.y;
              }
              meshElement.position.set(0, positionY, 0);
            }
          }
          if (meshExistIdx < 0) {
            meshFound.add(meshElement);
            result.push(meshFound);
          } else {
            result[meshExistIdx].add(meshElement);
          }
        }
      }
    }
    return result;
  };

  const createMeshes = () => {
    const newMeshes = [];
    faces.forEach((face) => {
      const shapeGeometry = generateShapeGeometry(face.dlist);
      const mesh = createMeshElement(shapeGeometry, face);
      mesh.name = face.name;
      shapeGeometry.translate(-face.x, -face.y, 0);
      mesh.position.set(face.x, face.y, 0);
      newMeshes.push(mesh);
    });

    console.log("newMeshes", newMeshes);

    const newMeshGroups = groupMeshElements(newMeshes);
    setMeshes(newMeshes);
    setMeshGroups(newMeshGroups);
    console.log("newMeshGroups", newMeshGroups);
  };

  const createAnimationVariable = () => {
    const newAnimations = {};
    folds.forEach((fold) => {
      const position = getPositionByName(fold.name);
      if (position === "T") {
        newAnimations[fold.name] = {
          x: angleToRadians(-180),
          y: 0,
          z: 0,
        };
      } else {
        newAnimations[fold.name] = {
          x: 0,
          y: 0,
          z: 0,
        };
      }
    });

    setAnimations(newAnimations);
  };

  const convertAnimation = (animationGroup = [], animations = {}) => {
    const result = [];

    for (let i = 0; i < animationGroup.length; i++) {
      const animate = animationGroup[i];

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

        if (animate.vector[key] < 0) {
          v = -v;
        }

        if (animations[animate.name][key] !== 0) {
          v = animations[animate.name][key] + v;
        }
      }

      const animationUpdated = {
        key: [animations[animate.name]],
        action: {
          ...animations[animate.name],
          [vector]: v,
        },
      };

      if (result.length > 0) {
        if (isEqual(result[i - 1]?.action, animationUpdated.action)) {
          result[i - 1].key = result[i - 1].key.concat(animationUpdated.key);
          break;
        }
      }
      result.push(animationUpdated);
    }

    return result;
  };

  useEffect(() => {
    createAnimationVariable();
  }, []);

  useEffect(() => {
    createMeshes();
  }, []);

  // useEffect(() => {
  //   if (!isEmpty(animations) && animationData.length > 0) {
  //     const timeline = gsap.timeline({
  //       onUpdate: updateShapeTransform,
  //     });
  //     animationData.forEach((animateData) => {
  //       const animate = convertAnimation(animateData, animations);

  //       animate.forEach((animate) => {
  //         timeline.to(animate.key, {
  //           duration: 3,
  //           ...animate.action,
  //         });
  //       });
  //     });
  //   }
  // }, [meshGroups]);

  console.log("meshGroups", meshGroups);

  return (
    <group
      rotation={[transform.rotate.x, transform.rotate.y, transform.rotate.z]}
      position={[
        transform.position.x,
        transform.position.y,
        transform.position.z,
      ]}
    >
      {/* {meshGroups.map((mesh) => {
        return <primitive key={mesh.uuid} object={mesh} />;
      })} */}

      {meshGroups.length > 0 && (
        <primitive key={meshGroups[0].uuid} object={meshGroups[0]} />
      )}

      {folds.map((fold) => {
        return (
          <Line
            color="#ff0000"
            start={[fold.x1, fold.y1, 0]}
            end={[fold.x2, fold.y2, 0]}
          />
        );
      })}
    </group>
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
