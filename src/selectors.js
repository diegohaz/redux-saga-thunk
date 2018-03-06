// @flow
import find from 'lodash/find'
import pick from 'lodash/pick'

export const PENDING = 'pending'
export const REJECTED = 'rejected'
export const FULFILLED = 'fulfilled'
export const DONE = 'done'

type ThunkState = { [string]: ?{} }

type State = {
  thunk?: ThunkState
}

export const initialState = {
  [PENDING]: {},
  [REJECTED]: {},
  [FULFILLED]: {},
  [DONE]: {},
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

export const getRejectedState = (state: State) =>
  getThunkState(state)[REJECTED] || initialState[REJECTED]

export const getFulfilledState = (state: State) =>
  getThunkState(state)[FULFILLED] || initialState[FULFILLED]

export const getDoneState = (state: State) =>
  getThunkState(state)[DONE] || initialState[DONE]

/**
 * Tells if an action is pending
 * @example
 * const mapStateToProps = state => ({
 *   fooIsPending: pending(state, 'FOO'),
 *   fooOrBarIsPending: pending(state, ['FOO', 'BAR']),
 *   anythingIsPending: pending(state)
 * })
 */
export const pending = (state: State, name?: string | string[]): boolean =>
  getIn(getPendingState(state), name)

/**
 * Tells if an action was rejected
 * @example
 * const mapStateToProps = state => ({
 *   fooWasRejected: rejected(state, 'FOO'),
 *   fooOrBarWasRejected: rejected(state, ['FOO', 'BAR']),
 *   anythingWasRejected: rejected(state)
 * })
 */
export const rejected = (state: State, name?: string | string[]): boolean =>
  getIn(getRejectedState(state), name)

  /**
 * Tells if an action is fulfilled
 * @example
 * const mapStateToProps = state => ({
 *   fooIsFulfilled: fulfilled(state, 'FOO'),
 *   fooOrBarIsFulfilled: fulfilled(state, ['FOO', 'BAR']),
 *   anythingIsFulfilled: fulfilled(state)
 * })
 */
export const fulfilled = (state: State, name?: string | string[]): boolean =>
  getIn(getFulfilledState(state), name)

  /**
 * Tells if an action is done
 * @example
 * const mapStateToProps = state => ({
 *   fooIsDone: done(state, 'FOO'),
 *   fooOrBarIsDone: done(state, ['FOO', 'BAR']),
 *   anythingIsDone: done(state)
 * })
 */
export const done = (state: State, name?: string | string[]): boolean =>
  getIn(getDoneState(state), name)
