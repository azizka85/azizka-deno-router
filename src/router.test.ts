import { assertEquals } from "https://deno.land/std@0.119.0/testing/asserts.ts";

import { Router } from './router.ts';

Deno.test('num route', async () => {
  let success = false;
  let fragment: string | undefined;
  let match: RegExpMatchArray | undefined;

  const router = new Router({
    before: async (page) => {
      success = false;
      match = undefined;
      fragment = page.fragment;

      return false;
    },
    routes: [{
      rule: 'test/(:num)',
      handler: async (page) => {
        match = page.match;

        success = 
          (fragment?.startsWith('test/') || false) &&
          (match?.[0].match(/\d+/)?.length || 0) > 0; 
      }
    }]
  });

  await router.processUrl('test/123', {});

  assertEquals(
    success,
    true,
    fragment + ' - ' + match?.[0].match(/\d+/)?.length   
  );  

  await router.processUrl('test/123a', {});

  assertEquals(
    success,
    false,
    fragment + ' - ' + match?.[0].match(/\d+/)?.length
  );
});

Deno.test('word route', async () => {
  let success = false;
  let fragment: string | undefined;
  let match: RegExpMatchArray | undefined;

  const router = new Router({
    before: async (page) => {
      success = false;
      match = undefined;
      fragment = page.fragment;

      return false;
    },
    routes: [{
      rule: 'test/(:word)',
      handler: async (page) => {
        match = page.match;

        success = 
          (fragment?.startsWith('test/') || false) &&
          (match?.[0].match(/[a-zA-Z]+/)?.length || 0) > 0; 
      }
    }]
  });

  await router.processUrl('test/abc', {});

  assertEquals(
    success,
    true,
    fragment + ' - ' + match?.[0].match(/[a-zA-Z]+/)?.length   
  );  

  await router.processUrl('test/a123', {});

  assertEquals(
    success,
    false,
    fragment + ' - ' + match?.[0].match(/[a-zA-Z]+/)?.length
  );
});

Deno.test('any route', async () => {
  let success = false;
  let fragment: string | undefined;
  let match: RegExpMatchArray | undefined;

  const router = new Router({
    before: async (page) => {
      success = false;
      match = undefined;
      fragment = page.fragment;

      return false;
    },
    routes: [{
      rule: 'test/(:any)',
      handler: async (page) => {
        match = page.match;

        success = 
          (fragment?.startsWith('test/') || false) &&
          (match?.length || 0) > 0; 
      }
    }]
  });

  await router.processUrl('test/abc-123', {});

  assertEquals(
    success,
    true,
    fragment + ' - ' + match?.length   
  );  

  await router.processUrl('test/abc_123', {});

  assertEquals(
    success,
    true,
    fragment + ' - ' + match?.length   
  ); 

  await router.processUrl('test/abc.123', {});

  assertEquals(
    success,
    true,
    fragment + ' - ' + match?.length   
  ); 

  await router.processUrl('test/$a123', {});

  assertEquals(
    success,
    false,
    fragment + ' - ' + match?.length
  );
});

Deno.test('locale route', async () => {
  let success = false;
  let fragment: string | undefined;
  let match: RegExpMatchArray | undefined;

  const router = new Router({
    before: async (page) => {
      success = false;
      match = undefined;
      fragment = page.fragment;

      return false;
    },
    routes: [{
      rule: '(kz|ru|en)/test',
      handler: async (page) => {
        match = page.match;

        success = 
          (fragment?.endsWith('/test') || false) &&
          (match?.length || 0) > 0; 
      }
    }]
  });

  await router.processUrl('kz/test', {});

  assertEquals(
    success,
    true,
    fragment + ' - ' + match?.length   
  ); 

  await router.processUrl('ru/test', {});

  assertEquals(
    success,
    true,
    fragment + ' - ' + match?.length   
  ); 

  await router.processUrl('en/test', {});

  assertEquals(
    success,
    true,
    fragment + ' - ' + match?.length   
  ); 

  await router.processUrl('bug/test', {});

  assertEquals(
    success,
    false,
    fragment + ' - ' + match?.length   
  ); 
});
