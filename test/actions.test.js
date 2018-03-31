import { isFSA } from 'flux-standard-action'
import { CLEAN, clean } from '../src/actions'

test('clean', () => {
  const action = clean('FOO', 1)

  expect(action).toEqual({
    type: CLEAN,
    meta: {
      thunkName: 'FOO',
      id: 1,
    },
  })
  expect(isFSA(action)).toBe(true)
})
