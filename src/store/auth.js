import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';

const useAuthStore = create((set, get) => ({
    userData: null,
    loading: false,
    user: () => ({
      user_id:          get().userData?.user_id || null,
      username:         get().userData?.username || null,
      first_name:       get().userData?.first_name || null,
      paternal_surname: get().userData?.paternal_surname || null,
      maternal_surname: get().userData?.maternal_surname || null,
      email:            get().userData?.email || null,
      gender:           get().userData?.gender  || null,
      is_staff:         get().userData?.is_staff || false,
      is_superuser:     get().userData?.is_superuser || false,
    }),
    setUser: (user) => set({ userData: user }),
    setLoading: (loading) => set({ loading }),
    isLoggedIn: () => get().userData !== null,
}));

if (import.meta.env.DEV) {
  mountStoreDevtool('auth', useAuthStore);
}

export { useAuthStore };