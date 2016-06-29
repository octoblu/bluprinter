import chai, { expect } from 'chai'
import chaiSubset from 'chai-subset'
import FlowService from './flow-service'
import deviceWithSchema from '../../test/data/device-with-schema.json'
import shmock from 'shmock'
import enableDestroy from 'server-destroy'

chai.use(chaiSubset)

describe('FlowService', function() {
  let flowService
  let meshbluMock
  beforeEach(function() {
    meshbluMock = shmock(0xDEAD)
    enableDestroy(meshbluMock)

    flowService = new FlowService({
      uuid: 'my-meshblu-uuid',
      token: 'my-meshblu-token',
      hostname: '127.0.0.1',
      port: 0xDEAD,
    })
  })
  afterEach( function(done) {
    meshbluMock.destroy(done)
  })

  describe('->addGlobalMessageReceivePermissions', function() {
    describe('when given a list of device uuids', function() {
      let firstDeviceHandler
      let secondDeviceHandler
      let sharedDevices
      beforeEach( function(done) {
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

      it('should actually try to update both devices dangerously', function() {
        expect(firstDeviceHandler.done())
        expect(secondDeviceHandler.done())
      })
    })
  })

  describe('->removeGlobalMessageReceivePermissions', function() {
    describe('when given a list of device uuids', function() {
      let firstDeviceHandler
      let secondDeviceHandler
      let sharedDevices
      beforeEach( function(done) {
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

      it('should actually try to update both devices dangerously', function() {
        expect(firstDeviceHandler.done())
        expect(secondDeviceHandler.done())
      })
    })
  })

  describe('->updatePermissions', function() {
    describe('when called', function() {
      beforeEach( function(done) {
        const schema = {
          type: 'object',
          properties: {
            erik: {
              type: 'string',
              format: 'meshblu-device'
            }
          }
        }

        const appData = {
          erik: 'n00b'
        }

        const update = {
          $addToSet: { sendWhitelist: ['n00b'] }
        }

        this.updateDeviceHandler =
          meshbluMock.put('/v2/devices/the-uuid').send(update).reply(200)
        flowService.updatePermissions({uuid: 'the-uuid', appData, schema}, done)
      })

      it('should update the IoT device\'s sendWhitelist', function() {
        this.updateDeviceHandler.done()
      })

      it('should update the n00b device\'s receiveWhitelist', function() {

      })

    })
  })

})
