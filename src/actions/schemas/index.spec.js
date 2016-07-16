import shmock from 'shmock'
import chai, { expect } from 'chai'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import enableDestroy from 'server-destroy'

import { getOperationSchemas } from './'
import * as actionTypes from '../../constants/action-types'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Schemas Actions', () => {
  let mock

  before(() => {
    mock = shmock(0xdaad)
    enableDestroy(mock)
  })

  after((done) => {
    mock.destroy(done)
  })

  describe('when fetching operation schemas is successful', () => {
    beforeEach(() => {
      mock
      .get('/tool-schema-registry/latest/schema-registry.json')
      .reply(200, { broadcast: {} })
    })
    it('creates GET_OPERATION_SCHEMAS_SUCCESS', () => {
      mock
      .get('/tool-schema-registry/latest/schema-registry.json')
      .reply(200, { broadcast: {} })

      const expectedActions = [
        { type: actionTypes.GET_OPERATION_SCHEMAS_REQUEST},
        { type: actionTypes.GET_OPERATION_SCHEMAS_SUCCESS, payload: { broadcast: {} } }
      ]

      const store = mockStore()
      const toolsSchemaRegistryUrl = `http://127.0.0.1:${0xdaad}/tool-schema-registry/latest/schema-registry.json`
      return store.dispatch(getOperationSchemas(toolsSchemaRegistryUrl))
        .then(() => { // return of async actions
          expect(store.getActions()).to.deep.equal(expectedActions)
        })
    })
  })

  describe('when fetching operation schemas fails', () => {
    beforeEach((done) => {
      mock
      .get('/tool-schema-registry/latest/schema-registry.json')
      .reply(404, 'Not found')
      done()
    })

    it('creates GET_OPERATION_SCHEMAS_FAILURE', () => {
      const expectedActions = [
        { type: actionTypes.GET_OPERATION_SCHEMAS_REQUEST },
        {
          type: actionTypes.GET_OPERATION_SCHEMAS_FAILURE,
          payload: new Error('Error fetching operation schemas')
        }
      ]

      const store = mockStore()
      const toolsSchemaRegistryUrl = `http://127.0.0.1:${0xdaad}/tool-schema-registry/latest/schema-registry.json`
      return store.dispatch(getOperationSchemas(toolsSchemaRegistryUrl))
        .catch(() => { // return of async actions
          expect(store.getActions()).to.deep.equal(expectedActions)
        })
    })
  })
})
