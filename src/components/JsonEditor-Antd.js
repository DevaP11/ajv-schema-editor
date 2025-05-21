"use client"

import { useState, useEffect } from "react"
import { Row, Col, Card } from "antd"
import { EditKey } from "./EditKey"
import { KeyCard } from "./KeyCard"
import { AddPropertyModal } from "./AddPropertyModal"

/**
 * @name preRenderJson
 * @description
 * When the JSON is rendered in View JSON, the type object is moved inside the parent key.
 * So key: { type: string } will be converted to key: string.
 * This is done for readability inside View Json card.
 * @returns
 */
const preRenderJson = (input) => {
  let obj = JSON.parse(JSON.stringify(input))
  if (typeof obj !== "object" || obj === null) {
    return obj
  }

  // Check if this object has a "type" property that isn't "object"
  if (obj.type && obj.type === "array" && obj.items) {
    obj = [obj.items]
  }

  if (obj.anyOf && obj.anyOf?.map((item) => item.type)?.filter((el) => el !== "null")?.length === 1) {
    return obj.anyOf?.map((item) => item.type)?.filter((el) => el !== "null")[0]
  }

  // Check if this object has a "type" property that isn't "object"
  if (obj.type && ["integer", "number", "string", "boolean", "null"].includes(obj.type)) {
    return obj.enum || obj.type // Return the type value to replace the parent
  }

  if (obj.type && obj.type === "object" && obj.properties) {
    obj = obj.properties
  }

  // Process each property
  for (const key in obj) {
    if (obj[key] && typeof obj[key] === "object") {
      // Replace the property with the result of recursive call
      obj[key] = preRenderJson(obj[key])
    }
  }

  return obj
}

const formatJsonCompact = (jsonObject) => {
  let json = JSON.stringify(
    jsonObject,
    (key, value) => {
      // Inline arrays with primitive types
      if (Array.isArray(value) && value.every((v) => typeof v !== "object")) {
        return `@@__INLINE__${JSON.stringify(value)}__@@`
      }
      return value
    },
    2,
  )

  json = json.replace(/"@@__INLINE__(.*?)__@@"/g, (_, arrayContent) => {
    const str = arrayContent?.replace(/\\/g, "")?.replaceAll('"', `'`)
    if (str?.length > 20) {
      return "[ " + str?.split("[")?.[1]?.split(",")[0] + ", ... " + str?.split("]")?.[0]?.split(",")[1] + "]"
    }
    return str
  })
  return json
}

const getColorByValue = (value) => {
  if (value === "{" || value === "}") {
    return "#bc70bd"
  }
  if (value.includes("[") && value.includes("]") && ["string", "number", "integer"].some((e) => value?.includes(e)))
    return "#FF85B3"
  if (value.includes("[") && value.includes("]")) return "#7fbfff"
  if (value.includes("[") || value.includes("]")) return "#bc70bd"
  if (value === "integer") return "#7fc6a4" // Teal for numbers
  if (value === "number") return "#7fc6a4" // Teal for numbers
  if (value === "string") return "#e1c97b" // Yellow for strings
  if (value === "boolean") return "#6395EE" // Light blue for booleans
  if (value === null) return "#ff9b9b" // Pink for null
  return "#ffffff" // Default
}

const highlightJsonLine = (line) => {
  const keyValueRegex = /^(\s*"[^"]+": )(.+?)([,|])?$/
  const match = line.match(keyValueRegex)

  if (match) {
    const [, key, rawValue, comma] = match
    let parsedValue

    try {
      parsedValue = JSON.parse(rawValue)
    } catch {
      parsedValue = rawValue
    }

    const color = getColorByValue(parsedValue)

    return (
      <>
        <span style={{ color: "#bc70bd" }}>{key}</span>
        <span style={{ color }}>{rawValue}</span>
        <span style={{ color: "#bc70bd" }}>{comma || ""}</span>
      </>
    )
  }

  return <span style={{ color: "#bc70bd" }}>{line}</span>
}

const addLineNumbersAndStringify = (jsonObject) => {
  const formattedJson = formatJsonCompact(jsonObject)

  return formattedJson.split("\n").map((line, index) => (
    <div key={index} style={{ whiteSpace: "pre" }}>
      <span style={{ color: "#462d71", userSelect: "none", marginRight: 18 }}>
        {String(index + 1).padStart(2, " ")}
      </span>
      {highlightJsonLine(line)}
    </div>
  ))
}

