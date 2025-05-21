import { useState } from 'react';
import { Row, Col, Card, } from 'antd'
import { EditKey } from './EditKey'
import { KeyCard } from './KeyCard'

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

const JsonEditor = ({ schema }) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [edittedSchema, updateSchema] = useState(schema)
  const [editingPath, setEditingPath] = useState([]);
  return (
    <div style={{ position: 'relative', height: '100vh', padding: '10vh 0 0 10vh' }}>
      <EditKey
        isVisible={isEditModalVisible}
        schema={edittedSchema}
        path={editingPath}
        onClose={() => { setIsEditModalVisible(false) }}
        onConfirm={(newKeyData) => {
          updateSchema({ ...newKeyData }); // Force re-render with updated schema
        }}
      />

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
            <pre>{addLineNumbersAndStringify(preRenderJson(edittedSchema))}</pre>
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
              {Object.keys(edittedSchema)
                .map(key => {
                  // return keyCard({ obj: JSON_OBJ, key: key, })
                  return <KeyCard
                    obj={edittedSchema}
                    setEditingPath={setEditingPath}
                    param={key}
                    setIsEditModalVisible={setIsEditModalVisible}
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
