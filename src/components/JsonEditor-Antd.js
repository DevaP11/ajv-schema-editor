import { useState } from 'react';
import { Row, Col, Card, Button } from 'antd'
import { DownSquareFilled, CloseOutlined, RightSquareFilled, FileTextOutlined } from '@ant-design/icons'

const JSON_OBJ = {
  "ENLIGHT_FEED_REQUEST_SCHEMA": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "origin": {
        "type": "string",
        "enum": [
          "vcms",
          "enhance"
        ]
      },
      "language": {
        "type": "string"
      },
      "size": {
        "type": "string"
      },
      "page": {
        "type": "string"
      },
      "imageRatios": {
        "type": "string"
      },
      "maxParentalRatings": {
        "type": "string",
        "enum": [
          "G",
          "PG",
          "13+",
          "16+",
          "18+",
          "PG13",
          "NC16",
          "M18",
          "R21",
          "U",
          "P12",
          "13",
          "16",
          "18"
        ]
      },
      "region": {
        "type": "string"
      }
    },
    "required": [
      "origin",
      "region",
      "maxParentalRatings"
    ]
  }
}

const preRenderJson = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  // Check if this object has a "type" property that isn't "object"
  if (obj.type && obj.type !== "object") {
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
  if (value.includes('[') && value.includes(']')) return '#7fbfff';     // Teal for array
  if (typeof value === 'string') return '#e1c97b';     // Yellow for strings
  if (typeof value === 'number') return '#7fc6a4';     // Teal for numbers
  if (typeof value === 'boolean') return '#7fbfff';    // Light blue for booleans
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
  const { obj, param } = props
  const [isKeySelected, setIsKeySelected] = useState(false)
  if (!obj[param]) {
    console.log({ param, obj })
    return (<></>)
  }

  let icon
  if (obj[param].type === "object") {
    icon = (
      <Button
        icon={isKeySelected ? <DownSquareFilled /> : <RightSquareFilled />}
        size='small'
        onClick={() => { setIsKeySelected(!isKeySelected) }}
        style={{ color: 'grey', fontSize: 12 }}
        type="text"
      />
    )
  } else if (obj[param].type === "string") {
    icon = (
      <Button
        icon={<FileTextOutlined />}
        size='small'
        style={{ color: 'grey', fontSize: 12 }}
        type="text"
      />
    )
  } else {
    icon = (<></>)
  }

  return (
    <>
      <Card
        style={{
          width: '97%',
          height: '5.5vh',
          marginTop: '20px',
          borderRadius: '2px',
          padding: '8px 12px',
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
          {icon}
          <span style={{ margin: 0, marginLeft: '10px', fontSize: 14, fontWeight: 300 }}>{param}</span>
          {obj[param]?.properties &&
            <span style={{
              marginLeft: 'auto',
              marginBottom: '2px',
              fontSize: 14,
              color: 'grey'
            }}>{`{ ${Object.keys(obj[param].properties).length} }`}</span>}
          <Button
            icon={<CloseOutlined />}
            size='small'
            style={{
              marginLeft: Boolean(obj[param]?.properties) ? '10px' : 'auto',
              color: 'grey',
              fontSize: 14
            }}
            type="text"
          />
        </div>
      </Card>
      {isKeySelected &&
        typeof (obj[param]) === "object"
        && Object.keys(obj[param].properties)
          .map(internalKey => {
            return <KeyCard obj={obj[param].properties} param={internalKey} />
          })}
    </>
  )
}

const JsonEditor = () => {
  return (
    <div style={{ position: 'relative', height: '100vh', padding: '10vh 0 0 10vh' }}>
      <Row >
        <Col>
          <Card
            style={{
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
