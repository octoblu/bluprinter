import { expect } from 'chai'
import * as actionTypes from '../../constants/action-types'
import { BLUPRINTER_URL } from 'config'

import reducer from './'

describe('Bluprints Reducer', () => {
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


  it('should handle GET_BLUPRINTS_REQUEST', () => {
    expect(
      reducer(undefined, { type: actionTypes.GET_BLUPRINTS_REQUEST })
    ).to.deep.equal({ ...initialState, fetching: true})
  })

  it('should handle SELECT_BLUPRINT', () => {
    const bluprint = {uuid: '5', name: 'Da Bluprint'}
    expect(
      reducer(undefined, { type: actionTypes.SELECT_BLUPRINT, payload: bluprint})
    ).to.deep.equal({ ...initialState, selected: bluprint})
  })

  it('should handle GET_BLUPRINTS_SUCCESS', () => {
    const devices = [{
      uuid: 'my-bluprint-uuid',
    },
    {
      uuid: 'my-bluprint2-uuid',
    }]

    expect(reducer(undefined, {
      type: actionTypes.GET_BLUPRINTS_SUCCESS,
      payload: devices
    })).to.deep.equal({...initialState, devices })
  })

  it('should handle GET_BLUPRINTS_FAILURE', () => {
    expect(reducer(undefined, {
      type: actionTypes.GET_BLUPRINTS_FAILURE,
      payload: new Error('Bang!')
    })).to.deep.equal({...initialState, error: new Error('Bang!') })
  })
})
