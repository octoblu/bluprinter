import chai, { expect } from 'chai'
import * as actionTypes from '../../constants/action-types'

import reducer from './'

describe('Schema Reducer', () => {
  const initialState = {
    operationSchemas: null,
  }

  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.deep.equal(initialState)
  })

  it('should handle GET_OPERATION_SCHEMAS_REQUEST', () => {
    expect(
      reducer(null, { type: actionTypes.GET_OPERATION_SCHEMAS_REQUEST })
    ).to.deep.equal({ ...initialState, fetching: true})
  })

  it('should handle GET_OPERATION_SCHEMAS_SUCCESS', () => {
    const operationSchemas = {
      uuid: 'my-uuid',
    }

    expect(reducer(null, {
      type: actionTypes.GET_OPERATION_SCHEMAS_SUCCESS,
      payload: operationSchemas
    })).to.deep.equal({...initialState, operationSchemas })
  })

  it('should handle GET_OPERATION_SCHEMAS_FAILURE', () => {
    expect(reducer(null, {
      type: actionTypes.GET_OPERATION_SCHEMAS_FAILURE,
      payload: new Error('Bang!')
    })).to.deep.equal({...initialState, error: new Error('Bang!') })
  })
})
