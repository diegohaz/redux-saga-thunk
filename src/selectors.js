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

const getIn = (
  state: {},
  name?: string | (string | [string, string | number])[],
  id?: string | number,
): boolean => {
  if (typeof name === 'undefined') {
    return !!find(state, value => !!value)
  } else if (Array.isArray(name)) {
    const names = name.map(n => (Array.isArray(n) ? n[0] : n))
    const nameToIdMap = name.reduce((prev, curr) => {
      if (Array.isArray(curr)) {
        return Object.assign({}, prev, { [curr[0]]: curr[1] })
      }
      return prev
    }, {})

    return !!find(pick(state, names), (value, key) => {
      if (typeof nameToIdMap[key] === 'undefined') {
        return !!value
      }

      return typeof value === 'object' ? !!value[nameToIdMap[key]] : false
    })
  } else if (Object.prototype.hasOwnProperty.call(state, name)) {
    if (typeof id === 'undefined') {
      return !!state[name]
    }
    return typeof state[name] === 'object' ? !!state[name][id] : false
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
 *   barForId42IsPending: pending(state, 'BAR', 42),
 *   barForAnyIdIsPending: pending(state, 'BAR'),
 *   fooOrBazIsPending: pending(state, ['FOO', 'BAZ']),
 *   fooOrBarForId42IsPending: pending(state, ['FOO', ['BAR', 42]]),
 *   anythingIsPending: pending(state)
 * })
 */
export const pending = (
  state: State,
  name?: string | (string | [string, string | number])[],
  id?: string | number,
): boolean => getIn(getPendingState(state), name, id)

/**
 * Tells if an action was rejected
 * @example
 * const mapStateToProps = state => ({
 *   fooWasRejected: rejected(state, 'FOO'),
 *   barForId42WasRejected: rejected(state, 'BAR', 42),
 *   barForAnyIdWasRejected: rejected(state, 'BAR'),
 *   fooOrBazWasRejected: rejected(state, ['FOO', 'BAZ']),
 *   fooOrBarForId42WasRejected: rejected(state, ['FOO', ['BAR', 42]]),
 *   anythingWasRejected: rejected(state)
 * })
 */
export const rejected = (
  state: State,
  name?: string | (string | [string, string | number])[],
  id?: string | number,
): boolean =>
  getIn(getRejectedState(state), name, id)

  /**
 * Tells if an action is fulfilled
 * @example
 * const mapStateToProps = state => ({
 *   fooIsFulfilled: fulfilled(state, 'FOO'),
 *   barForId42IsFulfilled: fulfilled(state, 'BAR', 42),
 *   barForAnyIdIsFulfilled: fulfilled(state, 'BAR'),
 *   fooOrBazIsFulfilled: fulfilled(state, ['FOO', 'BAZ']),
 *   fooOrBarForId42IsFulfilled: fulfilled(state, ['FOO', ['BAR', 42]]),
 *   anythingIsFulfilled: fulfilled(state)
 * })
 */
export const fulfilled = (
  state: State,
  name?: string | (string | [string, string | number])[],
  id?: string | number,
): boolean =>
  getIn(getFulfilledState(state), name, id)

  /**
 * Tells if an action is done
 * @example
 * const mapStateToProps = state => ({
 *   fooIsDone: done(state, 'FOO'),
 *   barForId42IsDone: done(state, 'BAR', 42),
 *   barForAnyIdIsDone: done(state, 'BAR'),
 *   fooOrBazIsDone: done(state, ['FOO', 'BAZ']),
 *   fooOrBarForId42IsDone: done(state, ['FOO', ['BAR', 42]]),
 *   anythingIsDone: done(state)
 * })
 */
export const done = (
  state: State,
  name?: string | (string | [string, string | number])[],
  id?: string | number,
): boolean =>
  getIn(getDoneState(state), name, id)
