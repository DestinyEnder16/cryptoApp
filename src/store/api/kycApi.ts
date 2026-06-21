import type {
  KycUploadPayload,
  KycUploadRequest,
  KycUploadResponse,
} from '@/src/types/kyc/types';
import { baseApi } from './baseApi';

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
  }),
});

export const { useUploadKycDocumentMutation } = kycApi;
