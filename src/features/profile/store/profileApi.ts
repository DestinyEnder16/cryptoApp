import type {
  ProfileUpdate,
  User,
  UserResponse,
} from '@/src/features/auth/types/auth';
import { setUser } from '@/src/features/profile/store/profileSlice';
import { baseApi } from '@/src/store/baseApi';

export const profileApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchMe: build.query<User, void>({
      query: () => '/me',
      transformResponse: (response: UserResponse) => response.data,
      providesTags: ['User'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch {
          // /me failed — leave any persisted user untouched; bootstrap decides
          // whether to wipe it (auth errors) or keep it (transient failures).
        }
      },
    }),

    editProfile: build.mutation<User, ProfileUpdate>({
      query: (profile) => ({
        url: '/me',
        method: 'PATCH',
        body: profile,
      }),
      transformResponse: (response: UserResponse) => response.data,
      invalidatesTags: ['User'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch {
          // Edit failed — RTK Query keeps the previous cached user.
        }
      },
    }),
  }),
});

export const { useFetchMeQuery, useEditProfileMutation } = profileApi;
