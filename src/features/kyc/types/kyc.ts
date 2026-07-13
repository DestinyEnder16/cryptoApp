export type DocumentKind = 'selfie' | 'document_front' | 'document_back';

// React Native's FormData file shape (not the DOM File type).
export interface UploadFile {
  uri: string;
  name: string;
  type: string;
}

export interface KycUploadRequest {
  file: UploadFile;
  documentKind: DocumentKind;
}

export interface KycUploadPayload {
  uploadId: string;
  provider: string;
  uploaded: boolean;
  directUpload: boolean;
  storageKey: string;
  publicUrl: string;
  publicId?: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
}

export interface KycUploadResponse {
  data: KycUploadPayload;
}

// KYC submission ----------------------------------------------------------

export type DocumentTypeValue = 'national_id' | 'passport' | 'drivers_license';

export interface KycSubmitRequest {
  legalName: string;
  country: string;
  documentType: DocumentTypeValue;
  documentNumber: string;
  selfieImageUrl: string;
  documentImageUrl: string;
  documentBackImageUrl?: string | null;
}

export interface KycSubmission {
  id: string;
  userId: string;
  legalName: string;
  country: string;
  documentType: string;
  documentNumber: string;
  selfieImageUrl: string;
  documentImageUrl: string;
  documentBackImageUrl: string | null;
  status: string;
  submittedAt: string;
  reviewedAt: string | null;
  reviewerNote: string | null;
}

export interface KycSubmitResponse {
  data: KycSubmission;
}
