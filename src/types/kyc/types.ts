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
