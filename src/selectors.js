// @flow
import find from 'lodash/find'
import pick from 'lodash/pick'

export const PENDING = 'pending'
export const FAILURE = 'failure'

type AsyncState = { [string]: ?{} }

type State = {
  async?: AsyncState
}

export const initialState = {
  [PENDING]: {},
  [FAILURE]: {},
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

export const getAsyncState = (state: State = {}): AsyncState => {
  if (!Object.prototype.hasOwnProperty.call(state, 'async')) {
    throw new Error('[redux-saga-async-action] There is no async state on reducer')
  }
  return state.async || {}
}

export const getPendingState = (state: State) =>
  getAsyncState(state)[PENDING] || initialState[PENDING]

export const getFailureState = (state: State) =>
  getAsyncState(state)[FAILURE] || initialState[FAILURE]

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

