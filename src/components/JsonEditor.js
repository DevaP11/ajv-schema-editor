import { useState } from 'react';

const JsonEditor = () => {
  const [jsonText, setJsonText] = useState(`{
  "merge_config": {
    "rule_1": {
      "type": "join",
      "left": 423,
      "join_config": {
        "join_1": {
          "right": "join",
          "on": [2,3,5,3],
          "how": true
        }
      },
      "join_config": {
        "join_1": {
          "right": "join",
          "on": [2,3,5,3],
          "how": true
        }
      },
      "join_2": {
        "right": "join",
        "on": [2,3,5,3],
        "how": true
      }
    },
    "join_config": {
      "join_1": {
        "right": "join",
        "on": [2,3,5,3],
        "how": true
      }
    }
  }
}`);

  const [selectedItem, setSelectedItem] = useState(null);
  const [expandedKeys, setExpandedKeys] = useState({
    'merge_config': true,
    'merge_config.rule_1': true,
    'merge_config.rule_1.join_config': true,
    'merge_config.join_config': true,
    'merge_config.rule_1.join_2': true
  });

  const typeColors = {
    string: '#8BC34A',
    number: '#2196F3',
    boolean: '#FF9800',
    object: '#9E9E9E',
    array: '#9C27B0'
  };

  const renderLineNumbers = () => {
    const lines = jsonText.split('\n');
    return (
      <div style={{
        color: '#6c7280',
        textAlign: 'right',
        paddingRight: '10px',
        userSelect: 'none'
      }}>
        {lines.map((_, i) => (
          <div key={i} style={{ height: '20px', fontSize: '12px' }}>{i + 1}</div>
        ))}
      </div>
    );
  };

  const getTypeLabel = (type) => {
    return (
      <span style={{
        backgroundColor: typeColors[type] || '#9E9E9E',
        color: 'white',
        padding: '1px 6px',
        borderRadius: '4px',
        fontSize: '10px',
        marginRight: '8px'
      }}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  const renderTreeItem = (key, value, path, depth = 0) => {
    const type = Array.isArray(value) ? 'array' : typeof value;
    const isObject = type === 'object' && value !== null;
    const pathKey = path ? `${path}.${key}` : key;
    const isExpanded = isObject && expandedKeys[pathKey];

    return (
      <div key={pathKey} style={{ paddingLeft: `${depth * 20}px` }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '28px',
            cursor: 'pointer',
            backgroundColor: selectedItem === pathKey ? '#f0f0f0' : 'transparent',
            borderRadius: '4px'
          }}
          onClick={() => setSelectedItem(pathKey)}
        >
          {isObject && (
            <span
              style={{ marginRight: '4px', color: '#9E9E9E', width: '16px', textAlign: 'center' }}
              onClick={(e) => {
                e.stopPropagation();
                setExpandedKeys({ ...expandedKeys, [pathKey]: !isExpanded });
              }}
            >
              {isExpanded ? '▾' : '▸'}
            </span>
          )}

          <span style={{
            color: '#565656',
            backgroundColor: '#f1f1f1',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '12px',
            marginRight: '8px'
          }}>
            {key}
          </span>

          {!isObject && (
            <>
              {getTypeLabel(type)}
              <span style={{
                color: type === 'string' ? '#2e7d32' :
                  type === 'number' ? '#1976d2' :
                    type === 'boolean' ? '#ed6c02' : '#000000',
                fontWeight: type === 'boolean' ? '600' : 'normal'
              }}>
                {type === 'string' ? `"${value}"` :
                  type === 'array' ? JSON.stringify(value) : String(value)}
              </span>
            </>
          )}

          {isObject && (
            <>
              <span style={{ color: '#9E9E9E', fontSize: '12px' }}>
                [{Object.keys(value).length}]
              </span>
              <span className="delete-btn" style={{
                marginLeft: 'auto',
                visibility: 'hidden',
                color: '#9E9E9E',
                padding: '0 8px'
              }}>×</span>
            </>
          )}
        </div>

        {isObject && isExpanded && Object.entries(value).map(([k, v]) =>
          renderTreeItem(k, v, pathKey, depth + 1)
        )}
      </div>
    );
  };

  const renderTypeSelector = () => {
    return (
      <div style={{
        position: 'absolute',
        backgroundColor: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        borderRadius: '4px',
        padding: '6px 0',
        right: '40px',
        top: '580px',
        zIndex: 100
      }}>
        {Object.entries(typeColors).map(([type, color]) => (
          <div key={type} style={{
            padding: '6px 16px',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            color: '#333'
          }}>
            <span style={{
              backgroundColor: color,
              width: '12px',
              height: '12px',
              display: 'inline-block',
              borderRadius: '2px',
              marginRight: '8px'
            }}></span>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '600px',
      maxWidth: '1100px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#e0e5f7',
      padding: '20px',
      borderRadius: '16px',
      boxSizing: 'border-box',
    }}>
      <div style={{
        display: 'flex',
        height: '100%',
        gap: '16px',
      }}>
        {/* Left panel - Code editor */}
        <div style={{
          flex: 1,
          backgroundColor: '#1e1e3f',
          color: '#fff',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{ padding: '12px 16px', fontWeight: 'bold' }}>Edit JSON</div>
          <div style={{
            display: 'flex',
            height: 'calc(100% - 44px)',
            overflow: 'auto'
          }}>
            {renderLineNumbers()}
            <pre
              style={{
                margin: 0,
                padding: '0 10px',
                fontFamily: 'monospace',
                fontSize: '12px',
                flex: 1,
                overflow: 'auto'
              }}
            >
              <code dangerouslySetInnerHTML={{
                __html: jsonText
                  .replace(/"([^"]+)":/g, '<span style="color: #ff79c6;">"$1"</span>:')
                  .replace(/: (\d+)/g, ': <span style="color: #bd93f9;">$1</span>')
                  .replace(/: "(.*?)"/g, ': <span style="color: #50fa7b;">"$1"</span>')
                  .replace(/: (true|false)/g, ': <span style="color: #ffb86c;">$1</span>')
                  .replace(/\[(.*?)\]/g, (match) => {
                    return match.replace(/\d+/g, '<span style="color: #bd93f9;">$&</span>');
                  })
              }} />
            </pre>
          </div>
        </div>

        {/* Right panel - Visual editor */}
        <div style={{
          flex: 1,
          backgroundColor: '#fff',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{ padding: '12px 16px', fontWeight: 'bold', borderBottom: '1px solid #eee' }}>Edit JSON</div>
          <div style={{
            height: 'calc(100% - 44px)',
            overflow: 'auto',
            padding: '8px'
          }}>
            {renderTreeItem('merge_config', JSON.parse(jsonText).merge_config, '')}

            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '24px',
              padding: '8px',
              borderTop: '1px solid #eee'
            }}>
              <span style={{ color: '#9E9E9E', fontSize: '14px', marginRight: '4px' }}>+</span>
              <span style={{ color: '#9E9E9E', fontSize: '14px' }}>ADD</span>
            </div>
          </div>
        </div>
      </div>

      {/* New field input area */}
      <div style={{
        position: 'relative',
        marginTop: '-90px',
        marginLeft: 'calc(50% + 16px)',
        backgroundColor: 'white',
        borderRadius: '4px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        padding: '8px',
        display: 'flex',
        alignItems: 'center',
        width: '380px',
        zIndex: 10,
      }}>
        <input
          type="text"
          placeholder="Name"
          style={{
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '6px 12px',
            fontSize: '14px',
            flex: 1,
            marginRight: '8px'
          }}
        />
        <div style={{
          backgroundColor: '#e8f5e9',
          color: '#2e7d32',
          padding: '6px 12px',
          borderRadius: '4px',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          marginRight: '8px',
          cursor: 'pointer'
        }}>
          {getTypeLabel('string')} String
        </div>
        <input
          type="text"
          placeholder="Value"
          style={{
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '6px 12px',
            fontSize: '14px',
            flex: 1,
            marginRight: '8px'
          }}
        />
        <button style={{
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '6px 12px',
          cursor: 'pointer'
        }}>✓</button>
        <button style={{
          backgroundColor: 'transparent',
          color: '#9E9E9E',
          border: 'none',
          padding: '6px 8px',
          cursor: 'pointer'
        }}>×</button>
      </div>

      {renderTypeSelector()}
    </div>
  );
};

export default JsonEditor;
