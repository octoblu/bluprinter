import chai, { expect } from 'chai'
import * as actionTypes from '../../constants/action-types'

import reducer from './'

describe('Flow Reducer', () => {
  const initialState = {
    error: null,
    fetching: false,
    device: null,
  }

  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState)
  })

  it('should handle GET_FLOW_REQUEST', () => {
    expect(
      reducer(null, { type: actionTypes.GET_FLOW_REQUEST })
    ).to.deep.equal({ ...initialState, fetching: true})
  })

  it('should handle GET_FLOW_SUCCESS', () => {
    const device = {
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
      payload: device
    })).to.deep.equal({...initialState, device })
  })

  it('should handle GET_FLOW_FAILURE', () => {
    expect(reducer(null, {
      type: actionTypes.GET_FLOW_FAILURE,
      payload: new Error('Bang!')
    })).to.deep.equal({...initialState, error: new Error('Bang!') })
  })
})
