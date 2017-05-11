import { isAsyncAction } from './utils'
import { PENDING, SUCCESS, FAILURE, initialState } from './selectors'

const transformState = (state, name, pending, failure) => ({
  ...state,
  [PENDING]: { ...state[PENDING], [name]: pending },
  [FAILURE]: { ...state[FAILURE], [name]: failure },
})

export default (state = initialState, action) => {
  if (!isAsyncAction(action)) return state
  const { name, status } = action.meta.async

  switch (status) {
    case PENDING: return transformState(state, name, true, false)
    case SUCCESS: return transformState(state, name, false, false)
    case FAILURE: return transformState(state, name, false, true)
    default: return state
  }
}
