export const isAsyncAction = action => !!(
  action && action.meta && action.meta.async
)

export const isAsyncRequestAction = action => !!(
  isAsyncAction(action) && /\d{16}_REQUEST$/.test(action.meta.async)
)

export const getAsyncMeta = (action) => {
  if (isAsyncAction(action)) {
    return action.meta.async
  }
  return null
}

export const createAsyncAction = (action, async) => ({
  ...action,
  meta: {
    ...action.meta,
    async,
  },
})

export const getAsyncName = (action) => {
  const meta = getAsyncMeta(action)
  if (meta && meta.replace) {
    return meta.replace(/_\d{16}_\w+$/, '')
  }
  return action.type
}

export const hasKey = action => /_\d{16}_\w+$/.test(getAsyncMeta(action))

export const generateAsyncKey = (action) => {
  const meta = getAsyncMeta(action)
  const name = getAsyncName(action)
  return hasKey(action)
    ? meta.replace(/_REQUEST$/, '_RESPONSE')
    : `${name}_${Math.random().toFixed(16).substring(2)}_REQUEST`
}

