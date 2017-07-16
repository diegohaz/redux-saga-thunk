import { createStore, applyMiddleware, combineReducers } from 'redux'
import createSagaMiddleware, { delay } from 'redux-saga'
import { put, take, call, fork, takeEvery } from 'redux-saga/effects'
import {
  middleware as thunkMiddleware,
  reducer as thunkReducer,
  isPending,
  hasFailed,
  isDone,
  isComplete,
} from '../src'

function* foo(payload, meta) {
  yield call(delay, 500)
  if (payload === 'done') {
    yield put({
      type: 'FOO_SUCCESS',
      payload,
      meta: {
        thunk: meta.thunk,
      },
    })
  } else {
    yield put({
      type: 'FOO_FAILURE',
      error: true,
      payload,
      meta: {
        thunk: meta.thunk,
      },
    })
  }
}

function* watchFoo() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { payload, meta } = yield take('FOO_REQUEST')
    yield call(foo, payload, meta)
  }
}


function* bar({ payload, meta }) {
  yield put({ type: 'BAR_SUCCESS', payload, meta })
}

function* watchBar() {
  yield takeEvery('BAR_REQUEST', bar)
}

function* sagas() {
  yield fork(watchFoo)
  yield fork(watchBar)
}

const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware()
  const middlewares = [thunkMiddleware, sagaMiddleware]
  const reducer = combineReducers({ thunk: thunkReducer })
  const store = createStore(reducer, {}, applyMiddleware(...middlewares))
  sagaMiddleware.run(sagas)
  return store
}

describe('Integration test', () => {
  const fooRequest = payload => ({
    type: 'FOO_REQUEST',
    payload,
    meta: {
      thunk: true,
    },
  })

  const barRequest = payload => ({
    type: 'BAR_REQUEST',
    payload,
    meta: {
      thunk: true,
    },
  })

  it('calls done', async () => {
    const { dispatch, getState } = configureStore()
    const promise = dispatch(fooRequest('done'))
    expect(promise).toBeInstanceOf(Promise)
    await delay(400)
    expect(isPending(getState(), 'FOO_REQUEST')).toBe(true)
    expect(hasFailed(getState(), 'FOO_REQUEST')).toBe(false)
    expect(isDone(getState(), 'FOO_REQUEST')).toBe(false)
    expect(isComplete(getState(), 'FOO_REQUEST')).toBe(false)
    await expect(promise).resolves.toBe('done')
    expect(isPending(getState(), 'FOO_REQUEST')).toBe(false)
    expect(hasFailed(getState(), 'FOO_REQUEST')).toBe(false)
    expect(isDone(getState(), 'FOO_REQUEST')).toBe(true)
    expect(isComplete(getState(), 'FOO_REQUEST')).toBe(true)
  })

  it('calls failure', async () => {
    const { dispatch, getState } = configureStore()
    const promise = dispatch(fooRequest('failure'))
    expect(promise).toBeInstanceOf(Promise)
    await delay(400)
    expect(isPending(getState(), 'FOO_REQUEST')).toBe(true)
    expect(hasFailed(getState(), 'FOO_REQUEST')).toBe(false)
    expect(isDone(getState(), 'FOO_REQUEST')).toBe(false)
    expect(isComplete(getState(), 'FOO_REQUEST')).toBe(false)
    await expect(promise).rejects.toBe('failure')
    expect(isPending(getState(), 'FOO_REQUEST')).toBe(false)
    expect(hasFailed(getState(), 'FOO_REQUEST')).toBe(true)
    expect(isDone(getState(), 'FOO_REQUEST')).toBe(false)
    expect(isComplete(getState(), 'FOO_REQUEST')).toBe(true)
  })

  it('calls done immediatly', async () => {
    const { dispatch, getState } = configureStore()
    const promise = dispatch(barRequest('done'))
    expect(promise).toBeInstanceOf(Promise)
    await expect(promise).resolves.toBe('done')
    expect(isPending(getState(), 'BAR_REQUEST')).toBe(false)
    expect(hasFailed(getState(), 'BAR_REQUEST')).toBe(false)
    expect(isDone(getState(), 'BAR_REQUEST')).toBe(true)
    expect(isComplete(getState(), 'BAR_REQUEST')).toBe(true)
  })
})
