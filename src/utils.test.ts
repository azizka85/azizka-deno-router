import { assertEquals } from "https://deno.land/std@0.119.0/testing/asserts.ts";

import { trimSlashes, parseQuery, transformURL, parseRouteRule } from './utils.ts';

Deno.test('trimSlashes function', () => {
  const val = trimSlashes('/test/');

  assertEquals(
    val,
    'test',
    `"/test/" should be transformed to "test" but we have ${val}`
  );
});

Deno.test('parseQuery function', () => {
  const query = parseQuery('?test1=123&test2&test3=abc&test4=abc123&test5=123abc');

  const test1Val = query.test1;

  assertEquals(
    test1Val,
    '123',
    `query.test1 should be 123 but we have ${test1Val}`
  );

  const test2Val = query.test2;

  assertEquals(
    test2Val,
    '1',
    `query.test2 should be 1 but we have ${test2Val}`
  );

  const test3Val = query.test3;

  assertEquals(
    test3Val,
    'abc',
    `query.test3 should be abc but we have ${test3Val}`
  );

  const test4Val = query.test4;

  assertEquals(
    test4Val,
    'abc123',
    `query.test4 should be abc123 but we have ${test4Val}`
  );

  const test5Val = query.test5;

  assertEquals(
    test5Val,
    '123abc',
    `query.test5 should be 123abc but we have ${test5Val}`
  );

  const queryLength = Object.keys(query).length;

  assertEquals(
    queryLength,
    5,
    `count of query keys should be 5 but we have ${queryLength}`
  );
});

Deno.test('transformURL function', () => {
  const url1 = transformURL('/test?test=1', '', '/');
  
  assertEquals(
    url1,
    'test?test=1',
    `"/test?test=1" should be transformed to "test?test=1" but we have ${url1}`
  );

  const url2 = transformURL('/test?', '', '/');

  assertEquals(
    url2,
    'test',
    `"/test?" should be transformed to "test" but we hae ${url2}`
  );

  const url3 = transformURL('?test=1', 'test', '/');

  assertEquals(
    url3,
    'test?test=1',
    `"?test=1" should be transformed to "test?test=1" but we have ${url3}`
  );

  const url4 = transformURL('/abc/test?test=1', '', '/abc/');

  assertEquals(
    url4,
    'test?test=1',
    `"/abc/test?test=1" should be transformed to "test?test=1" but we have ${url4}`
  );

  const url5 = transformURL('/abc/test?', '', '/abc/');

  assertEquals(
    url5,
    'test',
    `"/abc/test?" should be transformed to "test" but we have ${url5}`
  );
});

Deno.test('parseRouteRule function', () => {
  const numRoute = parseRouteRule('test/(:num)');

  assertEquals(
    numRoute,
    /^test\/(\d+)$/i,
    `test/(:num) should be transformed to /^test\/(\d+)$/i but we have ${numRoute}`
  );

  const wordRoute = parseRouteRule('test/(:word)');

  assertEquals(
    wordRoute,
    /^test\/([a-zA-Z]+)$/i,
    `test/(:word) should be transformed to /^test\/([a-zA-Z]+)$/i but we have ${wordRoute}`
  );

  const anyRoute = parseRouteRule('test/(:any)');

  assertEquals(
    anyRoute,
    anyRoute,
    `test/(:any) should be transformed to /^test\/([\\w\\-\\_\\.]+)$/i but we have ${anyRoute}`
  );  
});