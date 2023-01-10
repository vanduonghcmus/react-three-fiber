import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import React, { useEffect, useState } from "react";
import { generatePathGeometry } from "../../utils";
import { MOCK_DATA } from "../../utils/constant";
import Line from "../common/Line/Line";

function BleedsLine({ color = "#65C42F" }) {
  const [geometry, setGeometry] = useState(null);

  useEffect(() => {
    const newGeometry = generatePathGeometry(MOCK_DATA.traditional.bleeds);
    setGeometry(newGeometry);
  }, []);

  return (
    <line>
      {geometry && <primitive object={geometry} />}
      <lineBasicMaterial color={color} />
    </line>
  );
}

function CutLine({ color = "#5152A8" }) {
  const [geometry, setGeometry] = useState(null);

  useEffect(() => {
    const newGeometry = generatePathGeometry(MOCK_DATA.traditional.cuts);
    setGeometry(newGeometry);
  }, []);

  return (
    <line>
      {geometry && <primitive object={geometry} />}
      <lineBasicMaterial color={color} />
    </line>
  );
}

const Shape2D = ({ initialSize }) => {
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
          -MOCK_DATA.traditional.totalX * 0.5,
          -MOCK_DATA.traditional.totalY * 0.5,
          0,
        ]}
      >
        <BleedsLine />
      </group>
      <group
        position={[
          -MOCK_DATA.traditional.totalX * 0.5 + MOCK_DATA.traditional.bleedline,
          -MOCK_DATA.traditional.totalY * 0.5 + MOCK_DATA.traditional.bleedline,
          0,
        ]}
      >
        <CutLine />
        {MOCK_DATA.traditional.folds.map((fold) => {
          return (
            <Line
              color="#ff0000"
              start={[fold.x1, fold.y1, 0]}
              end={[fold.x2, fold.y2, 0]}
            />
          );
        })}
      </group>
    </>
  );
};

export default Shape2D;
