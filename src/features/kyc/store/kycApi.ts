import type {
  KycSubmission,
  KycSubmitRequest,
  KycSubmitResponse,
  KycUploadPayload,
  KycUploadRequest,
  KycUploadResponse,
} from '@/src/features/kyc/types/kyc';
import { baseApi } from '@/src/store/baseApi';

export const kycApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    uploadKycDocument: build.mutation<KycUploadPayload, KycUploadRequest>({
      query: ({ file, documentKind }) => {
        // multipart/form-data: the API forwards the bytes to Cloudinary itself.
        // Don't set Content-Type — fetch adds the multipart boundary.
        const form = new FormData();
        form.append('file', file as unknown as Blob);
        form.append('documentKind', documentKind);
        return {
          url: 'auth/kyc/uploads',
          method: 'POST',
          body: form,
        };
      },
      transformResponse: (response: KycUploadResponse) => response.data,
    }),

    submitKyc: build.mutation<KycSubmission, KycSubmitRequest>({
      query: (body) => ({
        url: 'auth/kyc',
        method: 'POST',
        body,
      }),
      transformResponse: (response: KycSubmitResponse) => response.data,
      // Submitting changes the user's kycStatus → refresh /me.
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useUploadKycDocumentMutation, useSubmitKycMutation } = kycApi;
