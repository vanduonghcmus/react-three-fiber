import { Col, Layout, Row, Tabs, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import { useState } from "react";
import EditSize from "./components/EditSize/EditSize";
import FormControl from "./components/FormControl/FormControl";
import "./App.css";
import { calculateSizeByUnit } from "./utils";

const CM_UNIT = 1;

const initialValues = {
  width: calculateSizeByUnit(27, CM_UNIT),
  length: calculateSizeByUnit(80, CM_UNIT),
  depth: calculateSizeByUnit(45, CM_UNIT),
  flapGap: 1,
};

function App() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [currentTab, setCurrentTab] = useState();
  const [boxSize, setBoxSize] = useState(initialValues);

  const TAB_ITEMS = [
    {
      key: 1,
      label: "tab 1",
      children: <EditSize initialSize={boxSize} />,
    },
    {
      key: 2,
      label: "tab 2",
      children: `Content of Tab 2`,
    },
    {
      key: 3,
      label: "tab 3",
      children: `Content of Tab 3`,
    },
  ];

  const handleSubmit = (values) => {
    const newBoxSize = { ...boxSize };
    newBoxSize.length = calculateSizeByUnit(values.length, 1);
    newBoxSize.width = calculateSizeByUnit(values.width, 1);
    newBoxSize.depth = calculateSizeByUnit(values.depth, 1);

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
      <Content style={{ minWidth: "80%",maxHeight:'50%', margin: "auto" }}>
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
              initialValues={{
                width: 27,
                length: 80,
                depth: 45,
                thickness: 0.1,
              }}
              onSubmit={handleSubmit}
            />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default App;
