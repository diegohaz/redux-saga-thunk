import { fork, call, take, race, takeEvery } from 'redux-saga/effects'
import { isAsyncAction, isAsyncRequestAction } from './utils'

export const matchResponse = (name, key) => ({ meta }) => {
  if (isAsyncAction({ meta }) && name === meta.async.name) {
    if (typeof meta.async.key !== 'undefined') {
      return meta.async.key === key
    }
    return true
  }
  return false
}

export function* respondToRequest({ meta }) {
  const { success, failure } = yield race({
    success: take(matchResponse(meta.async.name, meta.async.key)),
    failure: take(matchResponse(meta.async.name, meta.async.key)),
  })

  if (success) {
    yield call(meta.async.done, null, success.payload)
  } else {
    yield call(meta.async.done, failure.payload)
  }
}

export function* watchRequestActions() {
  yield takeEvery(isAsyncRequestAction, respondToRequest)
}

export default function* () {
  yield fork(watchRequestActions)
}
