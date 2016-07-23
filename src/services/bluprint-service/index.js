import _ from 'lodash'
import MeshbluHttp from 'browser-meshblu-http'
import { getMeshbluConfig } from '../auth-service'

export const getLatestConfigSchema = ({latest, versions}) => {
  if (_.isEmpty(latest)) return null
  if (_.isEmpty(versions)) return null

  const latestVersion = _.find(versions, { version: latest })

  if (_.isEmpty(latestVersion)) return null

  return latestVersion.schemas.configure.default
}

export const getBluprints = (callback) => {
  const meshbluConfig = getMeshbluConfig()
  const meshblu = new MeshbluHttp(meshbluConfig)
  const {uuid} = this.meshbluConfig
  meshblu.search({query: {owner: uuid, type: 'bluprint'}, projection: {name, uuid}}, callback)
}
