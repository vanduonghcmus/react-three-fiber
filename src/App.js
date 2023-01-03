import { Col, Layout, Row, Tabs, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import { useState } from "react";
import EditSize from "./components/EditSize/EditSize";
import FormControl from "./components/FormControl/FormControl";
import "./App.css";

const initialValues = {
  params: {
    width: 27,
    length: 80,
    depth: 45,
    flapGap: 1,
  },
  els: {
    backHalf: {
      width: {
        top: null,
        side: null,
        bottom: null,
      },
      length: {
        top: null,
        side: null,
        bottom: null,
      },
    },
    frontHalf: {
      width: {
        top: null,
        side: null,
        bottom: null,
      },
      length: {
        top: null,
        side: null,
        bottom: null,
      },
    },
  },
};

function App() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [currentTab, setCurrentTab] = useState();
  const [box, setBox] = useState(initialValues);

  const TAB_ITEMS = [
    {
      key: 1,
      label: "tab 1",
      children: <EditSize initialValues={box} />,
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
    setBox({
      ...box,
      params: {
        length: values.length,
        width: values.width,
        depth: values.height,
        flapGap: 1,
      },
    });
  };
  return (
    <Layout
      style={{
        padding: "24px 0",
        background: colorBgContainer,
        height: "100vh",
      }}
    >
      <Content style={{ minWidth: "90%", margin: "auto" }}>
        <Row style={{ height: "100%" }} gutter={60}>
          <Col span={14}>
            <Tabs
              className='tab-style'
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
                height: 45,
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
