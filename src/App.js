import { Col, Image, Layout, Row, Tabs, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import { Suspense, useState } from "react";
import EditSize from "./components/EditSize/EditSize";
import Canvas3D from "./components/Canvas3D/Canvas3D";

import FormControl from "./components/FormControl/FormControl";
import "./App.css";
import { calculateSizeByUnit } from "./utils";
import { Canvas } from "@react-three/fiber";
import PreviewBox from "./components/Preview/PreviewBox";
import editSize from "./assets/image/edit-size.png";
import animation from "./assets/image/animation.png";
import preview from "./assets/image/preview.png";
import Shape2D from "./components/Shape2D/Shape2D";
import Shape3D from "./Shape3D/Shape3D";

const CM_UNIT = 1;

const initialValues = {
  width: calculateSizeByUnit(27, CM_UNIT),
  length: calculateSizeByUnit(80, CM_UNIT),
  depth: calculateSizeByUnit(45, CM_UNIT),
  flapGap: 1,
  thickness: 0.6,
  fluteFreq: 5,
};

function App() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [boxSize, setBoxSize] = useState(initialValues);

  const TAB_ITEMS = [
    {
      key: 1,
      label: <Image preview={false} width={100} height={100} src={editSize} />,
      children: (
        <Canvas dpr={[window.devicePixelRatio, 2]}>
          <Suspense fallback={null}>
            <EditSize initialSize={boxSize} />
          </Suspense>
        </Canvas>
      ),
    },
    {
      key: 2,
      label: <Image preview={false} width={100} height={100} src={animation} />,
      children: (
        <Canvas dpr={[window.devicePixelRatio, 2]}>
          <Suspense fallback={null}>
            <Canvas3D initialSize={boxSize} />
          </Suspense>
        </Canvas>
      ),
    },
    {
      key: 3,
      label: <Image preview={false} width={100} height={100} src={preview} />,
      children: (
        <Canvas dpr={[window.devicePixelRatio, 2]}>
          <Suspense fallback={null}>
            <PreviewBox initialSize={boxSize} />
          </Suspense>
        </Canvas>
      ),
    },
    {
      key: 4,
      label: "Three",
      children: (
        <Canvas dpr={[window.devicePixelRatio, 2]}>
          <Suspense fallback={null}>
            <Shape2D initialSize={boxSize} />
          </Suspense>
        </Canvas>
      ),
    },
    {
      key: 5,
      label: "Shape3D",
      children: (
        <Canvas dpr={[window.devicePixelRatio, 2]}>
          <Suspense fallback={null}>
            <Shape3D initialSize={boxSize} />
          </Suspense>
        </Canvas>
      ),
    },
  ];

  const handleSubmit = (values) => {
    const newBoxSize = { ...boxSize };
    newBoxSize.length = calculateSizeByUnit(values.length, 1);
    newBoxSize.width = calculateSizeByUnit(values.width, 1);
    newBoxSize.depth = calculateSizeByUnit(values.depth, 1);
    newBoxSize.thickness = values.thickness;
    setBoxSize(newBoxSize);
  };
  return (
    <Layout
      style={{
        padding: "24px 0",
        background: colorBgContainer,
        height: "100vh",
      }}
    >
      <Content style={{ minWidth: "80%", maxHeight: "50%", margin: "auto" }}>
        <Row style={{ height: "100%" }} gutter={60}>
          <Col span={14}>
            <Tabs
              className="tab-style"
              tabPosition="left"
              destroyInactiveTabPane
              items={TAB_ITEMS}
            />
          </Col>
          <Col span={10}>
            <FormControl
              initialValues={initialValues}
              onSubmit={handleSubmit}
            />
          </Col>
        </Row>
      </Content>
      {/* <svg
        width="100%"
        height="100%"
        viewBox="500 0 1000 1000"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="  M45,110  A1.5,1.5 0 0,0 46.5,108.5  L46.5,108  L476.1715728752538,108  L476.1715728752538,108  A3,3 0 0,0 479,110  L479,384  A3,3 0 0,0 476.1715728752538,386  L476.1715728752538,386  L46.5,386  L46.5,385.5  A1.5,1.5 0 0,0 45,384  L45,110  Z "
          stroke="black"
          fill="none"
          name="H"
          strokeWidth="2"
          fillOpacity="0.5"
        />
        <path
          d="  M479,110  L693,110  L693,384  L479,384  L479,110  Z  "
          stroke="black"
          fill="none"
          strokeWidth="2"
          fillOpacity="0.5"
          name="FR"
        />
        <path
          d="M693,110  A3,3 0 0,0 695.8284271247462,108  L695.8284271247462,108  L1124.1715728752538,108  L1124.1715728752538,108  A3,3 0 0,0 1127,110  L1127,384  A3,3 0 0,0 1124.1715728752538,386  L1124.1715728752538,386  L695.8284271247462,386  L695.8284271247462,386  A3,3 0 0,0 693,384  L693,110  Z"
          stroke="black"
          fill="none"
          strokeWidth="2"
          fillOpacity="0.5"
          name="F"
        />
        <path
          d="M1127,110  L1340,110  L1340,384  L1127,384  L1127,110  Z"
          stroke="black"
          fill="none"
          strokeWidth="2"
          fillOpacity="0.5"
          name="FL"
        />
        <path
          d="M45,384  L0,371.9422863405995  L0,122.05771365940052  L45,110  L45,384  Z"
          stroke="black"
          fill="none"
          strokeWidth="2"
          fillOpacity="0.5"
          name="HL"
        />
        <path
          d="M479,110  A3,3 0 0,0 482,107  L482,0  L690,0  L690,107  A3,3 0 0,0 693,110  L479,110  Z "
          stroke="black"
          fill="none"
          strokeWidth="2"
          fillOpacity="0.5"
          name="FRT"
        />
        <path
          d="M479,384  L693,384  A3,3 0 0,0 690,387  L690,494  L482,494  L482,387  A3,3 0 0,0 479,384  Z"
          stroke="black"
          fill="none"
          strokeWidth="2"
          name="FRB"
          fillOpacity="0.5"
        />
        <path
          d="M1127,110  A3,3 0 0,0 1130,107  L1130,0  L1338.5,0  L1338.5,108.5  A1.5,1.5 0 0,0 1340,110  L1127,110  Z"
          stroke="black"
          fill="none"
          strokeWidth="2"
          name="FLT"
          fillOpacity="0.5"
        />
        <path
          d="M1127,384  L1340,384  A1.5,1.5 0 0,0 1338.5,385.5  L1338.5,494  L1130,494  L1130,387  A3,3 0 0,0 1127,384  Z "
          stroke="black"
          fill="none"
          strokeWidth="2"
          name="FLT"
          fillOpacity="0.5"
        />
        <path
          d=" M46.5,108  L46.5,108  L46.5,0  L476,0  L476,107  A3,3 0 0,0 476.1715728752538,108  L46.5,108  Z "
          stroke="black"
          fill="none"
          strokeWidth="2"
          name="HT"
          fillOpacity="0.5"
        />
        <path
          d=" M46.5,386  L476.1715728752538,386  A3,3 0 0,0 476,387  L476,494  L46.5,494  L46.5,386  L46.5,386  Z  "
          stroke="black"
          fill="none"
          strokeWidth="2"
          name="HB"
          fillOpacity="0.5"
        />
        <path
          d=" M695.8284271247462,108  A3,3 0 0,0 696,107  L696,0  L1124,0  L1124,107  A3,3 0 0,0 1124.1715728752538,108  L695.8284271247462,108  Z "
          stroke="black"
          fill="none"
          strokeWidth="2"
          name="FT"
          fillOpacity="0.5"
        />
        <path
          d=" M695.8284271247462,386  L1124.1715728752538,386  A3,3 0 0,0 1124,387  L1124,494  L696,494  L696,387  A3,3 0 0,0 695.8284271247462,386  Z "
          stroke="black"
          fill="none"
          strokeWidth="2"
          name="FB"
          fillOpacity="0.5"
        />
      </svg> */}
    </Layout>
  );
}

export default App;
