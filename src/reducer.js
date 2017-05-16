import { isAsyncAction, isAsyncRequestAction, getAsyncName } from './utils'
import { PENDING, FAILURE, initialState } from './selectors'

const transformState = (state, name, pending, failure) => ({
  ...state,
  [PENDING]: { ...state[PENDING], [name]: pending },
  [FAILURE]: { ...state[FAILURE], [name]: failure },
})

export default (state = initialState, action) => {
  if (!isAsyncAction(action)) return state
  const name = getAsyncName(action)

  if (isAsyncRequestAction(action)) {
    return transformState(state, name, true, false)
  } else if (action.error) {
    return transformState(state, name, false, true)
  }
  return transformState(state, name, false, false)
}
