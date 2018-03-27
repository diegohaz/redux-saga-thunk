export const isThunkAction = action => !!(
  action && action.meta && action.meta.thunk
)

export const isThunkRequestAction = action => !!(
  isThunkAction(action) && /\d{16}_REQUEST$/.test(action.meta.thunk)
)

export const getThunkMeta = (action) => {
  if (isThunkAction(action)) {
    return action.meta.thunk
  }
  return null
}

export const createThunkAction = (action, thunk) => ({
  ...action,
  meta: {
    ...action.meta,
    thunk,
  },
})

export const getThunkName = (action) => {
  const meta = getThunkMeta(action)
  if (meta && meta.replace) {
    return meta.replace(/_\d{16}_\w+$/, '')
  }
  return action.type
}

export const isIdInMeta = (action) => {
  const meta = getThunkMeta(action)
  return (meta && typeof meta === 'object' && 'id' in meta) || false
}

export const getThunkId = action => (isIdInMeta(action) ? getThunkMeta(action).id : undefined)

export const hasKey = action => /_\d{16}_\w+$/.test(getThunkMeta(action))

export const generateThunkKey = (action) => {
  const meta = getThunkMeta(action)
  const name = getThunkName(action)
  return hasKey(action)
    ? meta.replace(/_REQUEST$/, '_RESPONSE')
    : `${name}_${Math.random().toFixed(16).substring(2)}_REQUEST`
}

