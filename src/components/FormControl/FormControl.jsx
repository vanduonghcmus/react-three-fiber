import { Button, Col, Form, InputNumber, Row } from "antd";
import React from "react";

const MATERIAL_OPTIONS = [
  {
    value: "Cardboard",
    label: "",
  },
  {
    value: "#EAEAEA",
    label: "Paper",
  },
  {
    value: "disabled",
    label: "Disabled",
  },
  {
    value: "Yiminghe",
    label: "yiminghe",
  },
];

const FormControl = ({ initialValues = {}, onSubmit }) => {
  return (
    <Form
      name="basic"
      labelCol={{ span: 24 }}
      layout="vertical"
      initialValues={initialValues}
      wrapperCol={{ span: 24 }}
      onFinish={onSubmit}
    >
      <Row gutter={12}>
        <Col span={8}>
          <Form.Item label="Length(L)" name="length">
            <InputNumber style={{ width: "100%" }} min={1} max={250} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Width(W)" name="width">
            <InputNumber style={{ width: "100%" }} min={1} max={250} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Height(H)" name="depth">
            <InputNumber style={{ width: "100%" }} min={1} max={250} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label="Custom Thickness" name="thickness">
        <InputNumber style={{ width: "100%" }} min={0.2}  />
      </Form.Item>
      <Form.Item wrapperCol={{ span: 24 }}>
        <Button type="primary" htmlType="submit">
          Apply
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormControl;
