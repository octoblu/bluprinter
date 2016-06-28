import chai, { expect } from 'chai'
import chaiSubset from 'chai-subset'
import { MESHBLU_HOST } from 'config'
import FlowService from './flow-service'
import deviceWithSchema from '../../test/data/device-with-schema.json'
import shmock from 'shmock'
import enableDestroy from 'server-destroy'

chai.use(chaiSubset)

describe('FlowService', () => {
  let flowService, meshbluMock
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

  describe('->updateDevicePermissions', () => {

    describe('when given a list of device uuids', () => {
      let firstDeviceHandler, secondDeviceHandler, sharedDevices, callback
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
        flowService.updateDevicePermissions(sharedDevices, done)
      })

      it('should actually try to update both devices dangerously', () => {
        expect(firstDeviceHandler.done())
        expect(secondDeviceHandler.done())
      })
    })
  })
  
  xdescribe('->getNodeSchemaMap', () => {
    it('should exist', () => {
      expect(flowService.getNodeSchemaMap).to.exist
    })

    context('When given a Flow with a device node', () => {
      let scope
      const flow = {
        uuid: 'something-fly',
        nodes: [
          {
            uuid: 'my-iot-device-uuid',
            category: 'device',
            type: 'device:generic',
            staticMessage: {
              optionA: 'stuff I like',
              optionB: 'stuff I don\'t like',
            },
          },
        ],
      }

      beforeEach((done) => {
        scope = nock(`https://${MESHBLU_HOST}`, {allowUnmocked: true})
        .get('/v2/devices/my-iot-device-uuid')
        .basicAuth({
          user: 'my-meshblu-uuid',
          pass: 'my-meshblu-token',
        })
        .reply(200, deviceWithSchema)
        done()
      })

      it('should add the device message schema to the outgoing map', (done) => {
        const sut = flowService.getNodeSchemaMap(flow)
        expect(scope.isDone()).to.equal(true)
        expect(sut).to.containSubset({
          uuid: 'my-iot-device-uuid',
          schemas: {
            message: deviceWithSchema.schemas.message,
          },
        })
        done()
      })
    })
  })
})
