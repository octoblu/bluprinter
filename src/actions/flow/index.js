import * as actionTypes from '../../constants/action-types'
import { getMeshbluConfig } from '../../services/auth-service'
import FlowService          from '../../services/flow-service'
import { setDeviceSchemas, setMessageSchema } from '../../actions/schemas'


function getFlowRequest() {
  return {
    type: actionTypes.GET_FLOW_REQUEST
  }
}

function getFlowSuccess(flowDevice) {
  return {
    type: actionTypes.GET_FLOW_SUCCESS,
    payload: flowDevice,
  }
}

function getFlowFailure(error) {
  return {
    type: actionTypes.GET_FLOW_FAILURE,
    payload: error,
  }
}

export function getFlow(flowUuid, meshbluConfig = getMeshbluConfig()) {
  return dispatch => {
    dispatch(getFlowRequest())

    return new Promise((resolve, reject) => {
      const flowService = new FlowService(meshbluConfig)

      flowService.getFlowDevice(flowUuid, (error, flowDevice) => {
        if (error) {
          return reject(dispatch(getFlowFailure(new Error('Could not get Flow device'))))
        }

        dispatch(setDeviceSchemas(flowDevice))
        dispatch(setMessageSchema(flowDevice))
        return resolve(dispatch(getFlowSuccess(flowDevice)))
      })
    })
  }
}
