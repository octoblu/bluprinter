import shmock from 'shmock'
import chai, { expect } from 'chai'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import enableDestroy from 'server-destroy'

import { getFlow } from './'
import * as actionTypes from '../../constants/action-types'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Flow Actions', () => {
  let meshbluMock
  let meshbluConfig
  let userAuth

  before(() => {
    meshbluMock = shmock(0xd00d)
    enableDestroy(meshbluMock)
    meshbluConfig = {
      hostname: '127.0.0.1',
      port: 0xd00d,
      protocol: 'http',
      uuid: 'my-user-uuid',
      token: 'my-user-token',
    }
    userAuth = new Buffer('my-user-uuid:my-user-token').toString('base64')
  })


  after((done) => {
    meshbluMock.destroy(done)
  })

  describe('When the user is authenticated and owns the flow', () => {
    beforeEach(() => {
      meshbluMock
      .get('/v2/devices/my-flow-uuid')
      .set('Authorization', `Basic ${userAuth}`)
      .reply(200, {
        uuid: 'my-flow-uuid',
        draft: { nodes: [] }
      })
    })

    const flowDevice = {
      uuid: 'my-flow-uuid',
      draft: { nodes: [] }
    }
    const expectedActions = [
      { type: actionTypes.GET_FLOW_REQUEST },
      { type: actionTypes.SET_DEVICE_SCHEMAS_REQUEST },
      { type: actionTypes.SET_MESSAGE_SCHEMA,
        payload: flowDevice,
      },
      {
        type: actionTypes.GET_FLOW_SUCCESS,
        payload: flowDevice,
      },
    ]
    const store = mockStore({ flow: {}})

    it('should dispatch GET_FLOW_SUCCESS', () => {
      return store.dispatch(
        getFlow('my-flow-uuid', meshbluConfig)
      ).then(() => {
        expect(store.getActions()).to.deep.equal(expectedActions)
      })
    })
  })

  describe('When getFlow results in an error', () => {
    beforeEach(() => {
      meshbluMock
      .get('/v2/devices/my-flow-uuid')
      .set('Authorization', `Basic ${userAuth}`)
      .reply(403, 'Unauthorized')
    })

    const expectedActions = [
      { type: actionTypes.GET_FLOW_REQUEST },
      {
        type: actionTypes.GET_FLOW_FAILURE,
        payload: new Error('Could not get Flow device')
      },
    ]
    const store = mockStore({ flow: {}})

    it('should dispatch GET_FLOW_FAILURE', () => {
      return store.dispatch(
        getFlow('my-flow-uuid', meshbluConfig)
      ).catch(() => {
        expect(store.getActions()).to.deep.equal(expectedActions)
      })
    })
  })
})
