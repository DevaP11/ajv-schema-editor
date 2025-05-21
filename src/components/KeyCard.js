import { useState } from 'react';
import { Card, Button, } from 'antd'
import {
  DownSquareFilled, EditOutlined, RightSquareFilled, BoldOutlined,
  FontSizeOutlined, FieldNumberOutlined, OrderedListOutlined, PlusOutlined
} from '@ant-design/icons'

export function KeyCard(props) {
  const { obj, param, level = 0, setIsEditModalVisible, setEditingPath, path = [] } = props
  const [isKeySelected, setIsKeySelected] = useState(false)
  if (!obj[param]) {
    console.log({ param, obj })
    return (<></>)
  }

  const isNullable = obj[param].anyOf && obj[param].anyOf?.map(item => item.type)?.filter(el => el !== 'null')?.length === 1
  if (isNullable) {
    obj[param].type = obj[param].anyOf?.map(item => item.type)?.filter(el => el !== 'null')[0]
    obj[param].isNullable = true
  }

  let typeIcon
  if (obj[param].type === "object") {
    typeIcon = (
      <Button
        icon={isKeySelected ? <DownSquareFilled /> : <RightSquareFilled />}
        size='small'
        onClick={() => { setIsKeySelected(!isKeySelected) }}
        style={{ color: 'grey', fontSize: 12 }}
        type="text"
      />
    )
  } else if (obj[param].type) {
    let icon
    let typeColor
    switch (obj[param].type) {
      case 'string': {
        typeColor = "#DBA400"
        icon = (<FontSizeOutlined />)
        break
      }
      case 'integer':
      case 'number': {
        typeColor = "#0AAA40"
        icon = (<FieldNumberOutlined />)
        break
      }
      case 'boolean': {
        typeColor = "#6395EE"
        icon = (<BoldOutlined />)
        break
      }
      case 'array': {
        icon = isKeySelected ? (<DownSquareFilled />) : (<OrderedListOutlined />)
        break
      }
      default: {
        icon = (<></>)
      }
    }
    typeIcon = (
      <Button
        icon={icon}
        size='small'
        onClick={() => { return obj[param].type === "array" && obj[param].items.type === "object" ? setIsKeySelected(!isKeySelected) : null }}
        style={{
          color: typeColor || 'grey',
          fontSize: 12
        }}
        type="text"
      />
    )
  } else {
    typeIcon = (<></>)
  }

  const fontSize = 14 - level
  const children = obj[param].properties || obj[param].items?.properties
  return (
    <div style={{ position: "relative" }}>
      {isKeySelected && children && (
        <div
          style={{
            position: "absolute",
            top: "20px", // aligns to center of the button
            left: `${level * 40 + 24}px`, // shift line under the icon
            bottom: "0px",
            width: "1px",
            backgroundColor: "#d9d9d9",
          }}
        />
      )}
      <Card
        style={{
          width: (97 - (level * 10)) + '%',
          height: (40 - (level * 2)) + 'px',
          marginTop: (20 - (level * 6)) + 'px',
          marginLeft: (level * 40) + 'px',
          borderRadius: '2px',
          padding: '6px 12px 6px 12px',
          background: '#fff',
          boxShadow: 'none',
          border: '1px solid #d9d9d9',
        }}
        styles={{
          body: {
            padding: 0
          }
        }}
      >
        <div style={{
          display: "flex", /* Makes the container a flex container */
          flexDirection: "row", /* Items are displayed horizontally (default) */
          justifyContent: "start", /* Distributes space between items */
          alignItems: "center"
        }}>
          {typeIcon}
          <span style={{ margin: 0, marginLeft: '10px', fontSize: 14, fontWeight: 300 }}>{param}</span>
          {obj[param]?.properties &&
            <span style={{
              marginLeft: 'auto',
              marginBottom: '2px',
              fontSize,
              color: 'grey'
            }}>{`{ ${Object.keys(children).length} }`}</span>}
          <Button
            icon={<EditOutlined />}
            size='small'
            onClick={() => { setIsEditModalVisible(true) && setEditingPath([...path, "properties", param]); }}
            style={{
              marginLeft: Boolean(obj[param]?.properties) ? '10px' : 'auto',
              color: 'grey',
              fontSize
            }}
            type="text"
          />
        </div>
      </Card >
      {isKeySelected && typeof obj[param] === "object" && children &&
        (<div style={{ position: "relative" }}>
          {Object.keys(children).map((internalKey, index) => (
            <>
              <KeyCard
                key={internalKey}
                setEditingPath={setEditingPath}
                obj={children}
                path={[...path, "properties", param]}
                param={internalKey}
                level={level + 1}
                setIsEditModalVisible={setIsEditModalVisible}
              />
              {index === Object.keys(children)?.length - 1 &&
                <Card
                  style={{
                    width: (97 - ((level + 1) * 10)) + '%',
                    height: (40 - ((level + 1) * 4)) + 'px',
                    marginTop: '15px',
                    marginLeft: (level * 40) + 'px',
                    borderRadius: '2px',
                    padding: '6px 12px 6px 12px',
                    background: '#fff',
                    boxShadow: 'none',
                    border: 'transparent',
                  }}
                  styles={{
                    body: {
                      padding: 0
                    },
                  }}
                >
                  <Button
                    icon={<PlusOutlined />}
                    size='small'
                    style={{
                      color: 'grey',
                      fontSize
                    }}
                    type="text"
                  />
                  <span style={{ margin: 0, marginLeft: '10px', fontSize, fontWeight: 300 }}>Add</span>
                </Card>
              }
            </>
          ))}
        </div >)
      }
    </div>
  )
}
