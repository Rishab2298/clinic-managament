import React, { useState } from "react";
import { Form, Input, InputNumber, Popconfirm, Table, Typography } from "antd";

let originData = [
  {
    key: Date.now().toString(), // Use a timestamp as a unique key
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
    // Set the form fields' values for the row to be edited
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const remove = (key) => {
    // Remove the row with the given key from the data
    const newData = data.filter((item) => item.key !== key);
    setData(newData);

    // Also remove it from the originData
    const newOriginData = originData.filter((item) => item.key !== key);
    originData = newOriginData;
  };

  const cancel = () => {
    // Cancel editing, clear the form, and reset the editing key
    form.resetFields();
    setEditingKey("");
  };

  const add = async () => {
    form.resetFields();
    // Add a new row with a unique key and default values
    const newRow = {
      key: Date.now().toString(),
      medicine: "",
      dosage: "",
      frequency: "",
      timing: "",
      duration: "",
      startFrom: "",
      instruction: "",
    };

    // Append the new row to the data
    const newData = [...data, newRow];
    setData(newData);

    // Append it to the originData as well

    // Set it as the currently editing row
    setEditingKey(newRow.key);
  };

  const save = async (key) => {
    try {
      // Validate the form fields
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        // If the row exists, update it with the new data
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });

        // Update the data
        setData(newData);
        // Reset the editing key
        setEditingKey("");
      } else {
        // If the row doesn't exist, it's a new row. Add it to the data.
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
      title: "Operation",
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
        inputType: col.dataIndex === "frequency" ? "number" : "text",
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
      />
    </Form>
  );
};

export default App;
