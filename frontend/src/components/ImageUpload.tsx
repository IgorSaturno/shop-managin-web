import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, Trash } from "lucide-react";

type ImageItem = {
  url: string;
  isNew: boolean;
};

interface ImageUploadProps {
  initialImages?: string[];
  onImagesChange: (newImages: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

export function ImageUpload({
  initialImages = [],
  onImagesChange,
  maxImages = 4,
  disabled = false,
}: ImageUploadProps) {
  const [files, setFiles] = useState<ImageItem[]>(
    initialImages.map((url) => ({ url, isNew: false })),
  );

  const dropzoneClasses = `border-2 border-dashed rounded-lg p-8 cursor-pointer ${
    disabled ? "bg-gray-100" : "hover:border-primary"
  } transition-colors`;

  useEffect(() => {
    const current = JSON.stringify(files.map((f) => f.url));
    const incoming = JSON.stringify(initialImages);

    if (current !== incoming) {
      setFiles(initialImages.map((url) => ({ url, isNew: false })));
    }
  }, [initialImages]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: useCallback(
      (acceptedFiles: File[]) => {
        if (disabled) return;

        const newItems = acceptedFiles.map((file) => ({
          url: URL.createObjectURL(file),
          isNew: true,
        }));

        setFiles((prev) => {
          const updated = [...prev, ...newItems].slice(0, maxImages);
          onImagesChange(updated.map((item) => item.url));
          return updated;
        });
      },
      [disabled, maxImages, onImagesChange],
    ),
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif", ".svg"] },
    disabled,
  });

  useEffect(() => {
    return () => {
      files.forEach(({ url, isNew }) => {
        if (isNew && url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [files]);

  const handleRemove = useCallback(
    (index: number) => {
      setFiles((prev) => {
        const updated = prev.filter((_, i) => i !== index);
        onImagesChange(updated.map((item) => item.url));
        return updated;
      });
    },
    [onImagesChange],
  );

  return (
    <div className="space-y-4">
      <div {...getRootProps()} className={dropzoneClasses}>
        <input {...getInputProps()} data-testid="file-input" />
        <div className="flex flex-col items-center gap-2">
          <UploadCloud
            className={`h-10 w-10 ${
              disabled ? "text-gray-400" : "text-gray-600"
            }`}
          />
          <p
            className={`text-center ${disabled ? "text-gray-400" : "text-gray-600"}`}
          >
            Arraste imagens ou clique para selecionar
          </p>
          <p className="text-sm text-gray-400">
            Formatos suportados: JPEG, PNG, GIF, SVG
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {files.map(({ url }, index) => (
          <div key={url} className="group relative">
            <img
              src={url}
              alt={`Pré-visualização ${index + 1}`}
              className="h-32 w-full rounded-lg border object-cover"
            />

            {!disabled && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black bg-opacity-0 transition-all group-hover:bg-opacity-50">
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Trash className="h-6 w-6" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
