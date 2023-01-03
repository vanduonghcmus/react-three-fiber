import { Button, Col, Form, InputNumber, Row, Select } from "antd";
import React from "react";

const MATERIAL_OPTIONS = [
  {
    value: "jack",
    label: "Jack",
  },
  {
    value: "lucy",
    label: "Lucy",
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
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Width(W)" name="width">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Height(H)" name="height">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label="Thickness" name="thickness">
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item label="Choose Material" name="material">
        <Select
          defaultValue="lucy"
          options={MATERIAL_OPTIONS}
        />
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
