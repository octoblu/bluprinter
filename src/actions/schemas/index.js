import * as actionTypes from '../../constants/action-types'
import superagent from 'superagent'

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
          // if (error) {
          //   return reject(dispa)
          // }
          return resolve(dispatch(getOperationSchemasSuccess(response.body)))
        })
    })
  }
}
