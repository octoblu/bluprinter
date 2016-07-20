import { expect } from 'chai'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import enableDestroy from 'server-destroy'
import shmock from 'shmock'

import * as actionTypes from '../../constants/action-types'
import { makeFlowDiscoverable } from './'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Bluprint Actions', () => {
  let meshbluMock
  let meshbluConfig
  let userAuth

  before(() => {
    meshbluConfig = {
      hostname: '127.0.0.1',
      port: 0xd00d,
      protocol: 'http',
      uuid: 'my-user-uuid',
      token: 'my-user-token',
    }
    userAuth = new Buffer('my-user-uuid:my-user-token').toString('base64')
    meshbluMock = shmock(0xd00d)

    enableDestroy(meshbluMock)
  })


  after((done) => {
    meshbluMock.destroy(done)
  })

  describe('->makeFlowDiscoverable', () => {
    describe('when given a valid flow and bluprint', () => {
      beforeEach(() => {
        meshbluMock.put('/v2/devices/my-flow-uuid')
        .set('Authorization', `Basic ${userAuth}`)
        .send({
          $addToSet: {
            discoverWhitelist: 'my-bluprint-uuid'
          }
        })
        .reply(200, 'SUCCESS')
      })
      const expectedActions = [
        { type: actionTypes.MAKE_FLOW_DISCOVERABLE_REQUEST },
        {
          type: actionTypes.MAKE_FLOW_DISCOVERABLE_SUCCESS,
        }]
      const store = mockStore({bluprint: {}})
      it('should make a request to meshblu to add the bluprint to the flows discoverWhitelist', () => {
        return store.dispatch(
          makeFlowDiscoverable({flowUuid: 'my-flow-uuid', bluprintUuid: 'my-bluprint-uuid'}, meshbluConfig)
        ).then(() => {
          expect(store.getActions()).to.deep.equal(expectedActions)
        })
      })
    })
    describe('when given an invalid flow Id and bluprint', () => {
      beforeEach(() => {
        meshbluMock.put('/v2/devices/my-flow-uuid')
        .set('Authorization', `Basic ${userAuth}`)
        .send({
          $addToSet: {
            discoverWhitelist: 'my-bluprint-uuid'
          }
        })
        .reply(403, 'FORBIDDEN')
      })
      const expectedActions = [
        { type: actionTypes.MAKE_FLOW_DISCOVERABLE_REQUEST },
        {
          type: actionTypes.MAKE_FLOW_DISCOVERABLE_FAILURE,
          payload: new Error('Could not update flow discover permissions')
        }]
      const store = mockStore({bluprint: {}})
      it('should make a request to meshblu to add the bluprint to the flows discoverWhitelist', () => {
        return store.dispatch(
          makeFlowDiscoverable({flowUuid: 'my-flow-uuid', bluprintUuid: 'my-bluprint-uuid'}, meshbluConfig)
        ).catch(() => {
          expect(store.getActions()).to.deep.equal(expectedActions)
        })
      })
    })
  })
})
