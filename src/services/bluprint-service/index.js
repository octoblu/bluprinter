import _ from 'lodash'
import MeshbluHttp from 'browser-meshblu-http'
import { getMeshbluConfig } from '../auth-service'

export const getBluprints = (callback) => {
  const meshbluConfig = getMeshbluConfig()
  const meshblu = new MeshbluHttp(meshbluConfig)
  const {uuid} = this.meshbluConfig
  meshblu.search({query: {owner: uuid, type: 'bluprint'}, projection: {name, uuid}}, callback)
}
