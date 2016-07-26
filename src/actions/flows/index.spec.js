import { expect } from 'chai'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import enableDestroy from 'server-destroy'
import shmock from 'shmock'

import * as actionTypes from '../../constants/action-types'
import {getFlows} from './'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Bluprints Actions', () => {
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

  context('getFlows', () => {
    describe('When the user is authenticated and has flows', () => {
      beforeEach(() => {
        meshbluMock.post('/search/devices')
          .send({ type: 'octoblu:flow', owner: 'my-user-uuid'})
          .reply(200, [
            {uuid: 'flow-1-uuid'},
            {uuid: 'flow-2-uuid'}
          ])
      })

      const expectedActions = [
        { type: actionTypes.GET_FLOWS_REQUEST },
        { type: actionTypes.GET_FLOWS_SUCCESS, payload: [{uuid: 'flow-1-uuid'}, {uuid: 'flow-2-uuid'}] },
      ]

      const store = mockStore({flow: {}})

      it('should dispatch GET_FLOWS_SUCCESS', () => {
        return store.dispatch(
          getFlows(meshbluConfig)
        ).then(() => {
          expect(store.getActions()).to.deep.equal(expectedActions)
        })
      })
    })

    describe('When getFlows results in an error', () => {
      beforeEach(() => {
        meshbluMock
          .post('/search/devices')
          .set('Authorization', `Basic ${userAuth}`)
          .reply(403, 'Unauthorized')
      })

      const expectedActions = [
        { type: actionTypes.GET_FLOWS_REQUEST },
        {
          type: actionTypes.GET_FLOWS_FAILURE,
          payload: new Error('Error getting Bluprint device')
        },
      ]
      const store = mockStore({ flow: {}})

      it('should dispatch GET_FLOWS_FAILURE', () => {
        return store.dispatch(
          getFlows(meshbluConfig)
        ).catch(() => {
          expect(store.getActions()).to.deep.equal(expectedActions)
        })
      })
    })

  })
})
