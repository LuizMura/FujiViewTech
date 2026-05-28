import Image from "next/image";

type ImageUploadProps = {
  id: string;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl?: string;
};

export default function ImageUpload({
  id,
  label,
  onChange,
  previewUrl,
}: ImageUploadProps) {
  return (
    <>
      <label className="block text-[#bfc7d5] mb-1" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        type="file"
        accept="image/*"
        onChange={onChange}
        className="w-full bg-[#18181b] text-white px-3 py-2 rounded-lg border border-[#4b6b57] focus:outline-none"
      />

      {previewUrl && (
        <div className="mt-3 flex items-center gap-2">
          <Image
            src={previewUrl}
            alt="Preview"
            width={128}
            height={128}
            unoptimized
            className="max-h-32 h-auto w-auto rounded border border-[#4b6b57]"
          />
        </div>
      )}
    </>
  );
}
