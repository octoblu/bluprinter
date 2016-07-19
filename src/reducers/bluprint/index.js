import _ from 'lodash'
import * as actionTypes from '../../constants/action-types'

const initialState = {
  configureSchema: null,
  creating: false,
  device: null,
  deviceSchemas: null,
  error: null,
  fetching: false,
  flowDevice: null,
  manifest: null,
  messageSchema: null,
  operationSchemas: null,
  sharedDevices: null,
  updating: false,
}

const getMessageSchemaFromNodes = (nodes) => {
  const triggers = _.filter(nodes, { class: 'trigger' })

  const messageSchema = {
    type: 'object',
    properties: {
      metadata: {
        type: 'object',
        properties: {
          to: {
            type: 'object',
            properties: {
              nodeId: {
                type: 'string',
                title: 'Trigger',
                required: true,
                enum: _.map(triggers, 'id'),
                enumNames: _.map(triggers, (trigger) => trigger.name || trigger.id)
              }
            }
          }
        }
      },
      data: {
        title: 'data',
        type: 'string',
        description: 'Use {{msg}} to send the entire message'
      }
    }
  }

  return messageSchema
}


export default function types(state = initialState, action) {
  switch (action.type) {
    case actionTypes.CREATE_BLUPRINT_REQUEST:
      return { ...state, creating: true }

    case actionTypes.CREATE_BLUPRINT_SUCCESS:
      return { ...state, device: action.payload, creating: false }

    case actionTypes.CREATE_BLUPRINT_FAILURE:
      return { ...state, error: action.payload, creating: false }

    case actionTypes.GET_BLUPRINT_REQUEST:
      return { ...state, fetching: true }

    case actionTypes.GET_BLUPRINT_SUCCESS:
      return { ...state, device: action.payload, fetching: false }

    case actionTypes.GET_BLUPRINT_FAILURE:
      return { ...state, error: action.payload, fetching: false }

    case actionTypes.UPDATE_BLUPRINT_FAILURE:
      return { ...state, error: action.payload, updating: false }

    case actionTypes.UPDATE_BLUPRINT_REQUEST:
      return { ...state, updating: true }

    case actionTypes.UPDATE_BLUPRINT_SUCCESS:
      return { ...state, updating: false }

    case actionTypes.SET_BLUPRINT_CONFIG_SCHEMA:
      return { ...state, configureSchema: action.payload }

    case actionTypes.SET_BLUPRINT_SHARED_DEVICES:
      return { ...state, sharedDevices: action.payload }

    case actionTypes.SET_MESSAGE_SCHEMA: {
      const messageSchema = getMessageSchemaFromNodes(action.payload.draft.nodes)
      return { ...state, messageSchema }
    }

    default:
      return state
  }
}
