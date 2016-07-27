import _ from 'lodash'
import * as actionTypes from '../../constants/action-types'
import {BLUPRINTER_URL} from 'config'

const initialState = {
  configureSchema: null,
  creating: false,
  deploying: false,
  device: null,
  deviceSchemas: null,
  error: null,
  fetching: false,
  flowDevice: null,
  manifest: null,
  messageSchema: null,
  octobluLinks: null,
  operationSchemas: null,
  settingManifest: false,
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

    case actionTypes.DEPLOY_BLUPRINT_REQUEST:
      return { ...state, deploying: true }

    case actionTypes.DEPLOY_BLUPRINT_SUCCESS:
      return { ...state, deploying: false }

    case actionTypes.DEPLOY_BLUPRINT_FAILURE:
      return { ...state, error: action.payload, deploying: false }

    case actionTypes.GET_BLUPRINT_REQUEST:
      return { ...state, fetching: true }

    case actionTypes.GET_BLUPRINT_SUCCESS:
      return { ...state, device: action.payload, fetching: false }

    case actionTypes.GET_BLUPRINT_FAILURE:
      return { ...state, error: action.payload, fetching: false }

    case actionTypes.UPDATE_BLUPRINT_REQUEST:
      return { ...state, updating: true }

    case actionTypes.UPDATE_BLUPRINT_SUCCESS:
      return { ...state, updating: false }

    case actionTypes.UPDATE_BLUPRINT_FAILURE:
      return { ...state, error: action.payload, updating: false }

    case actionTypes.SET_BLUPRINT_MANIFEST_REQUEST:
      return { ...state, settingManifest: true }

    case actionTypes.SET_BLUPRINT_MANIFEST_SUCCESS:
      return { ...state, manifest: action.payload, settingManifest: false }

    case actionTypes.SET_BLUPRINT_MANIFEST_FAILURE:
      return { ...state, error: action.payload, settingManifest: false }

    case actionTypes.SET_BLUPRINT_CONFIG_SCHEMA:
      return { ...state, configureSchema: action.payload }

    case actionTypes.SET_BLUPRINT_SHARED_DEVICES:
      return { ...state, sharedDevices: action.payload }

    case actionTypes.SET_MESSAGE_SCHEMA: {
      const messageSchema = getMessageSchemaFromNodes(action.payload.draft.nodes)
      return { ...state, messageSchema }
    }

    case actionTypes.SET_OCTOBLU_LINKS: {
      const octobluLinks = {
        links: [          
          {
            title: 'Import',
            url: `${BLUPRINTER_URL}/bluprints/${action.payload}/import`,
          },
          {
            title: 'Update',
            url: `${BLUPRINTER_URL}/bluprints/${action.payload}/update`,
          },
          {
            title: 'Detail',
            url: `${BLUPRINTER_URL}/bluprints/${action.payload}`,
          },
        ],
      }
      return { ...state, octobluLinks }
    }

    default:
      return state
  }
}
