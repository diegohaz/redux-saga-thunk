import { isThunkAction, isThunkRequestAction, getThunkName } from './utils'
import { PENDING, FAILURE, initialState } from './selectors'

const transformState = (state, name, pending, failure) => ({
  ...state,
  [PENDING]: { ...state[PENDING], [name]: pending },
  [FAILURE]: { ...state[FAILURE], [name]: failure },
})

export default (state = initialState, action) => {
  if (!isThunkAction(action)) return state
  const name = getThunkName(action)

  if (isThunkRequestAction(action)) {
    return transformState(state, name, true, false)
  } else if (action.error) {
    return transformState(state, name, false, true)
  }
  return transformState(state, name, false, false)
}