// Update the JsonEditor component to properly handle schema updates
const JsonEditor = ({ schema }) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [isAddPropertyModalVisible, setIsAddPropertyModalVisible] = useState(false)
  const [addPropertyPath, setAddPropertyPath] = useState([])
  const [edittedSchema, setEdittedSchema] = useState(schema)
  const [editingPath, setEditingPath] = useState([])
  const [renderKey, setRenderKey] = useState(Date.now())
  const [viewJsonContent, setViewJsonContent] = useState(null)

  // Update the view JSON content whenever the schema changes
  useEffect(() => {
    const processedJson = preRenderJson(edittedSchema)
    setViewJsonContent(addLineNumbersAndStringify(processedJson))
    // Force re-render by updating the key
    setRenderKey(Date.now())
  }, [edittedSchema])

  // Function to handle schema updates
  const handleSchemaUpdate = (updatedSchema) => {
    // Make sure we're not replacing the schema with an empty object
    if (updatedSchema && Object.keys(updatedSchema).length > 0) {
      console.log("Schema updated:", updatedSchema)
      // Create a new object reference to ensure React detects the change
      setEdittedSchema({ ...updatedSchema })
    } else {
      console.error("Attempted to update schema with empty object", updatedSchema)
    }
  }

  // Handler for adding a new property
  const handleAddPropertyClick = (path) => {
    setAddPropertyPath(path)
    setIsAddPropertyModalVisible(true)
  }

  // Handler for adding a new property to the schema
  const handleAddProperty = (propertyName, propertyType, isNullable) => {
    // Create a deep copy of the schema to avoid direct mutation
    const updatedSchema = JSON.parse(JSON.stringify(edittedSchema))

    // Navigate to the correct location in the schema
    let current = updatedSchema
    const path = [...addPropertyPath]

    for (let i = 0; i < path.length; i++) {
      const key = path[i]

      // Handle special case for "properties"
      if (key === "properties") {
        continue
      }

      // If we're at the last key in the path
      if (i === path.length - 1) {
        // Check if this is an object with properties
        if (current[key].type === "object") {
          if (!current[key].properties) {
            current[key].properties = {}
          }

          // Add the new property
          let newPropValue = { type: propertyType }
          if (isNullable) {
            newPropValue = { anyOf: [{ type: propertyType }, { type: "null" }] }
          }

          current[key].properties[propertyName] = newPropValue
        }
        // Check if this is an object inside anyOf
        else if (current[key].anyOf) {
          const objType = current[key].anyOf.find((item) => item.type === "object")
          if (objType) {
            if (!objType.properties) {
              objType.properties = {}
            }

            // Add the new property
            let newPropValue = { type: propertyType }
            if (isNullable) {
              newPropValue = { anyOf: [{ type: propertyType }, { type: "null" }] }
            }

            objType.properties[propertyName] = newPropValue
          }
        }
      }
      // If not the last key, navigate to the next level
      else {
        // Handle object with properties
        if (current[key].type === "object" && current[key].properties) {
          if (path[i + 1] === "properties") {
            current = current[key].properties
            i++
          } else {
            current = current[key]
          }
        }
        // Handle object inside anyOf
        else if (current[key].anyOf) {
          const objType = current[key].anyOf.find((item) => item.type === "object")
          if (objType && objType.properties && path[i + 1] === "properties") {
            current = objType.properties
            i++
          } else {
            current = current[key]
          }
        }
        // Regular navigation
        else {
          current = current[key]
        }
      }
    }

    handleSchemaUpdate(updatedSchema)
  }

  // Extract property name from path for display in modal title
  const getPropertyNameFromPath = (path) => {
    if (!path || path.length === 0) return "Schema"

    // The property name is usually the last non-"properties" element in the path
    for (let i = path.length - 1; i >= 0; i--) {
      if (path[i] !== "properties") {
        return path[i]
      }
    }

    return "Schema"
  }

  // Create references to the functions needed by child components
  const handlers = {
    onEdit: (path) => {
      setEditingPath(path)
      setIsEditModalVisible(true)
    },
    onAddProperty: handleAddPropertyClick,
    onSchemaUpdate: handleSchemaUpdate,
  }

  return (
    <div style={{ position: "relative", height: "100vh", padding: "10vh 0 0 10vh" }}>
      <EditKey
        isVisible={isEditModalVisible}
        schema={edittedSchema}
        path={editingPath}
        propertyName={getPropertyNameFromPath(editingPath)}
        onClose={() => {
          setIsEditModalVisible(false)
        }}
        onConfirm={handleSchemaUpdate}
      />

      <AddPropertyModal
        isVisible={isAddPropertyModalVisible}
        onClose={() => setIsAddPropertyModalVisible(false)}
        onConfirm={handleAddProperty}
        parentPath={addPropertyPath}
        parentName={getPropertyNameFromPath(addPropertyPath)}
      />

      <Row>
        <Col>
          <Card
            style={{
              overflow: "auto",
              maxHeight: "80vh",
              minHeight: "80vh",
              width: "45vw",
              fontSize: 12,
              backgroundColor: "rgba(44,20,83,255)",
              borderColor: "rgba(44,20,83,255)",
              boxShadow: "0 14px 20px rgba(0,0,0,0.3)",
              position: "relative",
              zIndex: 1,
              borderRadius: "12px",
            }}
          >
            <span style={{ fontSize: 14, color: "#fff", marginLeft: "10px", fontWeight: 500 }}>View JSON</span>
            <pre key={renderKey}>{viewJsonContent}</pre>
          </Card>
        </Col>
        <Col>
          <Card
            style={{
              overflow: "auto",
              maxHeight: "80vh",
              height: "80vh",
              width: "45vw",
              position: "absolute",
              right: "-38vw",
              zIndex: 2,
              boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
              borderRadius: "12px",
            }}
          >
            <span style={{ fontWeight: 500 }}>Edit JSON</span>
            <>
              {Object.keys(edittedSchema).map((key) => {
                return (
                  <KeyCard
                    key={`${key}-${renderKey}`}
                    obj={edittedSchema}
                    setEditingPath={handlers.onEdit}
                    onAddProperty={handlers.onAddProperty}
                    param={key}
                    setIsEditModalVisible={setIsEditModalVisible}
                  />
                )
              })}
            </>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default JsonEditor
