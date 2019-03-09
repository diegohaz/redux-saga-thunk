import {
  isThunkAction,
  isThunkRequestAction,
  isCleanAction,
  getThunkName,
  hasId,
  getThunkId,
} from './utils'
import { PENDING, REJECTED, FULFILLED, DONE, initialState } from './selectors'

const transformSubstate = (substate, path, value) => {
  const name = path[0]
  let newValue = value

  if (path.length === 2) {
    const id = path[1]

    if (!value) {
      if (typeof substate[name] === 'object') {
        newValue = { ...substate[name] }
        delete newValue[id] 
      }
    } else {
      newValue = { ...substate[name], [id]: true }
    }

    if (Object.keys(newValue).length === 0) {
      newValue = false
    }
  }

  return {
    ...substate,
    [name]: newValue,
  }
}

const omit = (substate, path) => {
  const name = path[0]

  if (path.length === 1) {
    const newState = { ...substate }
    delete newState[name]
    return newState
  }

  if (typeof substate[name] !== 'object') {
    return substate
  }

  return transformSubstate(substate, path, false)
}

const cleanState = (state, path) => ({
  ...state,
  [PENDING]: omit(state[PENDING], path),
  [REJECTED]: omit(state[REJECTED], path),
  [FULFILLED]: omit(state[FULFILLED], path),
  [DONE]: omit(state[DONE], path),
})

const transformState = (state, path, pending, rejected, fulfilled, done) => ({
  ...state,
  [PENDING]: transformSubstate(state[PENDING], path, pending),
  [REJECTED]: transformSubstate(state[REJECTED], path, rejected),
  [FULFILLED]: transformSubstate(state[FULFILLED], path, fulfilled),
  [DONE]: transformSubstate(state[DONE], path, done),
})

export default (state = initialState, action) => {
  if (!isThunkAction(action)) return state
  const name = getThunkName(action)
  const path = hasId(action) ? [name, getThunkId(action)] : [name]

  if (isCleanAction(action)) return cleanState(state, path)

  if (isThunkRequestAction(action)) {
    return transformState(state, path, true, false, false, false)
  } else if (action.error) {
    return transformState(state, path, false, true, false, true)
  }
  return transformState(state, path, false, false, true, true)
}
