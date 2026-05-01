import { describe, expect, it } from 'vitest';
import { parsePrContextFromUrl } from './github';

describe('parsePrContextFromUrl', () => {
  it('parses standard PR url', () => {
    const r = parsePrContextFromUrl('https://github.com/foo/bar/pull/42');
    expect(r).toEqual({ owner: 'foo', repo: 'bar', number: 42 });
  });

  it('parses PR url with sub-path', () => {
    const r = parsePrContextFromUrl('https://github.com/foo/bar/pull/42/files');
    expect(r).toEqual({ owner: 'foo', repo: 'bar', number: 42 });
  });

  it('returns null for non-PR urls', () => {
    expect(parsePrContextFromUrl('https://github.com/foo/bar')).toBeNull();
    expect(parsePrContextFromUrl('https://example.com/foo/bar/pull/1')).toBeNull();
  });
});
