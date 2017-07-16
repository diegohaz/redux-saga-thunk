import { isThunkAction, isThunkRequestAction, getThunkName } from './utils'
import { PENDING, FAILURE, DONE, COMPLETE, initialState } from './selectors'

const transformState = (state, name, pending, failure, done, complete) => ({
  ...state,
  [PENDING]: { ...state[PENDING], [name]: pending },
  [FAILURE]: { ...state[FAILURE], [name]: failure },
  [DONE]: { ...state[DONE], [name]: done },
  [COMPLETE]: { ...state[COMPLETE], [name]: complete },
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
