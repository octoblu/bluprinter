import _ from 'lodash'
import superagent from 'superagent'
import { getMeshbluConfig } from './auth-service'
import { OCTOBLU_URL } from 'config'
import Promise from 'bluebird'

export default class NodeService {
  constructor(meshbluConfig = getMeshbluConfig()) {
    this.meshbluConfig = meshbluConfig
    this._setDefaultOptions = this._setDefaultOptions.bind(this)
  }

  _setDefaultOptions(nodeType) {
    return new Promise((resolve, reject) => {
      superagent
      .get(`${OCTOBLU_URL}/api/${nodeType}`)
      .set('Accept', 'application/json')
      .set('meshblu_auth_uuid', this.meshbluConfig.uuid)
      .set('meshblu_auth_token', this.meshbluConfig.token)
      .end((err, res) => {
        if (err) reject(err)
        resolve(JSON.parse(res.text))
      })
    })
  }

  getOperators = () => {
    return this._setDefaultOptions('operations')
  }

  getThings = () => {
    return this._setDefaultOptions('node_types')
  }

  getAllTypes() {
    const types = {}
    return this.getOperators().then((operators) => types.operators = operators)
      .then(this.getThings)
      .then((nodeTypes) => types.nodeTypes = nodeTypes)
      .then(() => types)
  }

  getDocUrl(node) {
    const { type, category } = node
    let nodeType = {}
    if (category === 'operation') return _.find(this.types.operators, {type})
    nodeType = _.find(this.types.nodeTypes, {type})
    if (nodeType === undefined) return {documentation: ""}
    return nodeType
  }

  createManifest(nodes) {
    return new Promise((resolve, reject) => {
      this.getAllTypes().then((types) => {
        this.types = types
        var manifest = _.compact( _.map(nodes, (node) => {
            let {name, id, type, deviceId, eventType, category} = node
            eventType = eventType || 'message'
            const nodeType = this.getDocUrl(node)
            const {documentation} = nodeType
            return {name, id, type, documentation, deviceId, category, eventType}
        }))
        resolve(manifest)
      })
    })
  }
}
