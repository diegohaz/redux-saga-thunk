import {
  isAsyncAction,
  getAsyncMeta,
  getAsyncName,
  createAsyncAction,
  generateAsyncKey,
  hasKey,
} from './utils'

const middleware = () => {
  const responses = {}

  return next => (action) => {
    const { error, payload } = action
    if (isAsyncAction(action)) {
      if (!hasKey(action)) {
        const key = generateAsyncKey(action)
        next(createAsyncAction(action, key))
        return new Promise((resolve, reject) => {
          responses[key] = (err, response) => (err ? reject(err) : resolve(response))
        })
      }
      const key = getAsyncMeta(action)

      if (!responses[key]) {
        throw new Error(`[redux-saga-async-action] ${getAsyncName(action)} should be dispatched before ${action.type}`)
      }

      responses[key](error, payload)
      delete responses[key]
      return next(createAsyncAction(action, generateAsyncKey(action)))
    }
    return next(action)
  }
}

export default middleware
