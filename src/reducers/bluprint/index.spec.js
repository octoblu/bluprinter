import { expect } from 'chai'
import * as actionTypes from '../../constants/action-types'
import { BLUPRINTER_URL } from 'config'

import reducer from './'

describe('Bluprint Reducer', () => {
  const initialState = {
    configureSchema: null,
    creating: false,
    deploying: false,
    device: null,
    deviceSchemas: null,
    error: null,
    fetching: false,
    flowDevice: null,
    manifest: null,
    messageSchema: null,
    octobluLinks: null,
    operationSchemas: null,
    sharedDevices: null,
    updating: false,
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

  it('should handle UPDATE_BLUPRINT_REQUEST', () => {
    expect(
      reducer(undefined, { type: actionTypes.UPDATE_BLUPRINT_REQUEST })
    ).to.deep.equal({
      ...initialState,
      updating: true,
    })
  })

  it('should handle UPDATE_BLUPRINT_SUCCESS', () => {
    expect(
      reducer({ ...initialState, updating: true }, { type: actionTypes.UPDATE_BLUPRINT_SUCCESS })
    ).to.deep.equal({
      ...initialState,
      updating: false,
    })
  })

  it('should handle UPDATE_BLUPRINT_FAILURE', () => {
    expect(
      reducer({ ...initialState, updating: true }, {
        type: actionTypes.UPDATE_BLUPRINT_FAILURE,
        payload: new Error('Error updating Bluprint')
      })
    ).to.deep.equal({
      ...initialState,
      error: new Error('Error updating Bluprint'),
      updating: false,
    })
  })


  it('should handle DEPLOY_BLUPRINT_REQUEST', () => {
    expect(
      reducer(undefined, { type: actionTypes.DEPLOY_BLUPRINT_REQUEST })
    ).to.deep.equal({
      ...initialState,
      deploying: true,
    })
  })

  it('should handle DEPLOY_BLUPRINT_SUCCESS', () => {
    expect(
      reducer({ ...initialState, deploying: true }, { type: actionTypes.DEPLOY_BLUPRINT_SUCCESS })
    ).to.deep.equal({
      ...initialState,
      deploying: false,
    })
  })

  it('should handle DEPLOY_BLUPRINT_FAILURE', () => {
    expect(
      reducer({ ...initialState, deploying: true }, {
        type: actionTypes.DEPLOY_BLUPRINT_FAILURE,
        payload: new Error('Error deploying Bluprint')
      })
    ).to.deep.equal({
      ...initialState,
      error: new Error('Error deploying Bluprint'),
      deploying: false,
    })
  })

  it('should handle SET_BLUPRINT_CONFIG_SCHEMA', () => {
    const configureSchema = { uuid: 'Scottsdale'}
    expect(reducer(undefined, {
      type: actionTypes.SET_BLUPRINT_CONFIG_SCHEMA,
      payload: configureSchema,
    })).to.deep.equal({ ...initialState, configureSchema  })
  })

  it('should handle SET_BLUPRINT_SHARED_DEVICES', () => {
    const sharedDevices = ['device-1-uuid', 'device-2-uuid']
    expect(reducer(undefined, {
      type: actionTypes.SET_BLUPRINT_SHARED_DEVICES,
      payload: sharedDevices,
    })).to.deep.equal({ ...initialState, sharedDevices })
  })

  it('should handle SET_MESSAGE_SCHEMA', () => {
    const flowDevice = {
      uuid: 'my-flow-uuid',
      draft: {
        nodes: []
      }
    }

    const defaultMessageSchema = {
      properties: {
        data: {
          description: 'Use {{msg}} to send the entire message',
          title: 'data',
          type: 'string',
        },
        metadata: {
          properties: {
            to: {
              properties: {
                nodeId: {
                  enum: [],
                  enumNames: [],
                  required: true,
                  title: 'Trigger',
                  type: 'string',
                }
              },
              type: 'object',
            },
          },
          type: 'object',
        },
      },
      type: 'object',
    }

    expect(reducer(undefined, {
      type: actionTypes.SET_MESSAGE_SCHEMA,
      payload: flowDevice,
    })).to.deep.equal({...initialState, messageSchema: defaultMessageSchema })
  })

  it('should handle SET_OCTOBLU_LINKS', () => {
    const octobluLinks =  {
      links: [
        {
          title: 'Bluprint Detail',
          url: `${BLUPRINTER_URL}/bluprints/my-fancy-bluprint-uuid`,
        },
        {
          title: 'Import Bluprint',
          url: `${BLUPRINTER_URL}/bluprints/my-fancy-bluprint-uuid/import`,
        },
      ],
    }
    expect(reducer(undefined, {
      type: actionTypes.SET_OCTOBLU_LINKS,
      payload: 'my-fancy-bluprint-uuid',
    })).to.deep.equal({ ...initialState, octobluLinks })
  })
})
