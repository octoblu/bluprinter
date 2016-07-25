import { expect } from 'chai'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import enableDestroy from 'server-destroy'
import shmock from 'shmock'

import * as actionTypes from '../../constants/action-types'
import {getBluprints, selectBluprint} from './'

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

  context('selectBluprint', () => {
    describe('When called with a bluprint', () => {
      const bluprint = {uuid: '5', name: 'Da Bluprint', description: 'whatevs'}

      it('should dispatch SELECT_BLUPRINT', () => {
        const store = mockStore({bluprint: {}})
        store.dispatch(selectBluprint(bluprint))
        expect(store.getActions()).to.deep.contain({type: actionTypes.SELECT_BLUPRINT, payload: bluprint})
        
    })
  })
})
  context('getBluprints', () => {
    describe('When the user is authenticated and has bluprints', () => {
      beforeEach(() => {
        meshbluMock.post('/search/devices')
          .send({ type: 'bluprint', owner: 'my-user-uuid'})
          .reply(200, [
            {uuid: 'bluprint-1-uuid'},
            {uuid: 'bluprint-2-uuid'}
          ])
      })

      const expectedActions = [
        { type: actionTypes.GET_BLUPRINTS_REQUEST },
        { type: actionTypes.GET_BLUPRINTS_SUCCESS, payload: [{uuid: 'bluprint-1-uuid'}, {uuid: 'bluprint-2-uuid'}] },
      ]
      const store = mockStore({bluprint: {}})

      it('should dispatch GET_BLUPRINTS_SUCCESS', () => {
        return store.dispatch(
          getBluprints(meshbluConfig)
        ).then(() => {
          expect(store.getActions()).to.deep.equal(expectedActions)
        })
      })
    })

    describe('When getBluprints results in an error', () => {
      beforeEach(() => {
        meshbluMock
          .get('/v2/devices/my-bluprint-uuid')
          .set('Authorization', `Basic ${userAuth}`)
          .reply(403, 'Unauthorized')
      })

      const expectedActions = [
        { type: actionTypes.GET_BLUPRINTS_REQUEST },
        {
          type: actionTypes.GET_BLUPRINTS_FAILURE,
          payload: new Error('Error getting Bluprint device')
        },
      ]
      const store = mockStore({ bluprint: {}})

      it('should dispatch GET_BLUPRINTS_FAILURE', () => {
        return store.dispatch(
          getBluprints(meshbluConfig)
        ).catch(() => {
          expect(store.getActions()).to.deep.equal(expectedActions)
        })
      })
    })

  })
})
