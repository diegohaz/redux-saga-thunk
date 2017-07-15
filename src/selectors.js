// @flow
import find from 'lodash/find'
import pick from 'lodash/pick'

export const PENDING = 'pending'
export const FAILURE = 'failure'
export const SUCCESS = 'success'

type ThunkState = { [string]: ?{} }

type State = {
  thunk?: ThunkState
}

export const initialState = {
  [PENDING]: {},
  [FAILURE]: {},
  [SUCCESS]: {},
}

const getIn = (state: {}, name?: string | string[]): boolean => {
  if (typeof name === 'undefined') {
    return !!find(state, value => !!value)
  } else if (Array.isArray(name)) {
    return !!find(pick(state, name), value => !!value)
  } else if (Object.prototype.hasOwnProperty.call(state, name)) {
    return !!state[name]
  }
  return false
}

export const getThunkState = (state: State = {}): ThunkState => {
  if (!Object.prototype.hasOwnProperty.call(state, 'thunk')) {
    throw new Error('[redux-saga-thunk] There is no thunk state on reducer')
  }
  return state.thunk || {}
}

export const getPendingState = (state: State) =>
  getThunkState(state)[PENDING] || initialState[PENDING]

export const getFailureState = (state: State) =>
  getThunkState(state)[FAILURE] || initialState[FAILURE]

export const getSuccessState = (state: State) =>
  getThunkState(state)[SUCCESS] || initialState[SUCCESS]

/**
 * Tells if an action is pending
 * @example
 * const mapStateToProps = state => ({
 *   fooIsPending: isPending(state, 'FOO'),
 *   fooOrBarIsPending: isPending(state, ['FOO', 'BAR']),
 *   anythingIsPending: isPending(state)
 * })
 */
export const isPending = (state: State, name?: string | string[]): boolean =>
  getIn(getPendingState(state), name)

/**
 * Tells if an action has failed
 * @example
 * const mapStateToProps = state => ({
 *   fooHasFailed: hasFailed(state, 'FOO'),
 *   fooOrBarHasFailed: hasFailed(state, ['FOO', 'BAR']),
 *   anythingHasFailed: hasFailed(state)
 * })
 */
export const hasFailed = (state: State, name?: string | string[]): boolean =>
  getIn(getFailureState(state), name)

  /**
 * Tells if an action has success
 * @example
 * const mapStateToProps = state => ({
 *   fooHasSuccess: hasSuccess(state, 'FOO'),
 *   fooOrBarHasSuccess: hasSuccess(state, ['FOO', 'BAR']),
 *   anythingHasSuccess: hasSuccess(state)
 * })
 */
export const hasSuccess = (state: State, name?: string | string[]): boolean =>
  getIn(getSuccessState(state), name)

