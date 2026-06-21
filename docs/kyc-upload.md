# How KYC Document Upload Works

The goal: let a user pick a photo of their ID document and send it to the server, which stores it (in Cloudinary) and returns a hosted URL.

## Two ways to upload — and which we picked

The API's `/auth/kyc/uploads` endpoint supports **two** styles:

| Pattern | How it works | When to use |
|---|---|---|
| **1. Direct multipart** *(what we use)* | App sends the file straight to our API; the API uploads it to Cloudinary | Simple, one request, server handles everything |
| **2. Signed/presigned** | API returns a signed URL; app uploads the file directly to Cloudinary itself | Large files / high scale, to keep traffic off our server |

We chose **Pattern 1** because the API docs recommend it and a few KYC photos don't need the extra complexity of Pattern 2.

> The JSON body schema you may see in the API docs (`fileName` / `contentType` / `documentKind` with no file) is **Pattern 2**. We don't use that path.

## The moving parts

| Piece | File | What it does |
|---|---|---|
| Picker + screen | `src/components/screens/kyc/process/UploadScreen.tsx` | Lets the user pick a file and triggers the upload |
| API endpoint | `src/store/api/kycApi.ts` | `POST /auth/kyc/uploads` as multipart, via RTK Query |
| Types | `src/types/kyc/types.ts` | Request/response shapes + `DocumentKind` |

## The flow — step by step

### Step 1 — Pick a file

`pickDocument()` uses `expo-document-picker`:

```ts
const result = await DocumentPicker.getDocumentAsync({
  type: 'image/*',           // JPG / PNG only
  copyToCacheDirectory: true,
});
if (!result.canceled) setDocument(result.assets[0]);
```

The picked file (uri, name, mime type) is held in local state and its name is shown in the dropzone.

### Step 2 — Build the upload request

When the user taps **Upload and continue**, `handleUpload()` calls the RTK Query mutation with the file and which part of the document it is:

```ts
await uploadKycDocument({
  file: {
    uri: document.uri,
    name: document.name,
    type: document.mimeType ?? 'image/jpeg',
  },
  documentKind: PARTS[activePart].documentKind, // 'document_front' | 'document_back' | 'selfie'
}).unwrap();
```

### Step 3 — Send as multipart/form-data

Inside `kycApi.ts`, the mutation builds a `FormData` body:

```ts
const form = new FormData();
form.append('file', file as unknown as Blob); // React Native file shape
form.append('documentKind', documentKind);
return { url: 'auth/kyc/uploads', method: 'POST', body: form };
```

**Key rule:** never set the `Content-Type` header yourself. `fetch` automatically adds the correct `multipart/form-data; boundary=...` header — setting it manually breaks the upload.

### Step 4 — Server stores it and replies

The API uploads the bytes to Cloudinary and returns a `publicUrl` plus metadata (`uploadId`, `storageKey`, `sizeBytes`, etc.). `transformResponse` unwraps `response.data`.

### Step 5 — Feedback and next screen

On success, a toast confirms the upload and the app navigates to the selfie step. On failure, an error toast is shown. While in flight, the button reads "Uploading…" and is disabled.

## A couple of React Native quirks

- **The file object isn't a real `File`.** React Native's `FormData` accepts a plain `{ uri, name, type }` object. TypeScript doesn't know this, hence the `as unknown as Blob` cast and our own `UploadFile` type.
- **Auth is automatic.** The bearer token (and transparent refresh — see [token-refresh.md](token-refresh.md)) is handled by `baseApi.ts`, so the upload endpoint doesn't deal with auth at all.

## Mental model in one sentence

> Pick an image → send it as multipart form-data to our API → the API stores it in Cloudinary and returns a URL → toast + move to the next step.
