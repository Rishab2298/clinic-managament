import React, { useContext, useEffect, useRef, useState } from "react";
import {
  AutoComplete,
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Table,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import "./example.css";

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
const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const App = ({ onDataEntered }) => {
  const [dataSource, setDataSource] = useState([
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
  ]);
  const inputRef = useRef(null);
  const [count, setCount] = useState(2);

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");

  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };
  const showModal = () => {
    setOpen(true);
  };
  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    options,
    inputRef,
    nextDataIndex,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const [focusIndex, setFocusIndex] = useState(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
        console.log(inputRef);
      }
    }, [editing]);
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({
          ...record,
          ...values,
        });
      } catch (errInfo) {
        console.log("Save failed:", errInfo);
      }
    };
    let childNode = children;
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
        >
          <AutoComplete
            notFoundContent={<Button onClick={showModal}>Add Option</Button>}
            options={options}
            ref={inputRef}
            allowClear={true}
            placeholder={title}
            onCell={(record, dataIndex)}
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
            }
            onSelect={(value, option) => {
              toggleEdit;
              // Call the `save` function when an option is selected
              save();
            }}
          />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
    return <td {...restProps}>{childNode}</td>;
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
  const defaultColumns = [
    {
      title: "Medicine Name",
      dataIndex: "medicine",
      width: "25%",
      editable: true,
      nextDataIndex: "dosage", // Next element's dataIndex
    },
    {
      title: "Dosage",
      dataIndex: "dosage",
      width: "12%",
      editable: true,
      nextDataIndex: "frequency", // Next element's dataIndex
    },
    {
      title: "Frequency",
      dataIndex: "frequency",
      width: "12%",
      editable: true,
      nextDataIndex: "timing", // Next element's dataIndex
    },
    {
      title: "Timing",
      dataIndex: "timing",
      width: "12%",
      editable: true,
      nextDataIndex: "duration", // Next element's dataIndex
    },
    {
      title: "Duration",
      dataIndex: "duration",
      width: "12%",
      editable: true,
      nextDataIndex: "instruction", // Next element's dataIndex
    },
    {
      title: "Instruction",
      dataIndex: "instruction",
      width: "12%",
      editable: true,
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.key)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </Popconfirm>
        ) : null,
    },
  ];
  const handleAdd = () => {
    handleSave(count - 1);
    const newData = {
      key: count,
      medicine: "",
      dosage: "",
      frequency: "",
      timing: "",
      duration: "",
      startFrom: "",
      instruction: "",
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };
  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
    if (onDataEntered) {
      onDataEntered(newData);
    }
  };
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        nextDataIndex: col.nextDataIndex,
        title: col.title,
        inputRef: inputRef,
        options: col.dataIndex === "medicine" ? medicines : "",

        handleSave,
      }),
    };
  });
  return (
    <div>
      <Button
        onClick={handleAdd}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        Add a row
      </Button>
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataSource}
        columns={columns}
      />
      <Modal
        title="Title"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{modalText}</p>
      </Modal>
    </div>
  );
};
export default App;
