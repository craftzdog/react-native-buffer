const B = require('../').Buffer
const test = require('tape')

test('base64url: ignore whitespace', function (t) {
  const text = '\n   YW9ldQ  '
  const buf = new B(text, 'base64url')
  t.equal(buf.toString(), 'aoeu')
  t.end()
})

test('base64url: newline in utf8 -- should not be an issue', function (t) {
  t.equal(
    new B('LS0tCnRpdGxlOiBUaHJlZSBkYXNoZXMgbWFya3MgdGhlIHNwb3QKdGFnczoK', 'base64url').toString('utf8'),
    '---\ntitle: Three dashes marks the spot\ntags:\n'
  )
  t.end()
})

test('base64url: newline in base64url -- should get stripped', function (t) {
  t.equal(
    new B('LS0tCnRpdGxlOiBUaHJlZSBkYXNoZXMgbWFya3MgdGhlIHNwb3QKdGFnczoK\nICAtIHlhbWwKICAtIGZyb250LW1hdHRlcgogIC0gZGFzaGVzCmV4cGFuZWQt', 'base64url').toString('utf8'),
    '---\ntitle: Three dashes marks the spot\ntags:\n  - yaml\n  - front-matter\n  - dashes\nexpaned-'
  )
  t.end()
})

test('base64url: tab characters in base64url - should get stripped', function (t) {
  t.equal(
    new B('LS0tCnRpdGxlOiBUaHJlZSBkYXNoZXMgbWFya3MgdGhlIHNwb3QKdGFnczoK\t\t\t\tICAtIHlhbWwKICAtIGZyb250LW1hdHRlcgogIC0gZGFzaGVzCmV4cGFuZWQt', 'base64url').toString('utf8'),
    '---\ntitle: Three dashes marks the spot\ntags:\n  - yaml\n  - front-matter\n  - dashes\nexpaned-'
  )
  t.end()
})

test('base64url: invalid non-alphanumeric characters -- should be stripped', function (t) {
  t.equal(
    new B('!"#$%&\'()*,.:;<=>?@[\\]^`{|}~', 'base64url').toString('utf8'),
    ''
  )
  t.end()
})

test('base64url: high byte', function (t) {
  const highByte = B.from([128])
  t.deepEqual(
    B.alloc(1, highByte.toString('base64url'), 'base64url'),
    highByte
  )
  t.end()
})

test('base64url: convert base64Url to base64', function (t) {
    const base64UrlString = 'SGVsbG8td29y_bG-'
    const expectedBase64 = 'SGVsbG8td29y/bG+'
    const buf = new B(base64UrlString, 'base64url')
    const actualBase64 = buf.toString('base64')
    t.equal(actualBase64, expectedBase64)
    const bufFromBase64 = new B(expectedBase64, 'base64')
    t.deepEqual(buf, bufFromBase64)
    const expectedBytes = [72, 101, 108, 108, 111, 45, 119, 111, 114, 253, 177, 190]
    t.deepEqual(Array.from(buf), expectedBytes)
    t.end()
})

test('base64url: empty and single character', function (t) {
    const empty = ''
    t.equal(new B(empty, 'base64url').toString('base64'), '')
    const single = 'A'
    const singleBuf = new B(single, 'base64url')
    t.equal(singleBuf.length, 0)
    t.end()
})

test('base64url: JWT-like payload', function (t) {
    const jwtPayload = 'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ'
    const buf = new B(jwtPayload, 'base64url')
    const decoded = buf.toString('utf8')
    t.ok(decoded.includes('John Doe'))
    t.ok(decoded.includes('1234567890'))
    const base64Version = buf.toString('base64')
    t.ok(base64Version.endsWith('='))
    t.notEqual(base64Version, jwtPayload)
    t.end()
})

test('base64url: it should accept base64 and base64url while constructing buffer with base64url', function (t) {
  const buf = new B("aGVsbG93b3JsZD0=", 'base64url')
  const buf2 = new B("aGVsbG93b3JsZD0=", 'base64')
  t.equal(buf.toString('utf8'), buf2.toString('utf8'))
  t.equal(buf.toString('utf8'), 'helloworld=')
  t.end()
})
  