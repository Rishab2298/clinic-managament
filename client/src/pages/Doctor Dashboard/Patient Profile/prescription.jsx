import React, { useState } from "react";
import { AutoComplete, Button, message, Modal } from "antd";
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
const medicines = [
  {
    value: "Burns Bay Road",
  },
  {
    value: "Downing Street",
  },
  {
    value: "Wall Street",
  },
  {
    value: "Rishab",
  },
  {
    value: "Trishla",
  },
  {
    value: "Akash",
  },
  {
    value: "Naman",
  },
  {
    value: "Chirag",
  },
  {
    value: "Kriti",
  },
  {
    value: "Black",
  },
  {
    value: "White",
  },
  {
    value: "Brown",
  },
  {
    value: "Yellow",
  },
  {
    value: "Golden",
  },
  {
    value: "Violet",
  },
  {
    value: "Pink",
  },
  {
    value: "Red",
  },
  {
    value: "Purple",
  },
  {
    value: "Green",
  },

  {
    value: "Blue",
  },
];

const Prescription = ({ onDataEntered }) => {
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState("");
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const isEditing = (record) => record.key === editingKey;
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setModalText("The modal will be closed after two seconds");
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };
  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };
  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    options,
    ...restProps
  }) => {
    const inputNode =
      inputType === "number" ? (
        <InputNumber />
      ) : (
        <AutoComplete
          notFoundContent={<Button onClick={showModal}>Add Option</Button>}
          options={options}
          allowClear={true}
          placeholder={title}
          filterOption={(inputValue, option) =>
            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
        />
      );
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

  // const save = async (key) => {
  //   try {
  //     const row = await form.validateFields();
  //     const newData = [...data];
  //     const index = newData.findIndex((item) => key === item.key);
  //     if (index > -1) {
  //       const item = newData[index];
  //       newData.splice(index, 1, {
  //         ...item,
  //         ...row,
  //       });
  //       setData(newData);
  //       setEditingKey("");
  //     } else {
  //       newData.push(row);
  //       setData(newData);
  //       setEditingKey("");
  //     }
  //   } catch (errInfo) {
  //     console.log("Validate Failed:", errInfo);
  //   }
  // };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      // Assuming that "row" contains the entered data you want to pass back

      // Call the callback function with the data (if onDataEntered is provided as a prop)
      if (onDataEntered) {
        onDataEntered(row);
      }

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
      width: "12%",
      editable: true,
    },
    {
      title: "Frequency",
      dataIndex: "frequency",
      width: "12%",
      editable: true,
    },
    {
      title: "Timing",
      dataIndex: "timing",
      width: "12%",
      editable: true,
    },
    {
      title: "Duration",
      dataIndex: "duration",
      width: "12%",
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
  //if data index is medicine then the setOption must be medicines
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
        options: col.dataIndex === "medicine" ? medicines : "",
      }),
    };
  });
  return (
    <>
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
      <Modal
        title="Title"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{modalText}</p>
      </Modal>
    </>
  );
};
export default Prescription;
