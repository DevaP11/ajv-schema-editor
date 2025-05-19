import { useState } from 'react';
import { Row, Col, Card, Button } from 'antd'
import {
  DownSquareFilled, CloseOutlined, RightSquareFilled, BoldOutlined,
  FontSizeOutlined, FieldNumberOutlined, OrderedListOutlined, PlusOutlined
} from '@ant-design/icons'

const JSON_OBJ = {
  "ENLIGHT_FEED_RESPONSE_SCHEMA": {
    "additionalProperties": false,
    "type": "object",
    "properties": {
      "content": {
        "additionalProperties": false,
        "type": "array",
        "items": {
          "additionalProperties": false,
          "type": "object",
          "properties": {
            "uid": {
              "type": "string"
            },
            "streamUrl": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            "parentAssetId": {
              "type": "string"
            },
            "parentAssetType": {
              "type": "string"
            },
            "seasonUid": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            "title": {
              "type": "string"
            },
            "originalTitle": {
              "type": "string"
            },
            "description": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            "shortDescription": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            "episodeNumber": {
              "anyOf": [
                {
                  "type": "integer"
                },
                {
                  "type": "null"
                }
              ]
            },
            "releaseYear": {
              "anyOf": [
                {
                  "type": "integer"
                },
                {
                  "type": "null"
                }
              ]
            },
            "director": {
              "type": "array",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "properties": {
                  "personId": {
                    "type": "string"
                  },
                  "personName": {
                    "type": "string"
                  },
                  "creditType": {
                    "type": "string"
                  }
                },
                "required": []
              }
            },
            "actor": {
              "type": "array",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "properties": {
                  "personId": {
                    "type": "string"
                  },
                  "personName": {
                    "type": "string"
                  },
                  "creditType": {
                    "type": "string"
                  }
                },
                "required": []
              }
            },
            "genre": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "displayDuration": {
              "type": "number"
            },
            "progress": {
              "type": "number"
            },
            "showAlert": {
              "type": "boolean"
            },
            "duration": {
              "type": "number"
            },
            "type": {
              "type": "string"
            },
            "categoryId": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "streams": {
              "type": "string"
            },
            "seriesUid": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            "downloadUrl": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            "trailers": {
              "type": "array",
              "items": {
                "additionalProperties": false,
                "type": "object",
                "properties": {
                  "streams": {
                    "type": "string"
                  },
                  "mediaType": {
                    "type": "string",
                    "enum": [
                      "bonus",
                      "trailer"
                    ]
                  },
                  "name": {
                    "type": "string"
                  },
                  "images": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "additionalProperties": false,
                      "properties": {
                        "url": {
                          "type": "string"
                        },
                        "width": {
                          "type": "number"
                        },
                        "height": {
                          "type": "number"
                        },
                        "type": {
                          "type": "string"
                        }
                      },
                      "required": [
                        "url",
                        "width",
                        "height"
                      ]
                    }
                  }
                }
              }
            },
            "mediaGuid": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            "availableOn": {
              "anyOf": [
                {
                  "type": "integer"
                },
                {
                  "type": "null"
                }
              ]
            },
            "availableTill": {
              "anyOf": [
                {
                  "type": "integer"
                },
                {
                  "type": "null"
                }
              ]
            },
            "availableDays": {
              "anyOf": [
                {
                  "type": "integer"
                },
                {
                  "type": "null"
                }
              ]
            },
            "isCcAvailable": {
              "type": "boolean"
            },
            "checkSums": {
              "type": "object",
              "properties": {
                "type": "string"
              }
            },
            "streamingUrl": {
              "type": "string"
            },
            "format": {
              "type": "string"
            },
            "isDownloadable": {
              "type": "boolean"
            },
            "contentGuid": {
              "type": "string"
            },
            "parentalControl": {
              "type": "array",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "properties": {
                  "rating": {
                    "anyOf": [
                      {
                        "type": "string"
                      },
                      {
                        "type": "null"
                      }
                    ]
                  },
                  "ratingTag": {
                    "type": "array",
                    "items": {
                      "anyOf": [
                        {
                          "type": "string"
                        },
                        {
                          "type": "null"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "isCastable": {
              "type": "boolean"
            },
            "countries": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "images": {
              "type": "array",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "properties": {
                  "url": {
                    "type": "string"
                  },
                  "width": {
                    "type": "number"
                  },
                  "height": {
                    "type": "number"
                  },
                  "type": {
                    "type": "string"
                  }
                },
                "required": [
                  "url",
                  "width",
                  "height"
                ]
              }
            },
            "purchaseMode": {
              "type": "string"
            },
            "maxQualityAvailable": {
              "type": "string"
            },
            "studio": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "championship": {
              "type": "string"
            },
            "assetTypeIcon": {
              "type": "array",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "properties": {
                  "url": {
                    "type": "string"
                  },
                  "width": {
                    "type": "number"
                  },
                  "height": {
                    "type": "number"
                  },
                  "type": {
                    "type": "string"
                  }
                },
                "required": [
                  "url",
                  "width",
                  "height"
                ]
              }
            },
            "tags": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "displayTag": {
              "type": "string"
            },
            "mediatype": {
              "type": "string"
            }
          },
          "required": [
            "title",
            "uid"
          ]
        }
      },
      "totalElements": {
        "type": "integer"
      },
      "totalCount": {
        "type": "integer"
      },
      "totalPages": {
        "type": "integer"
      }
    },
    "required": [
      "content",
      "totalElements",
      "totalPages",
      "totalCount"
    ]
  }
}

