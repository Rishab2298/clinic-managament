import React, { useState } from "react";
import { Form, Input, InputNumber, Popconfirm, Table, Typography } from "antd";
const originData = [
  {
    key: 0,
    medicine: "Something",
    dosage: "String",
    frequency: "2",
    timing: "String",
    duration: "String",
    startFrom: "String",
    instruction: "String",
  },
];
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
const App = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };
  const add = async () => {
    const newRow = {
      key: data.length,
      medicine: "",
      dosage: "",
      frequency: "",
      timing: "",
      duration: "",
      startFrom: "",
      instruction: "",
    };
    setData([...data, newRow]);
    setEditingKey(newRow.key);
    form.resetFields();
  };
  const remove = (key) => {
    setData(data.filter((item) => item.key !== key));
    setEditingKey("0a");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const columns = [
    {
      title: "Medicine Name",
      dataIndex: "medicine",
      width: "25%",
      editable: true,
    },
    {
      title: "Dosage",
      dataIndex: "dosage",
      width: "10%",
      editable: true,
    },
    {
      title: "Frequency",
      dataIndex: "frequency",
      width: "10%",
      editable: true,
    },
    {
      title: "Timing",
      dataIndex: "timing",
      width: "10%",
      editable: true,
    },
    {
      title: "Duration",
      dataIndex: "duration",
      width: "10%",
      editable: true,
    },
    {
      title: "Instruction",
      dataIndex: "instruction",
      width: "10%",
      editable: true,
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Typography.Link
              onClick={() => add()}
              style={{
                marginRight: 8,
              }}
            >
              Add
            </Typography.Link>
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => remove(record.key)}
            >
              <a>Delete</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={false}
        onRow={(record) => {
          return {
            onClick: () => {
              if (!isEditing(record)) {
                edit(record);
              }
            },
          };
        }}
      />
    </Form>
  );
};
export default App;
