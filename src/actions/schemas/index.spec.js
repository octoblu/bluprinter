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
    mock = shmock(0xdead)
    enableDestroy(mock)
  })

  after((done)=>{
    mock.destroy(done)
  })

  describe('when fetching operation schemas is successful', () => {
    it('creates GET_OPERATION_SCHEMAS_SUCCESS', () => {
      mock
      .get('/tool-schema-registry/latest/schema-registry.json')
      .reply(200, { broadcast: {} })

      const expectedActions = [
        { type: actionTypes.GET_OPERATION_SCHEMAS_REQUEST },
        { type: actionTypes.GET_OPERATION_SCHEMAS_SUCCESS, payload: { broadcast: {} } }
      ]

      const store = mockStore()
      const toolsSchemaRegistryUrl = `http://127.0.0.1:${0xdead}/tool-schema-registry/latest/schema-registry.json`
      return store.dispatch(getOperationSchemas(toolsSchemaRegistryUrl))
        .then(() => { // return of async actions
          expect(store.getActions()).to.deep.equal(expectedActions)
        })
    })
  })
})
