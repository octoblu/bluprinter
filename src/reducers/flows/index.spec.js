import { expect } from 'chai'
import * as actionTypes from '../../constants/action-types'

import reducer from './'

describe('Flows Reducer', () => {
  const initialState = {
    devices: null,
    error: null,
    selected: null,
    fetching: false,
  }

  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState)
  })

  it('should handle GET_FLOWS_REQUEST', () => {
    expect(
      reducer(undefined, { type: actionTypes.GET_FLOWS_REQUEST })
    ).to.deep.equal({ ...initialState, fetching: true})
  })

  it('should handle GET_FLOWS_SUCCESS', () => {
    const devices = [{
      uuid: 'my-flows-uuid',
    },
    {
      uuid: 'my-flows2-uuid',
    }]

    expect(reducer(undefined, {
      type: actionTypes.GET_FLOWS_SUCCESS,
      payload: devices
    })).to.deep.equal({...initialState, devices })
  })

  it('should handle GET_FLOWS_FAILURE', () => {
    expect(reducer(undefined, {
      type: actionTypes.GET_FLOWS_FAILURE,
      payload: new Error('Bang!')
    })).to.deep.equal({...initialState, error: new Error('Bang!') })
  })
})
