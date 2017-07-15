import { isThunkAction, isThunkRequestAction, getThunkName } from './utils'
import { PENDING, FAILURE, DONE, initialState } from './selectors'

const transformState = (state, name, pending, failure, done) => ({
  ...state,
  [PENDING]: { ...state[PENDING], [name]: pending },
  [FAILURE]: { ...state[FAILURE], [name]: failure },
  [DONE]: { ...state[DONE], [name]: done },
})

export default (state = initialState, action) => {
  if (!isThunkAction(action)) return state
  const name = getThunkName(action)

  if (isThunkRequestAction(action)) {
    return transformState(state, name, true, false, false)
  } else if (action.error) {
    return transformState(state, name, false, true, false)
  }
  return transformState(state, name, false, false, true)
}
