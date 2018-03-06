import { isThunkAction, isThunkRequestAction, getThunkName } from './utils'
import { PENDING, REJECTED, FULFILLED, DONE, initialState } from './selectors'

const transformState = (state, name, pending, rejected, fulfilled, done) => ({
  ...state,
  [PENDING]: { ...state[PENDING], [name]: pending },
  [REJECTED]: { ...state[REJECTED], [name]: rejected },
  [FULFILLED]: { ...state[FULFILLED], [name]: fulfilled },
  [DONE]: { ...state[DONE], [name]: done },
})

export default (state = initialState, action) => {
  if (!isThunkAction(action)) return state
  const name = getThunkName(action)

  if (isThunkRequestAction(action)) {
    return transformState(state, name, true, false, false, false)
  } else if (action.error) {
    return transformState(state, name, false, true, false, true)
  }
  return transformState(state, name, false, false, true, true)
}
