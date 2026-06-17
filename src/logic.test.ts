import { test } from 'node:test'
import assert from 'node:assert/strict'
import { formatOre, clampSlide, selectSurface, validateSign, signingButtons, paymentButtons } from './logic'

test('formatOre renders øre as kroner', () => {
  assert.equal(formatOre(1250000, 'nb-NO'), '12 500')
  assert.equal(formatOre(0), '0')
})

test('clampSlide keeps index within bounds', () => {
  assert.equal(clampSlide(2, 5), 2)
  assert.equal(clampSlide(-1, 5), 0)
  assert.equal(clampSlide(9, 5), 4)
  assert.equal(clampSlide(0, 0), 0)
})

test('selectSurface maps type + state to a surface', () => {
  assert.equal(selectSurface({ expired: false, artifact: { type: 'offer', status: 'sent' } } as never), 'offer')
  assert.equal(selectSurface({ expired: true, artifact: { type: 'offer', status: 'viewed' } } as never), 'expired')
  assert.equal(selectSurface({ signed: true, expired: false, artifact: { type: 'agreement', status: 'signed' } } as never), 'signed')
  assert.equal(selectSurface({ expired: false, artifact: { type: 'agreement', status: 'declined' } } as never), 'unavailable')
})

test('validateSign requires name, email, consent', () => {
  assert.equal(validateSign({ signerName: 'Kari', signerEmail: 'k@a.no', consent: true }).ok, true)
  assert.equal(validateSign({ signerName: '', signerEmail: 'k@a.no', consent: true }).ok, false)
  assert.equal(validateSign({ signerName: 'Kari', signerEmail: 'bad', consent: true }).ok, false)
  assert.equal(validateSign({ signerName: 'Kari', signerEmail: 'k@a.no', consent: false }).ok, false)
})

test('signingButtons reflects availability', () => {
  assert.deepEqual(signingButtons({ available: ['bankid', 'vipps'] }), ['bankid', 'vipps'])
  assert.deepEqual(signingButtons({ available: [] }), [])
  assert.deepEqual(signingButtons(undefined), [])
})

test('paymentButtons reflects availability', () => {
  assert.deepEqual(paymentButtons({ available: ['stripe', 'fiken'] }), ['stripe', 'fiken'])
  assert.deepEqual(paymentButtons({ available: [] }), [])
  assert.deepEqual(paymentButtons(undefined), [])
})
