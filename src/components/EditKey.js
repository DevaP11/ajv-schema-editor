'use client'

import { useState, useEffect } from 'react'
import { Card, Button, Modal, Typography, Switch, Checkbox, Input, Divider } from 'antd'
import {
  RightSquareFilled,
  BoldOutlined,
  FontSizeOutlined,
  FieldNumberOutlined,
  OrderedListOutlined,
  DownOutlined,
  CheckOutlined
} from '@ant-design/icons'
import Dropdown from 'antd/es/dropdown/dropdown'

const { Text } = Typography

export function EditKey ({ isVisible, onClose, schema, onConfirm, path, propertyName }) {
  console.log('EditKey-params', { isVisible, onClose, schema, onConfirm, path })

  // Get the current value at the path
  const getCurrentValue = () => {
    if (!path || path.length === 0) return null

    let current = schema
    let i = 0

    while (i < path.length) {
      const key = path[i]

      // If current is undefined or null, we can't go further
      if (current === undefined || current === null) {
        console.error('Path navigation failed at index', i, 'with key', key, 'in path', path)
        return null
      }

      // Skip "properties" in the path and continue with the next key
      if (key === 'properties') {
        i++
        continue
      }

      // If we're at the last key, return the value
      if (i === path.length - 1) {
        return current[key]
      }

      // Check if the next key is "properties"
      if (path[i + 1] === 'properties') {
        // If current[key] is an object with type "object" and has properties
        if (current[key] && current[key].type === 'object' && current[key].properties) {
          current = current[key].properties
          i += 2 // Skip both the key and "properties"
        }
        // If current[key] has anyOf with an object type
        else if (current[key] && current[key].anyOf) {
          const objType = current[key].anyOf.find((item) => item && item.type === 'object')
          if (objType && objType.properties) {
            current = objType.properties
            i += 2 // Skip both the key and "properties"
          } else {
            // If no object type with properties found, try to navigate to the next key
            current = current[key]
            i++
          }
        }
        // If current[key] is an array with items that have properties
        else if (current[key] && current[key].type === 'array' && current[key].items && current[key].items.properties) {
          current = current[key].items.properties
          i += 2 // Skip both the key and "properties"
        }
        // If current[key] is an array with items that have anyOf with an object type
        else if (current[key] && current[key].type === 'array' && current[key].items && current[key].items.anyOf) {
          const objType = current[key].items.anyOf.find((item) => item && item.type === 'object')
          if (objType && objType.properties) {
            current = objType.properties
            i += 2 // Skip both the key and "properties"
          } else {
            // If no object type with properties found, try to navigate to the next key
            current = current[key]
            i++
          }
        }
        // If none of the above, try to navigate to the next key
        else {
          // Check if current[key] exists before trying to navigate
          if (current[key] === undefined) {
            console.error(
              'Path navigation failed: current[key] is undefined at index',
              i,
              'with key',
              key,
              'in path',
              path
            )
            return null
          }
          current = current[key]
          i++
        }
      }
      // If the next key is not "properties", just navigate to the next key
      else {
        // Check if current[key] exists before trying to navigate
        if (current[key] === undefined) {
          console.error(
            'Path navigation failed: current[key] is undefined at index',
            i,
            'with key',
            key,
            'in path',
            path
          )
          return null
        }
        current = current[key]
        i++
      }
    }

    return current
  }

  const [currentValue, setCurrentValue] = useState(null)
  const [isNullable, setIsNullable] = useState(false)
  const [selectedTypes, setSelectedTypes] = useState(['string'])
  const [properties, setProperties] = useState([])
  const [requiredProps, setRequiredProps] = useState([])
  const [nullableProps, setNullableProps] = useState([])
  const [propertyTypes, setPropertyTypes] = useState({})

  // Initialize state when the modal becomes visible or path changes
  useEffect(() => {
    if (isVisible) {
      try {
        const value = getCurrentValue()
        console.log('Current value at path:', value)
        setCurrentValue(value)

        // Initialize nullable state
        if (value && value.anyOf) {
          setIsNullable(value.anyOf.some((item) => item && item.type === 'null'))
        } else {
          setIsNullable(false)
        }

        // Initialize selected types
        if (value) {
          if (value.anyOf) {
            setSelectedTypes(value.anyOf.filter((item) => item && item.type !== 'null').map((item) => item.type))
          } else if (value.type) {
            setSelectedTypes([value.type])
          } else {
            setSelectedTypes(['string'])
          }
        } else {
          setSelectedTypes(['string'])
        }

        // Initialize properties
        if (value) {
          if (value.type === 'object' && value.properties) {
            setProperties(
              Object.keys(value.properties).map((key) => ({
                key,
                id: Date.now() + Math.random() // Unique ID
              }))
            )
          } else if (value.anyOf) {
            const objType = value.anyOf.find((item) => item && item.type === 'object')
            if (objType && objType.properties) {
              setProperties(
                Object.keys(objType.properties).map((key) => ({
                  key,
                  id: Date.now() + Math.random() // Unique ID
                }))
              )
            } else {
              setProperties([])
            }
          } else {
            setProperties([])
          }
        } else {
          setProperties([])
        }

        // Initialize required properties
        if (value) {
          if (value.type === 'object' && value.required) {
            setRequiredProps(value.required)
          } else if (value.anyOf) {
            const objType = value.anyOf.find((item) => item && item.type === 'object')
            if (objType && objType.required) {
              setRequiredProps(objType.required)
            } else {
              setRequiredProps([])
            }
          } else {
            setRequiredProps([])
          }
        } else {
          setRequiredProps([])
        }

        // Initialize nullable properties
        const nullables = []
        if (value) {
          const getProps = (obj) => {
            if (!obj || !obj.properties) return null
            return obj.properties
          }

          let props
          if (value.type === 'object') {
            props = getProps(value)
          } else if (value.anyOf) {
            const objType = value.anyOf.find((item) => item && item.type === 'object')
            props = getProps(objType)
          }

          if (props) {
            Object.keys(props).forEach((key) => {
              const propDef = props[key]
              if (propDef && propDef.anyOf && propDef.anyOf.some((item) => item && item.type === 'null')) {
                nullables.push(key)
              }
            })
          }
        }
        setNullableProps(nullables)

        // Initialize property types
        const types = {}
        if (value) {
          const getProps = (obj) => {
            if (!obj || !obj.properties) return null
            return obj.properties
          }

          let props
          if (value.type === 'object') {
            props = getProps(value)
          } else if (value.anyOf) {
            const objType = value.anyOf.find((item) => item && item.type === 'object')
            props = getProps(objType)
          }

          if (props) {
            const newProperties = Object.keys(props).map((key) => ({
              key,
              id: Date.now() + Math.random()
            }))

            newProperties.forEach((prop) => {
              const propDef = props[prop.key]
              if (propDef) {
                if (propDef.type) {
                  types[prop.id] = propDef.type
                } else if (propDef.anyOf) {
                  const nonNullType = propDef.anyOf.find((item) => item && item.type !== 'null')
                  if (nonNullType) {
                    types[prop.id] = nonNullType.type
                  }
                }
              }
            })

            setProperties(newProperties)
          }
        }
        setPropertyTypes(types)
      } catch (error) {
        console.error('Error initializing EditKey state:', error)
      }
    }
  }, [isVisible, path, schema])

  const addProperty = () => {
    setProperties([...properties, { key: '', id: Date.now() }])
  }

  const updatePropertyKey = (id, newKey) => {
    setProperties((props) => props.map((p) => (p.id === id ? { ...p, key: newKey } : p)))
  }

  const toggleRequired = (key) => {
    setRequiredProps((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))
  }

  const toggleNullable = (key) => {
    setNullableProps((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))
  }

  const setPropertyType = (propertyId, typeName) => {
    setPropertyTypes((prev) => ({
      ...prev,
      [propertyId]: typeName.toLowerCase()
    }))
  }

  const confirmProperty = (property) => {
    // This function will be called when the tick button is clicked
    // We don't need to do anything here immediately as the state is already updated
    // Just a visual confirmation for the user
    console.log(`Property ${property.key} confirmed with type ${propertyTypes[property.id]}`)
  }

  const toggleTypeSelection = (value) => {
    setSelectedTypes((prev) => {
      if (prev.includes(value)) {
        // Ensure at least one type remains selected
        if (prev.length > 1) {
          return prev.filter((t) => t !== value)
        }
        return prev
      } else {
        return [...prev, value]
      }
    })
  }

  // Update the handleConfirm function to properly mutate the source schema
  const handleConfirm = () => {
    let newValue

    if (selectedTypes.length > 1) {
      newValue = {
        anyOf: selectedTypes.map((t) => ({ type: t }))
      }
    } else {
      newValue = {
        type: selectedTypes[0]
      }
    }

    if (isNullable) {
      if (!newValue.anyOf) {
        newValue = {
          anyOf: [{ type: selectedTypes[0] }, { type: 'null' }]
        }
      } else {
        // Check if null type already exists
        if (!newValue.anyOf.some((item) => item && item.type === 'null')) {
          newValue.anyOf.push({ type: 'null' })
        }
      }
    }

    if (selectedTypes.includes('object')) {
      const props = {}
      properties.forEach((p) => {
        if (p.key) {
          const propType = propertyTypes[p.id] || 'string'
          props[p.key] = nullableProps.includes(p.key)
            ? { anyOf: [{ type: propType }, { type: 'null' }] }
            : { type: propType }
        }
      })

      const objectEntry = newValue.anyOf?.find((e) => e && e.type === 'object')
      if (objectEntry) {
        objectEntry.properties = props
        if (requiredProps.length > 0) objectEntry.required = requiredProps
      } else if (newValue.type === 'object') {
        newValue.properties = props
        if (requiredProps.length > 0) newValue.required = requiredProps
      }
    }

    try {
      // Create a deep copy of the schema to avoid direct mutation
      const updatedSchema = JSON.parse(JSON.stringify(schema))

      // Navigate to the correct location in the schema and update it
      if (path.length === 1) {
        // For top-level keys
        updatedSchema[path[0]] = newValue
      } else {
        // For nested keys, we need to navigate through the path
        let current = updatedSchema
        let i = 0

        while (i < path.length - 1) {
          const key = path[i]

          // Skip "properties" in the path
          if (key === 'properties') {
            i++
            continue
          }

          // If the next key is "properties", we need to handle special cases
          if (path[i + 1] === 'properties') {
            // Handle object with type "object"
            if (current[key] && current[key].type === 'object') {
              if (!current[key].properties) {
                current[key].properties = {}
              }
              current = current[key].properties
              i += 2 // Skip both the key and "properties"
            }
            // Handle object inside anyOf
            else if (current[key] && current[key].anyOf) {
              const objType = current[key].anyOf.find((item) => item && item.type === 'object')
              if (objType) {
                if (!objType.properties) {
                  objType.properties = {}
                }
                current = objType.properties
                i += 2 // Skip both the key and "properties"
              } else {
                // If no object type found, create one
                const newObjType = { type: 'object', properties: {} }
                current[key].anyOf.push(newObjType)
                current = newObjType.properties
                i += 2 // Skip both the key and "properties"
              }
            }
            // Handle array with items that have properties
            else if (current[key] && current[key].type === 'array' && current[key].items) {
              if (!current[key].items.properties) {
                if (current[key].items.type === 'object') {
                  current[key].items.properties = {}
                } else {
                  current[key].items = { type: 'object', properties: {} }
                }
              }
              current = current[key].items.properties
              i += 2 // Skip both the key and "properties"
            }
            // If none of the above, move to the next key
            else {
              current = current[key]
              i++
            }
          } else {
            // Regular navigation
            current = current[key]
            i++
          }
        }

        // Set the new value at the final location
        current[path[path.length - 1]] = newValue
      }

      // Call onConfirm with the updated schema
      onConfirm(updatedSchema)
    } catch (error) {
      console.error('Error updating schema:', error)
    }

    onClose()
  }

  const typeOptions = [
    {
      name: 'String',
      color: '#DBA400',
      icon: <FontSizeOutlined />
    },
    {
      name: 'Number',
      color: '#0AAA40',
      icon: <FieldNumberOutlined />
    },
    {
      name: 'Boolean',
      color: '#6395EE',
      icon: <BoldOutlined />
    },
    {
      name: 'Object',
      color: 'grey',
      icon: <RightSquareFilled />
    },
    {
      name: 'Array',
      color: 'grey',
      icon: <OrderedListOutlined />
    }
  ]
  return (
    <Modal open={isVisible} onCancel={onClose} footer={null} width='50vw' style={{ top: 120 }} closable>
      <h3 style={{ fontWeight: 300 }}>
        Edit field: <span style={{ color: 'rgba(44,20,83,255)' }}>{propertyName}</span>
      </h3>

      <Divider />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 8px'
        }}
      >
        <div>
          <div style={{ fontSize: 16 }}>Nullable</div>
          <div style={{ fontSize: 12 }}>This will allow null values if the relevant type is not present </div>
        </div>
        <Switch
          checked={isNullable}
          onChange={setIsNullable}
          style={{
            backgroundColor: isNullable ? 'rgba(44,20,83,255)' : undefined
          }}
        />
      </div>
      <Divider />

      <div style={{ marginBottom: 20, padding: '0 8px' }}>
        <div style={{ fontSize: 16 }}>Select Type</div>
        <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
          {typeOptions.map((type) => {
            const value = type.name.toLowerCase()
            const isSelected = selectedTypes.includes(value)

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
                  padding: 8
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%'
                  }}
                >
                  <Checkbox
                    checked={isSelected}
                    onChange={() => toggleTypeSelection(value)}
                    style={{ display: 'none' }} // Hide the checkbox but keep the functionality
                  />
                  <div style={{ fontSize: 12, color: type.color }}>{type.icon}</div>
                  <div style={{ fontSize: 12, color: type.color }}>{type.name}</div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {selectedTypes.includes('object') && (
        <div style={{ marginTop: 20 }}>
          <Divider />
          <Text strong>Object Properties:</Text>
          {properties.map((prop, idx) => {
            const propertyType = propertyTypes[prop.id] || 'string'
            const typeOption = typeOptions.find((t) => t.name.toLowerCase() === propertyType)

            return (
              <Card key={prop.id} size='small' style={{ marginTop: 10 }}>
                <Input
                  placeholder='Property name'
                  value={prop.key}
                  onChange={(e) => updatePropertyKey(prop.id, e.target.value)}
                  style={{ width: '40%' }}
                />
                <Dropdown
                  menu={{
                    items: typeOptions.map((type) => ({
                      key: type.name,
                      label: <span style={{ marginLeft: 8, color: type.color }}>{type.icon}</span>,
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
                  type='text'
                  style={{ color: 'green', marginLeft: 10 }}
                  onClick={() => confirmProperty(prop)}
                />
              </Card>
            )
          })}
          <Button type='dashed' onClick={addProperty} style={{ marginTop: 10 }} block>
            Add Property
          </Button>
          <Divider />
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
        <Button onClick={onClose} style={{ marginRight: 8 }}>
          Cancel
        </Button>
        <Button type='primary' onClick={handleConfirm}>
          Confirm
        </Button>
      </div>
    </Modal>
  )
}
