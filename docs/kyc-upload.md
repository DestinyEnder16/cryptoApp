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

## Variant: the live selfie

`SelfieScreen.tsx` reuses the **exact same upload mutation** — only the *source* of the image differs. Instead of picking a file, it captures a live photo from the camera:

```ts
await ImagePicker.requestCameraPermissionsAsync();   // camera, not gallery
const result = await ImagePicker.launchCameraAsync({
  cameraType: ImagePicker.CameraType.front,          // selfie = front camera
  mediaTypes: ['images'],
  quality: 0.7,
});
```

Then it uploads with `documentKind: 'selfie'`. The camera ring is the capture button; once a photo is taken it shows a preview and the label changes to "Tap to retake".

Why the camera and not a file picker? A KYC selfie must be a **live capture** — letting the user pick any image from their gallery would defeat the identity check.

> Uses `expo-image-picker` (camera permission comes from the existing `expo-camera` plugin in `app.json`). Adding this native module means the dev/EAS build must be rebuilt before it runs.

## Submitting the whole thing for review

Uploading a file just gets you a **hosted URL**. The actual KYC application is a separate, final step: `POST /auth/kyc` with all the collected data.

### How the URLs get there

Each upload screen saves its returned `publicUrl` into the `kyc` Redux slice:

| Screen | Saves to slice field |
|---|---|
| Upload (front / passport) | `documentImageUrl` |
| Upload (back) | `documentBackImageUrl` |
| Selfie | `selfieImageUrl` |

So by the time the user reaches **ReviewScreen**, the slice holds everything: text fields (entered earlier) + the three image URLs.

### The document-type translation

The slice stores the human label (`"National ID"`) because that's what the UI displays. The API wants the enum value (`national_id`). `documentTypeValueFromLabel()` in `src/constants/documentTypes.ts` converts it — and `documentTypes.ts` is the single source of truth shared by the bottom sheet and the review screen, so the label and value can never drift apart.

### ⚠️ Gotcha: never send `documentBackImageUrl: null`

The back image is optional. The intuitive thing is to send `documentBackImageUrl: null` when there's no back. **The API rejects that** with `400 INVALID_KYC_IMAGE_URL` — it tries to validate `null` as a URL.

The fix: **omit the field entirely** when there's no back image.

```ts
await submitKyc({
  legalName, country, documentType, documentNumber,
  selfieImageUrl, documentImageUrl,
  ...(documentBackImageUrl ? { documentBackImageUrl } : {}), // omit, don't null
});
```

(Another cause of the same error: passing made-up URLs like `example.com/...`. The URL has to be one the upload step actually returned.)

On success the slice is cleared (`resetKyc`) and the user goes to the pending-status screen.

## A couple of React Native quirks

- **The file object isn't a real `File`.** React Native's `FormData` accepts a plain `{ uri, name, type }` object. TypeScript doesn't know this, hence the `as unknown as Blob` cast and our own `UploadFile` type.
- **Auth is automatic.** The bearer token (and transparent refresh — see [token-refresh.md](token-refresh.md)) is handled by `baseApi.ts`, so the upload endpoint doesn't deal with auth at all.

## Mental model in one sentence

> Pick an image → send it as multipart form-data to our API → the API stores it in Cloudinary and returns a URL → toast + move to the next step.
