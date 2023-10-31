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
const dosages = [" cap", " pill", " kill", " mill"];
const timings = [" cap", " pill", " kill", " mill"];
const frquencies = [" cap", " pill", " kill", " mill"];
const durations = [" cap", " pill", " kill", " mill"];
const startFroms = [" cap", " pill", " kill", " mill"];

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
      key: 1,
      medicine: "",
      dosage: "",
      frequency: "",
      timing: "",
      duration: "",
      startFrom: "",
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
    result,
    inputRef,
    nextDataIndex,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const [focusIndex, setFocusIndex] = useState(null);
    const form = useContext(EditableContext);
    const [ooptions, setOoptions] = useState([]);
    const handleSearch = (value) => {
      let res = [];
      if (!value || value.indexOf("@") >= 0) {
        res = [];
      } else {
        res = result.map((domain) => ({
          label: `${value} ${domain}`,
          value: `${value} ${domain}`,
        }));
      }
      setOoptions(res);
    };

    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
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
          {dataIndex === "medicine" ? ( // Conditional rendering based on dataIndex
            <AutoComplete
              className="autocomplete-input"
              notFoundContent={<Button onClick={showModal}>Add Option</Button>}
              options={result}
              ref={inputRef}
              allowClear={true}
              placeholder={title}
              filterOption={(inputValue, option) =>
                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
                -1
              }
              onSelect={(value, option) => {
                // Call the `save` function when an option is selected
                save();
              }}
            />
          ) : (
            <AutoComplete
              className="autocomplete-input"
              notFoundContent={<Button onClick={showModal}>Add Option</Button>}
              onSearch={handleSearch}
              ref={inputRef}
              allowClear={true}
              placeholder={title}
              options={ooptions}
              onSelect={(value, option) => {
                // Call the `save` function when an option is selected
                save();
              }}
            />
          )}
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
      nextDataIndex: "dosage",
      options: medicines, // Next element's dataIndex
    },
    {
      title: "Dosage",
      dataIndex: "dosage",
      width: "14%",
      editable: true,
      nextDataIndex: "frequency",
      options: dosages, // Next element's dataIndex
    },
    {
      title: "Frequency",
      dataIndex: "frequency",
      width: "14%",
      editable: true,
      nextDataIndex: "timing",
      options: frquencies, // Next element's dataIndex
    },
    {
      title: "Timing",
      dataIndex: "timing",
      width: "14%",
      editable: true,
      nextDataIndex: "duration",
      options: timings, // Next element's dataIndex
    },
    {
      title: "Duration",
      dataIndex: "duration",
      width: "14%",
      editable: true,
      nextDataIndex: "startFrom",
      options: durations, // Next element's dataIndex
    },
    {
      title: "Start From",
      dataIndex: "startFrom",
      width: "14%",
      editable: true,
      options: startFroms,
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) =>
        dataSource.length > 1 ? (
          <div className="action-container">
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete(record.key)}
            >
              <FontAwesomeIcon icon={faTrash} className="action-icon trash" />
            </Popconfirm>
            <FontAwesomeIcon
              onClick={handleAdd}
              icon={faPlus}
              className="action-icon add"
            />
          </div>
        ) : (
          <FontAwesomeIcon onClick={handleAdd} icon={faPlus} />
        ),
    },
  ];
  const handleAdd = () => {
    const newData = {
      key: count,
      medicine: "",
      dosage: "",
      frequency: "",
      timing: "",
      duration: "",
      startFrom: "",
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
        result: col.options,

        handleSave,
      }),
    };
  });
  return (
    <div>
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
