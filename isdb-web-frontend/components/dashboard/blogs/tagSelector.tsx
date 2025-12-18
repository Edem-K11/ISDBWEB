'use client';

import { Tag } from '@/lib/types/tag';

interface TagSelectorProps {
  tags: Tag[];
  selectedTags: number[];
  onChange: (tagIds: number[]) => void;
}

export default function TagSelector({ tags, selectedTags, onChange }: TagSelectorProps) {
  const toggleTag = (tagId: number) => {
    if (selectedTags.includes(tagId)) {
      onChange(selectedTags.filter((id) => id !== tagId));
    } else {
      onChange([...selectedTags, tagId]);
    }
  };

  return (
    <div>
      <p className="text-sm text-gray-600 mb-4">
        Sélectionnez une ou plusieurs catégories pour votre article
      </p>
      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => {
          const isSelected = selectedTags.includes(tag.id);
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isSelected
                  ? 'ring-2 ring-offset-2 scale-105'
                  : 'hover:scale-105'
              }`}
              // style={{
              //   backgroundColor: isSelected ? tag.couleur : `${tag.couleur}20`,
              //   color: isSelected ? 'white' : tag.couleur,
              //   ringColor: tag.couleur,
              // }}
            >
              {tag.nom}
            </button>
          );
        })}
      </div>
      {selectedTags.length === 0 && (
        <p className="text-red-500 text-sm mt-4">
          Veuillez sélectionner au moins un tag
        </p>
      )}
    </div>
  );
}