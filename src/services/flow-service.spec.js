import chai, { expect } from 'chai'
import chaiSubset from 'chai-subset'
import FlowService from './flow-service'
import deviceWithSchema from '../../test/data/device-with-schema.json'
import shmock from 'shmock'
import enableDestroy from 'server-destroy'

chai.use(chaiSubset)

describe('FlowService', () => {
  let flowService
  let meshbluMock
  beforeEach(() => {
    meshbluMock = shmock(0xDEAD)
    enableDestroy(meshbluMock)

    flowService = new FlowService({
      uuid: 'my-meshblu-uuid',
      token: 'my-meshblu-token',
      hostname: '127.0.0.1',
      port: 0xDEAD,
    })
  })
  afterEach((done) => {
    meshbluMock.destroy(done)
  })

  describe('->addGlobalMessageReceivePermissions', () => {
    describe('when given a list of device uuids', () => {
      let firstDeviceHandler
      let secondDeviceHandler
      let sharedDevices
      beforeEach((done) => {
        const  userAuth = new Buffer('my-meshblu-uuid:my-meshblu-token').toString('base64')
        sharedDevices = ['device-1-uuid', 'device-2-uuid']
        firstDeviceHandler = meshbluMock.put('/v2/devices/device-1-uuid', {
          $addToSet: {
            'meshblu.whitelists.message.from': [{uuid: '*'}]
          }
        }).set('Authorization', `Basic ${userAuth}`)
        .reply(200, deviceWithSchema)

        secondDeviceHandler = meshbluMock.put('/v2/devices/device-2-uuid', {
          $addToSet: {
            'meshblu.whitelists.message.from': [{uuid: '*'}]
          }
        }).set('Authorization', `Basic ${userAuth}`)
        .reply(200, deviceWithSchema)
        flowService.addGlobalMessageReceivePermissions(sharedDevices, done)
      })

      it('should actually try to update both devices dangerously', () => {
        expect(firstDeviceHandler.done())
        expect(secondDeviceHandler.done())
      })
    })
  })

  describe('->removeGlobalMessageReceivePermissions', () => {
    describe('when given a list of device uuids', () => {
      let firstDeviceHandler
      let secondDeviceHandler
      let sharedDevices
      beforeEach((done) => {
        const  userAuth = new Buffer('my-meshblu-uuid:my-meshblu-token').toString('base64')
        sharedDevices = ['device-1-uuid', 'device-2-uuid']
        firstDeviceHandler = meshbluMock.put('/v2/devices/device-1-uuid', {
          $addToSet: {
            'meshblu.whitelists.message.from': [{uuid: '*'}]
          }
        }).set('Authorization', `Basic ${userAuth}`)
        .reply(200, deviceWithSchema)

        secondDeviceHandler = meshbluMock.put('/v2/devices/device-2-uuid', {
          $pull: {
            'meshblu.whitelists.message.from': [{uuid: '*'}]
          }
        }).set('Authorization', `Basic ${userAuth}`)
        .reply(200, deviceWithSchema)
        flowService.addGlobalMessageReceivePermissions(sharedDevices, done)
      })

      it('should actually try to update both devices dangerously', () => {
        expect(firstDeviceHandler.done())
        expect(secondDeviceHandler.done())
      })
    })
  })

})
