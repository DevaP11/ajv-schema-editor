"use client"

import { useState } from "react"
import { Card, Button } from "antd"
import {
  DownSquareFilled,
  EditOutlined,
  RightSquareFilled,
  BoldOutlined,
  FontSizeOutlined,
  FieldNumberOutlined,
  OrderedListOutlined,
  PlusOutlined,
} from "@ant-design/icons"

export function KeyCard(props) {
  const { obj, param, level = 0, setIsEditModalVisible, setEditingPath, onAddProperty, path = [] } = props

  const [isKeySelected, setIsKeySelected] = useState(false)
  if (!obj[param]) {
    console.log({ param, obj })
    return <></>
  }

  const isNullable =
    obj[param].anyOf && obj[param].anyOf?.map((item) => item && item.type)?.filter((el) => el !== "null")?.length === 1
  if (isNullable) {
    obj[param].type = obj[param].anyOf?.map((item) => item && item.type)?.filter((el) => el !== "null")[0]
    obj[param].isNullable = true
  }

  let typeIcon
  if (obj[param].type === "object") {
    typeIcon = (
      <Button
        icon={isKeySelected ? <DownSquareFilled /> : <RightSquareFilled />}
        size="small"
        onClick={() => {
          setIsKeySelected(!isKeySelected)
        }}
        style={{ color: "grey", fontSize: 12 }}
        type="text"
      />
    )
  } else if (obj[param].type === "array" && obj[param].items && obj[param].items.type === "object") {
    typeIcon = (
      <Button
        icon={isKeySelected ? <DownSquareFilled /> : <OrderedListOutlined />}
        size="small"
        onClick={() => {
          setIsKeySelected(!isKeySelected)
        }}
        style={{ color: "grey", fontSize: 12 }}
        type="text"
      />
    )
  } else if (obj[param].type) {
    let icon
    let typeColor
    switch (obj[param].type) {
      case "string": {
        typeColor = "#DBA400"
        icon = <FontSizeOutlined />
        break
      }
      case "integer":
      case "number": {
        typeColor = "#0AAA40"
        icon = <FieldNumberOutlined />
        break
      }
      case "boolean": {
        typeColor = "#6395EE"
        icon = <BoldOutlined />
        break
      }
      case "array": {
        icon = isKeySelected ? <DownSquareFilled /> : <OrderedListOutlined />
        break
      }
      default: {
        icon = <></>
      }
    }
    typeIcon = (
      <Button
        icon={icon}
        size="small"
        onClick={() => {
          return obj[param].type === "array" ? setIsKeySelected(!isKeySelected) : null
        }}
        style={{
          color: typeColor || "grey",
          fontSize: 12,
        }}
        type="text"
      />
    )
  } else {
    typeIcon = <></>
  }

  const fontSize = 14 - level

  // Get the children based on the type of the current object
  let children = null
  if (obj[param].type === "object" && obj[param].properties) {
    children = obj[param].properties
  } else if (obj[param].type === "array" && obj[param].items) {
    if (obj[param].items.type === "object" && obj[param].items.properties) {
      children = obj[param].items.properties
    }
  }

  const hasChildren = Boolean(children && Object.keys(children).length > 0)

  // Handle edit button click
  const handleEditClick = () => {
    // For top-level keys, we need a special path format
    if (path.length === 0) {
      setEditingPath([param])
    } else {
      // For nested keys, we need to maintain the correct hierarchy
      setEditingPath([...path, "properties", param])
    }
    setIsEditModalVisible(true)
  }

  // Handle add property button click
  const handleAddPropertyClick = () => {
    const currentPath = path.length === 0 ? [param] : [...path, param]
    onAddProperty(currentPath)
  }

  return (
    <div style={{ position: "relative" }}>
      {isKeySelected && children && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: `${level * 40 + 24}px`,
            bottom: "0px",
            width: "1px",
            backgroundColor: "#d9d9d9",
          }}
        />
      )}
      <Card
        style={{
          width: 97 - level * 10 + "%",
          height: 40 - level * 2 + "px",
          marginTop: 20 - level * 6 + "px",
          marginLeft: level * 40 + "px",
          borderRadius: "2px",
          padding: "6px 12px 6px 12px",
          background: "#fff",
          boxShadow: "none",
          border: "1px solid #d9d9d9",
        }}
        styles={{
          body: {
            padding: 0,
          },
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "start",
            alignItems: "center",
          }}
        >
          {typeIcon}
          <span style={{ margin: 0, marginLeft: "10px", fontSize: 14, fontWeight: 300 }}>{param}</span>
          {hasChildren && (
            <span
              style={{
                marginLeft: "auto",
                marginBottom: "2px",
                fontSize,
                color: "grey",
              }}
            >{`{ ${Object.keys(children).length} }`}</span>
          )}
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={handleEditClick}
            style={{
              marginLeft: hasChildren ? "10px" : "auto",
              color: "grey",
              fontSize,
            }}
            type="text"
          />
        </div>
      </Card>
      {isKeySelected && children && (
        <div style={{ position: "relative" }}>
          {Object.keys(children).map((internalKey, index) => (
            <KeyCard
              key={internalKey}
              setEditingPath={setEditingPath}
              obj={children}
              path={[...path, param, "properties"]} // Correct path for nested properties
              param={internalKey}
              level={level + 1}
              setIsEditModalVisible={setIsEditModalVisible}
              onAddProperty={onAddProperty}
            />
          ))}
          {/* Add button for adding new properties to this object */}
          <Card
            style={{
              width: 97 - (level + 1) * 10 + "%",
              height: 40 - (level + 1) * 4 + "px",
              marginTop: "15px",
              marginLeft: (level + 1) * 40 + "px",
              borderRadius: "2px",
              padding: "6px 12px 6px 12px",
              background: "#fff",
              boxShadow: "none",
              border: "transparent",
              cursor: "pointer",
            }}
            styles={{
              body: {
                padding: 0,
              },
            }}
            onClick={handleAddPropertyClick}
          >
            <Button
              icon={<PlusOutlined />}
              size="small"
              style={{
                color: "grey",
                fontSize,
              }}
              type="text"
            />
            <span style={{ margin: 0, marginLeft: "10px", fontSize, fontWeight: 300 }}>Add</span>
          </Card>
        </div>
      )}
    </div>
  )
}
