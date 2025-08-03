import { useState } from "react";

interface TagsInputProps {
  initialTags: string[];
  onTagsChange: (tags: string[]) => void;
  suggestions?: string[];
}

export function TagsInput({
  initialTags,
  onTagsChange,
  suggestions = [],
}: TagsInputProps) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState("");

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      const newTags = [...tags, tag];
      setTags(newTags);
      onTagsChange(newTags);
    }
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    onTagsChange(newTags);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="ml-1 text-blue-600 hover:text-blue-800"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag(inputValue.trim());
              setInputValue("");
            }
          }}
          className="w-full rounded border p-2"
          placeholder="Adicione tags..."
        />

        {suggestions.length > 0 && (
          <div className="absolute z-10 mt-1 w-full rounded border bg-white shadow-lg">
            {suggestions
              .filter((suggestion) => !tags.includes(suggestion))
              .map((suggestion) => (
                <div
                  key={suggestion}
                  onClick={() => {
                    addTag(suggestion);
                    setInputValue("");
                  }}
                  className="cursor-pointer p-2 hover:bg-gray-100"
                >
                  {suggestion}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
