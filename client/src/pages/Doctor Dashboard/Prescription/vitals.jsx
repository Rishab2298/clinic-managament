import React, { useState } from "react";
import { Col, Form, Input, Row } from "antd";
import "./example.css";

const Vitals = ({ onDataEntered }) => {
  const [dataSource, setDataSource] = useState({}); // Initialize with an empty object

  const handleSave = (changedFields) => {
    const updatedDataSource = { ...dataSource, ...changedFields };

    setDataSource(updatedDataSource);
    console.log(dataSource);
    console.log(updatedDataSource);
    if (onDataEntered) {
      onDataEntered(updatedDataSource);
    }
  };
  return (
    <>
      <div className="vitals-div-style">
        <Form
          layout="horizontal"
          className="vitals-form-style"
          onFieldsChange={handleSave}
        >
          <Row gutter={{ xs: 8, sm: 16, md: 48, lg: 48 }}>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item label="Height" id="height">
                <Input addonAfter="cm" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item label="Weight" id="weight">
                <Input addonAfter="kg" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item label="Pulse" id="pulseRate">
                <Input addonAfter="/min" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item label="Temperature" id="temperature">
                <Input addonAfter="F" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item label="Systolic BP" id="bloodPressureSystolic">
                <Input addonAfter="mmHg" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item label="Diastolic BP" id="bloodPressureDiastolic">
                <Input addonAfter="mmHg" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default Vitals;
