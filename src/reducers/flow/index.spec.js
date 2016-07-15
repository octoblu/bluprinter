import chai, { expect } from 'chai'
import * as actionTypes from '../../constants/action-types'

import reducer from './'

describe.only('Flow Reducer', () => {
  const initialState = {
    error: null,
    fetching: false,
    flowDevice: null,
  }

  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState)
  })

  it('should update state when action.type is GET_FLOW_REQUEST', () => {
    expect(
      reducer(null, { type: actionTypes.GET_FLOW_REQUEST })
    ).to.deep.equal({ ...initialState, fetching: true})
  })

  it('should set the flowDevice on state when action.type is GET_FLOW_SUCCESS', () => {
    const flowDevice = {
      uuid: 'my-flow-uuid',
      nodes: [
        {
          name: 'My Trigger Node',
          type: 'operation:trigger',
        }
      ]
    }

    expect(reducer(null, {
      type: actionTypes.GET_FLOW_SUCCESS,
      payload: flowDevice
    })).to.deep.equal({...initialState, flowDevice })
  })

  it('should set the error on state when action.type is GET_FLOW_FAILURE', () => {
    expect(reducer(null, {
      type: actionTypes.GET_FLOW_FAILURE,
      payload: new Error('Bang!')
    })).to.deep.equal({...initialState, error: new Error('Bang!') })
  })
})
