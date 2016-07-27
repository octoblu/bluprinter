import _ from 'lodash'
import {push} from 'react-router-redux'

const initialState = {
  steps: null,
}

export function setBreadcrumbs(breadcrumbs) {
  return {
    type: 'SET_BREADCRUMBS',
    payload: breadcrumbs
  }
}

export function setActiveBreadcrumb(breadcrumb) {
  return {
    type: 'SET_ACTIVE_BREADCRUMB',
    payload: breadcrumb
  }
}

export function goToBreadcrumb(path, breadcrumb) {
  return dispatch => {
    const rootPath = _.initial(path.split('/')).join('/')
    dispatch(push(`${rootPath}/${breadcrumb}`))
  }
}


const reducer = {
  SET_BREADCRUMBS: function(state, payload) {
    return {...state, steps: payload}
  },

  SET_ACTIVE_BREADCRUMB: function(state, payload) {
    let foundStep = false
    const newSteps = _.map(state.steps, (step) => {
      if (step.label === payload) {
        foundStep = true
        return { ...step, state: 'ACTIVE' }
      }

      let newStep = { label: step.label }
      if(!foundStep) newStep.state = 'DONE'

      return newStep
    })

    return { ...state, steps: newSteps}
  }

}

export default function types(state = initialState, action) {
  if(!reducer[action.type]) return state

  return reducer[action.type](state, action.payload)
}
