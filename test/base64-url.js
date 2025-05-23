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

test('base64url: valid input', function (t) {
    const input = 'SGVsbG8td29ybGQ'
    const buf = new B(input, 'base64url')
    t.equal(buf.toString('utf8'), 'Hello-world')
    t.end()
})
