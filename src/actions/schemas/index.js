import MeshbluHttp from 'browser-meshblu-http'
import $RefParser from 'json-schema-ref-parser'
import _ from 'lodash'
import superagent from 'superagent'

import * as actionTypes from '../../constants/action-types'
import { getMeshbluConfig } from '../../services/auth-service'

function getOperationSchemasRequest() {
  return {
    type: actionTypes.GET_OPERATION_SCHEMAS_REQUEST
  }
}

function getOperationSchemasSuccess(schemas) {
  return {
    type: actionTypes.GET_OPERATION_SCHEMAS_SUCCESS,
    payload: schemas,
  }
}

function getOperationSchemasFailure(error) {
  return {
    type: actionTypes.GET_OPERATION_SCHEMAS_FAILURE,
    payload: error,
  }
}

export function getOperationSchemas(toolsSchemaRegistryUrl) {
  return dispatch => {
    dispatch(getOperationSchemasRequest())

    return new Promise((resolve, reject) => {
      superagent
        .get(toolsSchemaRegistryUrl)
        .end((error, response) => {
          if (error) {
            return reject(dispatch(getOperationSchemasFailure(
              new Error('Error fetching operation schemas')
            )))
          }
          return resolve(dispatch(getOperationSchemasSuccess(response.body)))
        })
    })
  }
}


const reduceSchemas = (result, value) => {
  const type = _.last(value.type.split(':'))

  if (value.schemas) {
    result[type] = value.schemas.message
  } else {
    result[type] = value.messageSchema
  }

  return result
}

function setDeviceSchemasRequest() {
  return {
    type: actionTypes.SET_DEVICE_SCHEMAS_REQUEST
  }
}

function setDeviceSchemasSuccess(schemas) {
  return {
    type: actionTypes.SET_DEVICE_SCHEMAS_SUCCESS,
    payload: schemas,
  }
}

function setDeviceSchemasFailure(error) {
  return {
    type: actionTypes.SET_DEVICE_SCHEMAS_FAILURE,
    payload: error,
  }
}

export function setDeviceSchemas(flowDevice, meshbluConfig = getMeshbluConfig()) {
  const { nodes } = flowDevice.draft
  const meshblu   = new MeshbluHttp(meshbluConfig)

  return dispatch => {
    dispatch(setDeviceSchemasRequest())

    const deviceUuids = _(nodes)
      .filter({category: 'device'})
      .uniqBy('type')
      .map('uuid')
      .value()

    return new Promise((resolve, reject) => {
      const search = {
        query: {
          uuid: {$in: deviceUuids}
        },
        projection: {type: true, 'schemas.message': true, messageSchema: true}
      }

      meshblu.search(search, (searchError, devices) => {
        if (searchError) return reject(dispatch(setDeviceSchemasFailure(searchError)))

        return $RefParser.dereference(devices, (error, resolvedSchemas) => {
          const schemaRegistry = _.reduce(resolvedSchemas, reduceSchemas, {})
          return resolve(dispatch(setDeviceSchemasSuccess(schemaRegistry)))
        })
      })
    })
  }
}


export function setMessageSchema(flowDevice) {
  return {
    type: actionTypes.SET_MESSAGE_SCHEMA,
    payload: flowDevice,
  }
}
