import { assertEquals } from "https://deno.land/std@0.119.0/testing/asserts.ts";

import './mocks/history-mock.ts';

import { Router } from './router.ts';
import { RouteNavigator } from './route-navigator.ts';

Deno.test('navigate to (kz|ru|en)/test', async () => {
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

  const navigator = new RouteNavigator(router);  

  await navigator.refresh();

  assertEquals(
    success,
    true,
    fragment + ' - ' + match?.length   
  ); 

  await navigator.navigateTo('ru/test');

  assertEquals(
    success,
    true,
    fragment + ' - ' + match?.length   
  ); 

  await navigator.redirectTo('en/test');

  assertEquals(
    success,
    true,
    fragment + ' - ' + match?.length   
  ); 
});

Deno.test('popstate event handler', () => {
  const navigator = new RouteNavigator(new Router());

  let success = false;

  navigator['popStateHandler'] = () => success = true;

  navigator.addUriListener();

  window.dispatchEvent(new Event('popstate'));

  assertEquals(success, true);

  success = false;

  navigator.removeUriListener();

  window.dispatchEvent(new Event('popstate'));

  assertEquals(success, false);
});
