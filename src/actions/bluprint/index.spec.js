import { expect } from 'chai'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import enableDestroy from 'server-destroy'
import shmock from 'shmock'

import * as actionTypes from '../../constants/action-types'
import {
  deployBluprint,
  getBluprint,
  setBluprintConfigSchema,
  setBluprintSharedDevices,
  setOctobluLinks,
  updateBluprint,
} from './'

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

  describe('When the user is authenticated and owns the bluprint', () => {
    beforeEach(() => {
      meshbluMock.get('/v2/devices/my-bluprint-uuid')
      .set('Authorization', `Basic ${userAuth}`)
      .reply(200, {
        uuid: 'my-bluprint-uuid',
      })
    })

    const expectedActions = [
      { type: actionTypes.GET_BLUPRINT_REQUEST },
      {
        type: actionTypes.SET_OCTOBLU_LINKS,
        payload: 'my-bluprint-uuid',
      },
      {
        type: actionTypes.GET_BLUPRINT_SUCCESS,
        payload: {
          uuid: 'my-bluprint-uuid',
        }
      }]
    const store = mockStore({bluprint: {}})

    it('should dispatch GET_BLUPRINT_SUCCESS', () => {
      return store.dispatch(
        getBluprint('my-bluprint-uuid', meshbluConfig)
      ).then(() => {
        expect(store.getActions()).to.deep.equal(expectedActions)
      })
    })
  })

  describe('When getBluprint results in an error', () => {
    beforeEach(() => {
      meshbluMock
        .get('/v2/devices/my-bluprint-uuid')
        .set('Authorization', `Basic ${userAuth}`)
        .reply(403, 'Unauthorized')
    })

    const expectedActions = [
      { type: actionTypes.GET_BLUPRINT_REQUEST },
      {
        type: actionTypes.GET_BLUPRINT_FAILURE,
        payload: new Error('Error getting Bluprint device')
      },
    ]
    const store = mockStore({ bluprint: {}})

    it('should dispatch GET_BLUPRINT_FAILURE', () => {
      return store.dispatch(
        getBluprint('my-bluprint-uuid', meshbluConfig)
      ).catch(() => {
        expect(store.getActions()).to.deep.equal(expectedActions)
      })
    })
  })

  describe('when setBluprintConfigSchema is dispatched', () => {
    it('should dispatch SET_BLUPRINT_CONFIG_SCHEMA', () => {
      const expectedAction = {
        type: actionTypes.SET_BLUPRINT_CONFIG_SCHEMA,
        payload: { uuid: 'yuma' }
      }
      expect(setBluprintConfigSchema({ uuid: 'yuma' })).to.deep.equal(expectedAction)
    })
  })

  describe('when setBluprintSharedDevices is dispatched', () => {
    it('should dispatch SET_BLUPRINT_SHARED_DEVICES', () => {
      const expectedAction = {
        type: actionTypes.SET_BLUPRINT_SHARED_DEVICES,
        payload: { uuid: 'Lagos' }
      }

      expect(setBluprintSharedDevices({ uuid: 'Lagos' })).to.deep.equal(expectedAction)
    })
  })

  describe('when updateBluprint is dispatched with valid properties', () => {
    let updateBluprintHandler

    beforeEach((done) => {
      updateBluprintHandler = meshbluMock
      .put('/v2/devices/my-bluprint-uuid')
      .set('Authorization', `Basic ${userAuth}`)
      .send({
        $set: {
          'bluprint.sharedDevices': {},
          'bluprint.schemas.configure': {
            default: {}
          },
          'bluprint.schemas.message': {
            default: {}
          },
          'bluprint.versions': [{
            sharedDevices: [],
            schemas: {
              configure: {
                default: {}
              },
              message: {
                default: {}
              }
            }
          }],
        }
      })
      .reply(200, {})
      done()
    })

    const expectedActions = [
      { type: actionTypes.UPDATE_BLUPRINT_REQUEST},
      { type: actionTypes.DEPLOY_BLUPRINT_REQUEST},
      {
        type: actionTypes.UPDATE_BLUPRINT_SUCCESS,
      }
    ]

    const store = mockStore()

    it('should dispatch UPDATE_BLUPRINT_SUCCESS', () => {
      return store.dispatch(
        updateBluprint({
          device: {
            uuid: 'my-bluprint-uuid',
            bluprint: {
              version: '1.0.0', flowId: 'my-flow-uuid'
            },
          },
          configureSchema: {},
          messageSchema: {},
          sharedDevices: []
        }, meshbluConfig)
      ).then(() => {
        updateBluprintHandler.done()
        expect(store.getActions()).to.deep.equal(expectedActions)
      })
    })
  })

  describe('when setOctobluLinks is called', () => {
    it('should dispatch SET_OCTOBLU_LINKS', () => {
      const expectedAction = {
        type: actionTypes.SET_OCTOBLU_LINKS,
        payload: 'aaf-asdfas-asdfas'
      }
      expect(setOctobluLinks('aaf-asdfas-asdfas')).to.deep.equal(expectedAction)
    })
  })

  describe('when deployBluprint is called with valid bluprint', () => {
    let nanocyteFlowDeployMock
    let publishBluprintHandler
    const bluprint = {
      uuid: 'my-bluprint-uuid',
      bluprint: {
        version: '1.0.0',
        flowId: 'my-flow-uuid',
      }
    }
    const store = mockStore()

    before(() => {
      nanocyteFlowDeployMock = shmock(0xbaba)
      enableDestroy(nanocyteFlowDeployMock)
    })

    after((done) => {
      nanocyteFlowDeployMock.destroy(done)
    })

    beforeEach((done) => {
      publishBluprintHandler = nanocyteFlowDeployMock
      .post('/bluprint/my-bluprint-uuid/1.0.0')
      .set('Authorization', `Basic ${userAuth}`)
      .send({flowId: 'my-flow-uuid'})
      .reply(201, 'SUCCESS')
      done()
    })

    it('should try to hit the nanocyte flow deploy service publish endpoint', () => {
      const expectedActions = [
        { type: actionTypes.DEPLOY_BLUPRINT_REQUEST },
        { type: actionTypes.DEPLOY_BLUPRINT_SUCCESS },
      ]

      store.dispatch(
        deployBluprint(bluprint, `http://127.0.0.1/${0xbaba}`, meshbluConfig)
      ).then(() => {
        publishBluprintHandler.done()
        expect(store.getActions()).to.deep.equal(expectedActions)
      })
    })
  })

  describe('when deployBluprint is called and the deploy fails', () => {
    let nanocyteFlowDeployMock
    let publishBluprintHandler

    const bluprint = {
      uuid: 'my-bluprint-uuid',
      bluprint: {
        version: '1.0.0',
        flowId: 'my-flow-uuid',
      }
    }
    const store = mockStore()

    before(() => {
      nanocyteFlowDeployMock = shmock(0xc0c0)
      enableDestroy(nanocyteFlowDeployMock)
    })

    after((done) => {
      nanocyteFlowDeployMock.destroy(done)
    })

    beforeEach((done) => {
      publishBluprintHandler = nanocyteFlowDeployMock
      .post('/bluprint/my-bluprint-uuid/1.0.0')
      .set('Authorization', `Basic ${userAuth}`)
      .send({flowId: 'my-flow-uuid'})
      .reply(412, 'ERROR DEPLOYING FLOW')
      done()
    })

    it('should try to hit the nanocyte flow deploy service publish endpoint', () => {
      const expectedActions = [
        { type: actionTypes.DEPLOY_BLUPRINT_REQUEST },
        { type: actionTypes.DEPLOY_BLUPRINT_FAILURE,
          payload: new Error('Could not deploy Bluprint')
        },
      ]

      store.dispatch(
        deployBluprint(bluprint, `http://127.0.0.1/${0xc0c0}`, meshbluConfig)
      ).catch(() => {
        publishBluprintHandler.done()
        expect(store.getActions()).to.deep.equal(expectedActions)
      })
    })
  })
})
