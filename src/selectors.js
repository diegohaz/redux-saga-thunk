import find from 'lodash/find'
import pick from 'lodash/pick'

export const PENDING = 'PENDING'
export const SUCCESS = 'SUCCESS'
export const FAILURE = 'FAILURE'

export const initialState = {
  [PENDING]: {},
  [FAILURE]: {},
}

const getIn = (state, name) => {
  if (typeof name === 'undefined') {
    return !!find(state, value => !!value)
  } else if (Array.isArray(name)) {
    return !!find(pick(state, name), value => !!value)
  } else if (Object.prototype.hasOwnProperty.call(state, name)) {
    return !!state[name]
  }
  return false
}

export const getPendingState = (state = initialState) => state[PENDING] || {}
export const getFailureState = (state = initialState) => state[FAILURE] || {}

export const isPending = (state, name) => getIn(getPendingState(state), name)
export const hasFailed = (state, name) => getIn(getFailureState(state), name)

