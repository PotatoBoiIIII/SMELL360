

import { authUser } from '../../lib/authStore.js';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store'; 

export const load = async () => {

  const user = get(authUser); 


  if (!user) {
    throw redirect(302, '/login');
  }

  return {};
};