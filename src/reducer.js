import { isThunkAction, isThunkRequestAction, getThunkName, hasId, getThunkId } from './utils'
import { PENDING, REJECTED, FULFILLED, DONE, initialState } from './selectors'

const transformSubstate = (substate, path, value) => {
  const name = path[0]
  let newValue = value

  if (path.length === 2) {
    const id = path[1]
    const trueIds = Object.keys(substate[name])
    const isLastTrueValueInState = trueIds.length === 1 && id === trueIds[0]

    if (isLastTrueValueInState && !value) {
      newValue = false
    } else if (!value) {
      newValue = { ...substate[name] }
      delete newValue[id]
    } else {
      newValue = { ...substate[name], [id]: true }
    }
  }

  return ({
    ...substate,
    [name]: newValue,
  })
}

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

  if (isThunkRequestAction(action)) {
    return transformState(state, path, true, false, false, false)
  } else if (action.error) {
    return transformState(state, path, false, true, false, true)
  }
  return transformState(state, path, false, false, true, true)
}
