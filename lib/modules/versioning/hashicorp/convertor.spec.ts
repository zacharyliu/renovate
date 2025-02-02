import { hashicorp2npm, npm2hashicorp } from './convertor';

describe('modules/versioning/hashicorp/convertor', () => {
  test.each`
    hashicorp           | npm
    ${'4.2.0'}          | ${'4.2.0'}
    ${'4.2.0-alpha'}    | ${'4.2.0-alpha'}
    ${'~> 4.0'}         | ${'^4.0'}
    ${'~> 4.1'}         | ${'^4.1'}
    ${'~> 4.0.0'}       | ${'~4.0.0'}
    ${'~> 4.0.1'}       | ${'~4.0.1'}
    ${'~> 4.1.0'}       | ${'~4.1.0'}
    ${'~> 4.1.1'}       | ${'~4.1.1'}
    ${'~> 4.0.0-alpha'} | ${'~4.0.0-alpha'}
    ${'>= 4.0'}         | ${'>=4.0'}
    ${'<= 4.0'}         | ${'<=4.0'}
    ${'> 4.0'}          | ${'>4.0'}
    ${'< 4.0'}          | ${'<4.0'}
    ${'> 4.0, < 5.0'}   | ${'>4.0 <5.0'}
    ${'~> 2.3.4'}       | ${'~2.3.4'}
  `(
    'hashicorp2npm("$hashicorp") === $npm && npm2hashicorp("$npm") === $hashicorp',
    ({ hashicorp, npm }) => {
      expect(hashicorp2npm(hashicorp)).toBe(npm);
      expect(npm2hashicorp(npm)).toBe(hashicorp);
    }
  );

  // These are non-reflective cases for hashicorp2npm
  test.each`
    hashicorp        | npm
    ${'~> 4'}        | ${'>=4'}
    ${'~> v4'}       | ${'>=4'}
    ${'>= v4.0'}     | ${'>=4.0'}
    ${'>=4.0'}       | ${'>=4.0'}
    ${'<=4.0'}       | ${'<=4.0'}
    ${'= 4.0'}       | ${'4.0'}
    ${'> 4.0,< 5.0'} | ${'>4.0 <5.0'}
  `('hashicorp2npm("$hashicorp") === $npm', ({ hashicorp, npm }) => {
    expect(hashicorp2npm(hashicorp)).toBe(npm);
  });

  // These are non-reflective cases for npm2hashicorp
  test.each`
    hashicorp     | npm
    ${'~> 4.0'}   | ${'^4'}
    ${'~> 4.0'}   | ${'^4.0.0'}
    ${'~> 4.1'}   | ${'^4.1.0'}
    ${'~> 4.1'}   | ${'^4.1.1'}
    ${'~> 4.0'}   | ${'~4'}
    ${'~> 4.0.0'} | ${'~4.0'}
    ${'~> 4.1.0'} | ${'~4.1'}
  `('npm2hashicorp("$npm") === $hashicorp', ({ hashicorp, npm }) => {
    expect(npm2hashicorp(npm)).toBe(hashicorp);
  });

  test('hashicorp2npm doesnt support !=', () => {
    expect(() => hashicorp2npm('!= 4')).toThrow();
  });

  test('hashicorp2npm throws on invalid', () => {
    expect(() => hashicorp2npm('^4')).toThrow();
  });

  test('npm2hashicorp throws on unsupported', () => {
    expect(() => npm2hashicorp('4.x.x')).toThrow();
  });
});