const preRenderJson = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  // Check if this object has a "type" property that isn't "object"
  if (obj.type && obj.type === "array" && obj.items) {
    obj = [obj.items]
  }

  if (obj.anyOf && obj.anyOf?.map(item => item.type)?.filter(el => el !== 'null')?.length === 1) {
    return obj.anyOf?.map(item => item.type)?.filter(el => el !== 'null')[0]
  }

  // Check if this object has a "type" property that isn't "object"
  if (obj.type && ["integer", "number", "string", "boolean", "null"].includes(obj.type)) {
    return obj.enum || obj.type // Return the type value to replace the parent
  }

  if (obj.type && obj.type === "object" && obj.properties) {
    obj = obj.properties
  }


  // Process each property
  for (let key in obj) {
    if (obj[key] && typeof obj[key] === 'object') {
      // Replace the property with the result of recursive call
      obj[key] = preRenderJson(obj[key]);
    }
  }

  return obj;
}

const formatJsonCompact = (jsonObject) => {

  let json = JSON.stringify(jsonObject, (key, value) => {
    // Inline arrays with primitive types
    if (Array.isArray(value) && value.every(v => typeof v !== 'object')) {
      return `@@__INLINE__${JSON.stringify(value)}__@@`;;
    }
    return value;
  }, 2);

  json = json.replace(
    /"@@__INLINE__(.*?)__@@"/g,
    (_, arrayContent) => {
      const str = arrayContent
        ?.replace(/\\/g, '')
        ?.replaceAll('"', `'`)
      if (str?.length > 20) { return '[ ' + str?.split('[')?.[1]?.split(',')[0] + ', ... ' + str?.split(']')?.[0]?.split(',')[1] + ']' }
      return str
    }
  );
  return json
}

const getColorByValue = (value) => {
  if (value === '{' || value === '}') { return '#bc70bd' }
  if (
    value.includes('[') && value.includes(']') &&
    ['string', 'number', 'integer'].some(e => value?.includes(e))
  ) return '#FF85B3';
  if (value.includes('[') && value.includes(']')) return '#7fbfff';
  if (value.includes('[') || value.includes(']')) return '#bc70bd';
  if (value === 'integer') return '#7fc6a4';     // Teal for numbers
  if (value === 'number') return '#7fc6a4';     // Teal for numbers
  if (value === 'string') return '#e1c97b';     // Yellow for strings
  if (value === 'boolean') return '#6395EE';    // Light blue for booleans
  if (value === null) return '#ff9b9b';                // Pink for null
  return '#ffffff';                                   // Default
};

const highlightJsonLine = (line) => {
  const keyValueRegex = /^(\s*"[^"]+": )(.+?)([,|])?$/;
  const match = line.match(keyValueRegex);

  if (match) {
    const [, key, rawValue, comma] = match;
    let parsedValue;

    try {
      parsedValue = JSON.parse(rawValue);
    } catch {
      parsedValue = rawValue;
    }

    const color = getColorByValue(parsedValue);

    return (
      <>
        <span style={{ color: '#bc70bd' }}>{key}</span>
        <span style={{ color }}>{rawValue}</span>
        <span style={{ color: '#bc70bd' }}>{comma || ''}</span>
      </>
    );
  }

  return <span style={{ color: '#bc70bd' }}>{line}</span>;
};


const addLineNumbersAndStringify = (jsonObject) => {
  const formattedJson = formatJsonCompact(jsonObject);

  return formattedJson.split('\n').map((line, index) => (
    <div key={index} style={{ whiteSpace: 'pre' }}>
      <span style={{ color: '#462d71', userSelect: 'none', marginRight: 18 }}>
        {String(index + 1).padStart(2, ' ')}
      </span>
      {highlightJsonLine(line)}
    </div>
  ));
};


function KeyCard(props) {
  const { obj, param, level = 0 } = props
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
            icon={<CloseOutlined />}
            size='small'
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
                obj={children}
                param={internalKey}
                level={level + 1}
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


const JsonEditor = () => {
  return (
    <div style={{ position: 'relative', height: '100vh', padding: '10vh 0 0 10vh' }}>
      <Row >
        <Col>
          <Card
            style={{
              overflow: 'auto',
              maxHeight: '80vh',
              minHeight: '80vh',
              width: '45vw',
              fontSize: 12,
              backgroundColor: 'rgba(44,20,83,255)',
              borderColor: 'rgba(44,20,83,255)',
              boxShadow: '0 14px 20px rgba(0,0,0,0.3)',
              position: 'relative',
              zIndex: 1,
              borderRadius: '12px'
            }}>
            <span style={{ fontSize: 14, color: '#fff', marginLeft: '10px', fontWeight: 500 }}>View JSON</span>
            {  /**
            HTML Pre Tag -
            Pre Tag stands for preformatted text. It displays the text exactly as it was written in HTML code.  */}
            <pre>{addLineNumbersAndStringify(preRenderJson(JSON.parse(JSON.stringify(JSON_OBJ))))}</pre>
          </Card>
        </Col>
        <Col>
          <Card
            style={{
              overflow: 'auto',
              maxHeight: '80vh',
              height: '80vh',
              width: '45vw',
              position: 'absolute',       // Position this card absolutely
              right: '-38vw',               // Move it over the first card
              zIndex: 2,                  // On top of the first card
              boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
              borderRadius: '12px'
            }}
          >
            <span style={{ fontWeight: 500 }}>Edit JSON</span>
            <>
              {Object.keys(JSON_OBJ)
                .map(key => {
                  // return keyCard({ obj: JSON_OBJ, key: key, })
                  return <KeyCard
                    obj={JSON_OBJ}
                    param={key}
                  />
                })}
            </>
          </Card>
        </Col>
      </Row>
    </div >
  )
}

export default JsonEditor;
