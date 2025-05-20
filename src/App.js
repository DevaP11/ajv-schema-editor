import logo from './logo.svg';
import './App.css';
// import JSONEditor from './components/JsonEditor'
import JSONEditor from './components/JsonEditor-Antd'

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

function App() {
  return (
    <JSONEditor schema={JSON_OBJ} />
  );
}

export default App;
