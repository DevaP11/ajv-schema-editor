import { useState } from 'react';
import { Card, Button, Modal, Typography, Switch, Checkbox, Input, Divider } from 'antd'
import {
  RightSquareFilled, BoldOutlined,
  FontSizeOutlined, FieldNumberOutlined, OrderedListOutlined,
  DownOutlined, CheckOutlined
} from '@ant-design/icons'
import Dropdown from 'antd/es/dropdown/dropdown';

const { Text } = Typography


export function EditKey({ isVisible, onClose, schema, onConfirm, path }) {
  const [isNullable, setIsNullable] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState(["string"]);
  const [properties, setProperties] = useState([]);
  const [requiredProps, setRequiredProps] = useState([]);

  // New state to track property types, nullable status
  const [propertyTypes, setPropertyTypes] = useState({});
  const [nullableProps, setNullableProps] = useState([]);

  const addProperty = () => {
    setProperties([...properties, { key: "", id: Date.now() }]);
  };

  const updatePropertyKey = (id, newKey) => {
    setProperties(props =>
      props.map(p => (p.id === id ? { ...p, key: newKey } : p))
    );
  };

  const toggleRequired = (key) => {
    setRequiredProps(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const toggleNullable = (key) => {
    setNullableProps(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const setPropertyType = (propertyId, typeName) => {
    setPropertyTypes(prev => ({
      ...prev,
      [propertyId]: typeName.toLowerCase()
    }));
  };

  const confirmProperty = (property) => {
    // This function will be called when the tick button is clicked
    // We don't need to do anything here immediately as the state is already updated
    // Just a visual confirmation for the user
    console.log(`Property ${property.key} confirmed with type ${propertyTypes[property.id]}`);
  };

  const toggleTypeSelection = (value) => {
    setSelectedTypes(prev => {
      if (prev.includes(value)) {
        // Ensure at least one type remains selected
        if (prev.length > 1) {
          return prev.filter(t => t !== value);
        }
        return prev;
      } else {
        return [...prev, value];
      }
    });
  };

  const updateNestedField = (
    obj,
    path,
    newValue
  ) => {
    const lastKey = path[path.length - 1];
    const parent = path.slice(0, -1).reduce((acc, key) => {
      if (!acc[key]) acc[key] = {};
      return acc[key];
    }, obj);

    parent[lastKey] = newValue;
  };

  const handleConfirm = () => {
    let newValue;

    if (selectedTypes.length > 1) {
      newValue = {
        anyOf: selectedTypes.map(t => ({ type: t }))
      };
    } else {
      newValue = {
        type: selectedTypes[0]
      };
    }

    if (isNullable) {
      if (!newValue.anyOf) {
        newValue = {
          anyOf: [{ type: selectedTypes[0] }, { type: "null" }]
        };
      } else {
        newValue.anyOf.push({ type: "null" });
      }
    }

    if (selectedTypes.includes("object")) {
      const props = {};
      properties.forEach(p => {
        if (p.key) {
          const propType = propertyTypes[p.id] || "string";
          props[p.key] = nullableProps.includes(p.key)
            ? { anyOf: [{ type: propType }, { type: "null" }] }
            : { type: propType };
        }
      });

      const objectEntry = newValue.anyOf?.find(e => e.type === "object");
      if (objectEntry) {
        objectEntry.properties = props;
        if (requiredProps.length > 0) objectEntry.required = requiredProps;
      } else if (newValue.type === "object") {
        newValue.properties = props;
        if (requiredProps.length > 0) newValue.required = requiredProps;
      }
    }

    updateNestedField(schema, path, newValue);

    onConfirm?.(); // schema already mutated, trigger a re-render
    onClose();
  };

  const typeOptions = [
    {
      name: "String",
      color: "#DBA400",
      icon: (<FontSizeOutlined />)
    },
    {
      name: "Number",
      color: "#0AAA40",
      icon: (<FieldNumberOutlined />)
    },
    {
      name: "Boolean",
      color: "#6395EE",
      icon: (<BoldOutlined />)
    },
    {
      name: "Object",
      color: 'grey',
      icon: (<RightSquareFilled />)
    },
    {
      name: "Array",
      color: 'grey',
      icon: (<OrderedListOutlined />)
    },
  ]
  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width="50vw"
      style={{ top: 120 }}
      closable
    >
      <h3 style={{ fontWeight: 300 }}>Edit field</h3>

      <Divider />
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 8px',
      }}>
        <div>
          <div style={{ fontSize: 16 }}>Nullable</div>
          <div style={{ fontSize: 12 }}>This will allow null values if the relevant type is not present </div>
        </div>
        <Switch
          checked={isNullable}
          onChange={setIsNullable}
          style={{
            backgroundColor: 'rgba(44,20,83,255)'
          }}
        />
      </div>
      <Divider />

      <div style={{ marginBottom: 20, padding: '0 8px', }}>
        <div style={{ fontSize: 16 }}>Select Type</div>
        <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
          {typeOptions.map(type => {
            const value = type.name.toLowerCase();
            const isSelected = selectedTypes.includes(value);

            return (
              <Card
                key={value}
                onClick={() => toggleTypeSelection(value)}
                style={{
                  border: isSelected ? `2px solid ${type.color}` : '1px solid #f0f0f0',
                  borderRadius: 8,
                  cursor: 'pointer',
                  width: 100,
                  textAlign: 'center',
                  padding: 8,
                }}
              >
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '100%',
                }}>
                  <Checkbox
                    checked={isSelected}
                    onChange={() => toggleTypeSelection(value)}
                    style={{ display: 'none' }} // Hide the checkbox but keep the functionality
                  />
                  <div style={{ fontSize: 12, color: type.color }}>{type.icon}</div>
                  <div style={{ fontSize: 12, color: type.color }}>{type.name}</div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {selectedTypes.includes("object") && (
        <div style={{ marginTop: 20 }}>
          <Divider />
          <Text strong>Object Properties:</Text>
          {properties.map((prop, idx) => {
            const propertyType = propertyTypes[prop.id] || "string";
            const typeOption = typeOptions.find(t => t.name.toLowerCase() === propertyType);

            return (
              <Card key={prop.id} size="small" style={{ marginTop: 10 }}>
                <Input
                  placeholder="Property name"
                  value={prop.key}
                  onChange={e => updatePropertyKey(prop.id, e.target.value)}
                  style={{ width: "40%" }}
                />
                <Dropdown
                  menu={{
                    items: typeOptions.map(type => ({
                      key: type.name,
                      label: (
                        <span style={{ marginLeft: 8, color: type.color }}>{type.icon}</span>
                      ),
                      onClick: () => setPropertyType(prop.id, type.name)
                    }))
                  }}
                >
                  <Button
                    icon={typeOption ? typeOption.icon : <DownOutlined />}
                    style={{
                      marginLeft: '10px',
                      color: typeOption ? typeOption.color : 'inherit'
                    }}
                  >
                    <DownOutlined style={{ fontSize: 10, marginLeft: 5 }} />
                  </Button>
                </Dropdown>
                <Checkbox
                  checked={requiredProps.includes(prop.key)}
                  onChange={() => toggleRequired(prop.key)}
                  style={{ marginLeft: 10 }}
                >
                  Required
                </Checkbox>
                <Checkbox
                  checked={nullableProps.includes(prop.key)}
                  onChange={() => toggleNullable(prop.key)}
                  style={{ marginLeft: 10 }}
                >
                  Nullable
                </Checkbox>
                <Button
                  icon={<CheckOutlined />}
                  type="text"
                  style={{ color: 'green', marginLeft: 10 }}
                  onClick={() => confirmProperty(prop)}
                />
              </Card>
            );
          })}
          <Button
            type="dashed"
            onClick={addProperty}
            style={{ marginTop: 10 }}
            block
          >
            Add Property
          </Button>
          <Divider />
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
        <Button onClick={onClose} style={{ marginRight: 8 }}>
          Cancel
        </Button>
        <Button type="primary" onClick={handleConfirm}>
          Confirm
        </Button>
      </div>
    </Modal>
  );
}
