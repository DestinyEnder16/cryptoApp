import type { User, UserResponse } from '@/src/types/auth/types';
import { baseApi } from './baseApi';

type ProfileUpdate = {
  fullName: string;
  phone: string;
  avatarUrl?: string;
  email: string;
};

export const profileApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchMe: build.query<User, void>({
      query: () => '/me',
      transformResponse: (response: UserResponse) => response.data,
      providesTags: ['User'],
    }),

    editProfile: build.mutation<User, ProfileUpdate>({
      query: (profile) => ({
        url: '/me',
        method: 'PATCH',
        body: profile,
      }),
      transformResponse: (response: UserResponse) => response.data,
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useFetchMeQuery, useEditProfileMutation } = profileApi;
