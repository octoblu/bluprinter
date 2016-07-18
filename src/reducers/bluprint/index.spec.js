import chai, { expect } from 'chai'
import * as actionTypes from '../../constants/action-types'

import reducer from './'

describe('Bluprint Reducer', () => {
  const initialState = {
    configSchema: null,
    creating: false,
    device: null,
    deviceSchemas: null,
    error: null,
    fetching: false,
    flowDevice: null,
    manifest: null,
    operationSchemas: null,
    sharedDevices: null,
  }

  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState)
  })

  it('should handle CREATE_BLUPRINT_REQUEST', () => {
    expect(
      reducer(undefined, { type: actionTypes.CREATE_BLUPRINT_REQUEST })
    ).to.deep.equal({ ...initialState, creating: true})
  })

  it('should handle CREATE_BLUPRINT_SUCCESS', () => {
    const device = {
      uuid: 'my-bluprint-uuid'
    }

    expect(reducer(undefined, {
      type: actionTypes.CREATE_BLUPRINT_SUCCESS,
      payload: device
    })).to.deep.equal({...initialState, device })
  })

  it('should handle CREATE_BLUPRINT_FAILURE', () => {
    expect(reducer(undefined, {
      type: actionTypes.CREATE_BLUPRINT_FAILURE,
      payload: new Error('Bang!')
    })).to.deep.equal({...initialState, error: new Error('Bang!') })
  })


  it('should handle GET_BLUPRINT_REQUEST', () => {
    expect(
      reducer(undefined, { type: actionTypes.GET_BLUPRINT_REQUEST })
    ).to.deep.equal({ ...initialState, fetching: true})
  })

  it('should handle GET_BLUPRINT_SUCCESS', () => {
    const device = {
      uuid: 'my-bluprint-uuid',
    }

    expect(reducer(undefined, {
      type: actionTypes.GET_BLUPRINT_SUCCESS,
      payload: device
    })).to.deep.equal({...initialState, device })
  })

  it('should handle GET_BLUPRINT_FAILURE', () => {
    expect(reducer(undefined, {
      type: actionTypes.GET_BLUPRINT_FAILURE,
      payload: new Error('Bang!')
    })).to.deep.equal({...initialState, error: new Error('Bang!') })
  })

  it('should handle SET_BLUPRINT_CONFIG_SCHEMA', () => {
    const configSchema = { uuid: 'Scottsdale'}
    expect(reducer(undefined, {
      type: actionTypes.SET_BLUPRINT_CONFIG_SCHEMA,
      payload: configSchema,
    })).to.deep.equal({ ...initialState, configSchema  })
  })
  
  it('should handle SET_BLUPRINT_SHARED_DEVICES', () => {
    const sharedDevices = ['device-1-uuid', 'device-2-uuid']
    expect(reducer(undefined, {
      type: actionTypes.SET_BLUPRINT_SHARED_DEVICES,
      payload: sharedDevices,
    })).to.deep.equal({ ...initialState, sharedDevices })
  })
})
