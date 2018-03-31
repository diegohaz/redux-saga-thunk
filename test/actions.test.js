import { isFSA } from 'flux-standard-action'
import { CLEAN, clean } from '../src/actions'

describe('clean', () => {
  it('without ID', () => {
    const action = clean('FOO')

    expect(action).toEqual({
      type: CLEAN,
      meta: {
        thunk: {
          name: 'FOO',
        },
      },
    })
    expect(action).not.toHaveProperty(['meta', 'thunk', 'id'])
    expect(isFSA(action)).toBe(true)
  })

  it('with ID', () => {
    const action = clean('FOO', 1)

    expect(action).toEqual({
      type: CLEAN,
      meta: {
        thunk: {
          name: 'FOO',
          id: 1,
        },
      },
    })
    expect(isFSA(action)).toBe(true)
  })
})
