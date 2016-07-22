import superagent from 'superagent'
import MeshbluHttp from 'browser-meshblu-http'
import { OCTOBLU_URL } from 'config'
import { getMeshbluConfig } from './auth-service'
import Promise, { using } from 'bluebird'


export default class BluprintService {
  constructor(meshbluConfig = getMeshbluConfig()) {
    this.meshbluConfig = meshbluConfig
    this.meshblu = new MeshbluHttp(meshbluConfig)
  }
  getBluprints = (callback) => {
    const {uuid} = this.meshbluConfig
    this.meshblu.search({query: {owner: uuid, type: 'bluprint'}, projection: {name, uuid}}, callback)
  }
}
