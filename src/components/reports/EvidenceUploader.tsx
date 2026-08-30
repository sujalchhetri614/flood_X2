import { useRef } from 'react';
import { Camera, FileVideo, X } from 'lucide-react';

interface EvidenceUploaderProps {
  photo: File | null;
  video: File | null;
  photoPreview: string | null;
  onPhotoChange: (file: File | null) => void;
  onVideoChange: (file: File | null) => void;
}

export default function EvidenceUploader({
  photo,
  video,
  photoPreview,
  onPhotoChange,
  onVideoChange,
}: EvidenceUploaderProps) {
  const photoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-3">
      <span className="text-sm font-medium text-ink">Upload Evidence (optional)</span>
      <div className="flex flex-wrap gap-3">
        <input
          ref={photoRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onPhotoChange(e.target.files?.[0] ?? null)}
        />
        <input
          ref={videoRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => onVideoChange(e.target.files?.[0] ?? null)}
        />

        <button
          type="button"
          onClick={() => photoRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-blue-primary hover:bg-blue-light"
        >
          <Camera className="h-4 w-4 text-blue-primary" aria-hidden="true" />
          Add Photo
        </button>
        <button
          type="button"
          onClick={() => videoRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-blue-primary hover:bg-blue-light"
        >
          <FileVideo className="h-4 w-4 text-blue-primary" aria-hidden="true" />
          Add Video
        </button>
      </div>

      {photo && photoPreview && (
        <div className="relative inline-block">
          <img src={photoPreview} alt="Evidence preview" className="h-28 w-28 rounded-xl border border-border object-cover" />
          <button
            type="button"
            onClick={() => onPhotoChange(null)}
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-risk-critical text-white shadow-sm"
            aria-label="Remove photo"
          >
            <X className="h-4 w-4" />
          </button>
          <p className="mt-1 max-w-[7rem] truncate text-xs text-ink-muted">{photo.name}</p>
        </div>
      )}

      {video && (
        <div className="relative inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2">
          <FileVideo className="h-4 w-4 text-blue-primary" aria-hidden="true" />
          <span className="max-w-[10rem] truncate text-sm text-ink">{video.name}</span>
          <button
            type="button"
            onClick={() => onVideoChange(null)}
            className="flex h-5 w-5 items-center justify-center rounded-full bg-risk-critical text-white"
            aria-label="Remove video"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
