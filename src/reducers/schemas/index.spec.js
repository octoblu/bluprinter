import { expect } from 'chai'
import * as actionTypes from '../../constants/action-types'

import reducer from './'

describe('Schema Reducer', () => {
  const initialState = {
    deviceSchemas: null,
    operationSchemas: null,
    fetchingOperationSchemas: false,
    fetchingDeviceSchemas: false,
  }

  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState)
  })

  it('should handle GET_OPERATION_SCHEMAS_REQUEST', () => {
    expect(
      reducer(undefined, { type: actionTypes.GET_OPERATION_SCHEMAS_REQUEST })
    ).to.deep.equal({ ...initialState, fetchingOperationSchemas: true })
  })

  it('should handle GET_OPERATION_SCHEMAS_SUCCESS', () => {
    const operationSchemas = {
      uuid: 'my-uuid',
    }

    expect(reducer(undefined, {
      type: actionTypes.GET_OPERATION_SCHEMAS_SUCCESS,
      payload: operationSchemas
    })).to.deep.equal({...initialState, operationSchemas })
  })

  it('should handle GET_OPERATION_SCHEMAS_FAILURE', () => {
    expect(reducer(undefined, {
      type: actionTypes.GET_OPERATION_SCHEMAS_FAILURE,
      payload: new Error('Bang!')
    })).to.deep.equal({...initialState, error: new Error('Bang!') })
  })

  it('should handle SET_DEVICE_SCHEMAS_REQUEST', () => {
    expect(
      reducer(undefined, { type: actionTypes.SET_DEVICE_SCHEMAS_REQUEST })
    ).to.deep.equal({ ...initialState, fetchingDeviceSchemas: true })
  })

  it('should handle SET_DEVICE_SCHEMAS_SUCCESS', () => {
    const deviceSchemas = {
      uuid: 'my-uuid',
    }

    expect(reducer(undefined, {
      type: actionTypes.SET_DEVICE_SCHEMAS_SUCCESS,
      payload: deviceSchemas
    })).to.deep.equal({...initialState, deviceSchemas })
  })

  it('should handle SET_DEVICE_SCHEMAS_FAILURE', () => {
    expect(reducer(undefined, {
      type: actionTypes.SET_DEVICE_SCHEMAS_FAILURE,
      payload: new Error('Bang!')
    })).to.deep.equal({...initialState, error: new Error('Bang!') })
  })
})
