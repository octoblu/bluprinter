import { expect } from 'chai'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import enableDestroy from 'server-destroy'
import shmock from 'shmock'

import reducer, {
  getSharedDevices,
  updateSharedDevicesPermissions,
  GET_SHARED_DEVICES_SUCCESS,
  GET_SHARED_DEVICES_REQUEST,
  GET_SHARED_DEVICES_FAILURE,
  UPDATE_SHARED_DEVICES_PERMISSIONS_REQUEST,
  UPDATE_SHARED_DEVICES_PERMISSIONS_SUCCESS,
} from './SharedDevices'


const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('SharedDevices', () => {
  let meshbluMock
  let meshbluConfig
  let userAuth

  before(() => {
    meshbluConfig = {
      hostname: '127.0.0.1',
      port: 0xdada,
      protocol: 'http',
      uuid: 'my-user-uuid',
      token: 'my-user-token',
    }
    userAuth = new Buffer('my-user-uuid:my-user-token').toString('base64')
    meshbluMock = shmock(0xdada)

    enableDestroy(meshbluMock)
  })


  after((done) => {
    meshbluMock.destroy(done)
  })

  describe('->getSharedDevices Action', () => {
    let searchDeviceHandler
    const sharedDevices = ['device-1-uuid', 'device-2-uuid']
    const sharedDevicesResult = [
      {
        uuid: 'device-1-uuid',
        type: 'device:first',
        name: 'Device 1',
      },
      {
        uuid: 'device-2-uuid',
        type: 'device:second',
        name: 'Device 2',
      }
    ]

    beforeEach((done) => {
      searchDeviceHandler = meshbluMock.post('/search/devices')
      .send({
        uuid: {
          $in: sharedDevices
        }
      })
      .reply(200, sharedDevicesResult)
      done()
    })

    const expectedActions = [
      { type: GET_SHARED_DEVICES_REQUEST },
      {
        type: GET_SHARED_DEVICES_SUCCESS,
        payload: sharedDevicesResult,
      },
    ]
    const store = mockStore({sharedDevices: {}})

    it('search for the list of devices in meshblu', (done) => {
      return store.dispatch(
        getSharedDevices(sharedDevices, meshbluConfig)
      ).then(() => {
        searchDeviceHandler.done()
        expect(store.getActions()).to.deep.equal(expectedActions)
        done()
      })
    })
  })
  describe('->updateSharedDevicesPermissions', () => {
    describe('when given a list of device uuids', function () {
      let firstDeviceHandler
      let secondDeviceHandler
      const store = mockStore({})

      beforeEach(function (done) {
        meshbluMock.post('/search/devices')
          .send({
            uuid: {
              $in: ['device-1-uuid', 'device-2-uuid']
            },
            'meshblu.version': '2.0.0'
          })
          .reply(200, [{uuid: 'device-1-uuid'}, {uuid: 'device-2-uuid'}])


        firstDeviceHandler = meshbluMock.put('/v2/devices/device-1-uuid')
          .send({
            $addToSet: {
              'meshblu.whitelists.message.from': {uuid: '*'},
              'meshblu.whitelists.broadcast.sent': {uuid: '*'}
            }
          })
          .set('Authorization', `Basic ${userAuth}`)
          .reply(200, [{uuid: 'device-1-uuid'}])

        secondDeviceHandler = meshbluMock.put('/v2/devices/device-2-uuid')
          .send({
            $addToSet: {
              sendWhitelist: '*',
              receiveWhitelist: '*'
            }
          })
          .set('Authorization', `Basic ${userAuth}`)
          .reply(200, [{uuid: 'device-2-uuid'}])
        done()
      })

      it('should actually try to update both devices dangerously', function () {
        const expectedActions = [
          { type: UPDATE_SHARED_DEVICES_PERMISSIONS_REQUEST },
          {
            type: UPDATE_SHARED_DEVICES_PERMISSIONS_SUCCESS
          },
        ]
        store.dispatch(
          updateSharedDevicesPermissions(['device-1-uuid', 'device-2-uuid'], meshbluConfig)
        ).then(() => {
          firstDeviceHandler.done()
          secondDeviceHandler.done()
          expect(store.getActions()).to.deep.equal(expectedActions)
        })
        .catch(() => {
          return
        })
      })
    })
  })

  describe('->reducer', () => {
    const initialState = {
      error: null,
      fetching: false,
      devices: null,
    }
    it('should set the fetching flag on the state on SHARED_DEVICES_REQUEST', () => {
      expect(
        reducer(undefined,
          {
            type: GET_SHARED_DEVICES_REQUEST,
            payload: new Error('Could not get shared devices')
          })
      ).to.deep.equal({ ...initialState, fetching: true })
    })

    it('should set error on the state on SHARED_DEVICES_FAILURE', () => {
      expect(
        reducer(undefined,
          {
            type: GET_SHARED_DEVICES_FAILURE,
            payload: new Error('Could not get shared devices')
          })
      ).to.deep.equal({ ...initialState, error: new Error('Could not get shared devices')})
    })
    it('should set devices on the state on SHARED_DEVICES_SUCCESS', () => {
      const sharedDevices = [{uuid: 'my-device-uuid', type: 'device:one', name: 'Device One'}]
      expect(
        reducer(undefined,
          {
            type: GET_SHARED_DEVICES_SUCCESS,
            payload: sharedDevices
          })
      ).to.deep.equal({ ...initialState, devices: sharedDevices})
    })
  })
})
