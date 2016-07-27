import { expect } from 'chai'
import breadcrumbs, {setBreadcrumbs, setActiveBreadcrumb, goToBreadcrumb} from './'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Breadcrumbs:Actions', () => {
  it('should handle SET_BREADCRUMBS', () => {
    const steps =  [
      { label: 'Create a Bluprint', state: 'ACTIVE' },
      { label: 'Configure' },
      { label: 'Finish' },
    ]

    expect(setBreadcrumbs(steps)).to.deep.equal({
      type: 'SET_BREADCRUMBS',
      payload: steps
    })
  })

  it('should handle SET_ACTIVE_BREADCRUMB', () => {
    expect(setActiveBreadcrumb('foo'))
      .to.deep.equal({
        type: 'SET_ACTIVE_BREADCRUMB',
        payload: 'foo',
      })
  })

  it('should handle GO_TO_BREADCRUMB', () => {
    const store = mockStore({ routing: {}})
    store.dispatch(goToBreadcrumb('/one/two/seven', 'three'))
    expect(store.getActions()).to.deep.equal([
      {
        payload: {
          args: ["/one/two/three"],
          method: "push",
        },
        type: "@@router/CALL_HISTORY_METHOD"
      }
    ])
  })

})

describe('Breadcrumbs:Reducer', () => {
  it('should return the default state', () => {
    expect(
      breadcrumbs(undefined, {})
    ).to.deep.equal({ steps: null })
  })

  it('should handle "SET_BREADCRUMBS" action', () => {
    expect(
      breadcrumbs(undefined, {type: "SET_BREADCRUMBS", payload: []})
    ).to.deep.equal({ steps: [] })
  })

  it('should handle "SET_ACTIVE_BREADCRUMB" action for a step in the middle', () => {
    const steps =  [
      { label: 'Create a Bluprint', state: 'ACTIVE' },
      { label: 'Configure' },
      { label: 'Finish' },
    ]
    expect(
      breadcrumbs({steps}, {type: "SET_ACTIVE_BREADCRUMB", payload: 'Configure'})
    ).to.deep.equal({ steps: [
      { label: 'Create a Bluprint', state: 'DONE'},
      { label: 'Configure', state: 'ACTIVE' },
      { label: 'Finish'},
    ]})
  })
  it('should handle "SET_ACTIVE_BREADCRUMB" action', () => {
    const steps =  [
      { label: 'Create a Bluprint', state: 'ACTIVE' },
      { label: 'Configure' },
      { label: 'Finish' },
    ]
    expect(
      breadcrumbs({steps}, {type: "SET_ACTIVE_BREADCRUMB", payload: 'Finish'})
    ).to.deep.equal({ steps: [
      { label: 'Create a Bluprint', state: 'DONE'},
      { label: 'Configure', state: 'DONE' },
      { label: 'Finish', state: 'ACTIVE'},
    ]})
  })
})
