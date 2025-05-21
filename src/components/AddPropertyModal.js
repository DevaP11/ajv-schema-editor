'use client'

import { useState } from 'react'
import { Modal, Input, Card, Button, Switch, Divider } from 'antd'
import {
  RightSquareFilled,
  BoldOutlined,
  FontSizeOutlined,
  FieldNumberOutlined,
  OrderedListOutlined
} from '@ant-design/icons'

export function AddPropertyModal ({ isVisible, onClose, onConfirm, parentPath, parentName }) {
  const [propertyName, setPropertyName] = useState('')
  const [propertyType, setPropertyType] = useState('string')
  const [isNullable, setIsNullable] = useState(false)
  const [error, setError] = useState('')

  const handleConfirm = () => {
    // Validate property name
    if (!propertyName.trim()) {
      setError('Property name is required')
      return
    }

    // Clear previous errors
    setError('')

    // Call onConfirm with the new property details
    onConfirm(propertyName.trim(), propertyType, isNullable)

    // Reset form
    setPropertyName('')
    setPropertyType('string')
    setIsNullable(false)

    // Close modal
    onClose()
  }

  const typeOptions = [
    {
      name: 'String',
      color: '#DBA400',
      icon: <FontSizeOutlined />,
      value: 'string'
    },
    {
      name: 'Number',
      color: '#0AAA40',
      icon: <FieldNumberOutlined />,
      value: 'number'
    },
    {
      name: 'Boolean',
      color: '#6395EE',
      icon: <BoldOutlined />,
      value: 'boolean'
    },
    {
      name: 'Object',
      color: 'grey',
      icon: <RightSquareFilled />,
      value: 'object'
    },
    {
      name: 'Array',
      color: 'grey',
      icon: <OrderedListOutlined />,
      value: 'array'
    }
  ]

  return (
    <Modal open={isVisible} onCancel={onClose} footer={null} width='500px' style={{ top: 120 }} closable>
      <h3 style={{ fontWeight: 300 }}>
        Add property to: <span style={{ color: 'rgba(44,20,83,255)' }}>{parentName}</span>
      </h3>

      <Divider />

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 16, marginBottom: 8 }}>Property Name</div>
        <Input
          placeholder='Enter property name'
          value={propertyName}
          onChange={(e) => setPropertyName(e.target.value)}
          status={error ? 'error' : ''}
        />
        {error && <div style={{ color: 'red', fontSize: 12, marginTop: 4 }}>{error}</div>}
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 16, marginBottom: 8 }}>Property Type</div>
        <div style={{ display: 'flex', gap: 12 }}>
          {typeOptions.map((type) => {
            const isSelected = propertyType === type.value

            return (
              <Card
                key={type.value}
                onClick={() => setPropertyType(type.value)}
                style={{
                  border: isSelected ? `2px solid ${type.color}` : '1px solid #f0f0f0',
                  borderRadius: 8,
                  cursor: 'pointer',
                  width: '19%',
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
                  <div style={{ fontSize: 12, color: type.color }}>{type.icon}</div>
                  <div style={{ fontSize: 12, color: type.color }}>{type.name}</div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <div style={{ fontSize: 16 }}>Nullable</div>
            <div style={{ fontSize: 12 }}>Allow null values for this property</div>
          </div>
          <Switch
            checked={isNullable}
            onChange={setIsNullable}
            style={{
              backgroundColor: isNullable ? 'rgba(44,20,83,255)' : undefined
            }}
          />
        </div>
      </div>

      <Divider />

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={onClose} style={{ marginRight: 8 }}>
          Cancel
        </Button>
        <Button type='primary' onClick={handleConfirm}>
          Add Property
        </Button>
      </div>
    </Modal>
  )
}
