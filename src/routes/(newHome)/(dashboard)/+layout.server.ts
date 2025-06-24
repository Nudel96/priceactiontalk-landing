import type { LayoutServerLoad } from './$types';

// The `LayoutLoad` type ensures type safety for your load function's parameters and return value.
export const load: LayoutServerLoad = async () => {
  // In a real application, you would get the user's session from a cookie,
  // an API call, or from the `event.locals` object provided by SvelteKit's hooks.
  // For this example, we will simulate an authenticated user with mock data.

  const user = {
    avatar: 'https://placehold.co/128x128/4a5568/ffffff?text=U',
    username: 'SvelteKitUser',
    level: 15,
    xp: 1530,
  };

  // The object returned from the `load` function is made available to the
  // corresponding +layout.svelte component as a `data` prop.
  return {
    user: user
  };
};
