import React from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Checkbox } from "../../ui/checkbox";
import { Category, Tag, Author } from "../../../types/blog";

interface TextFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  placeholder: string;
  required?: boolean;
  rows?: number;
}

export const TextField = ({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  rows,
}: TextFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {rows ? (
        <Textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          required={required}
        />
      ) : (
        <Input
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
        />
      )}
    </div>
  );
};

interface CategorySelectProps {
  value: string;
  onValueChange: (value: string) => void;
  categories: Category[];
}

export const CategorySelect = ({
  value,
  onValueChange,
  categories,
}: CategorySelectProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="category">Category</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

interface AuthorSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  authors: Author[];
}

export const AuthorSelect = ({
  value,
  onValueChange,
  authors,
}: AuthorSelectProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="author">Author</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select an author" />
        </SelectTrigger>
        <SelectContent>
          {authors.map((author) => (
            <SelectItem key={author.id} value={author.id}>
              <div className="flex items-center gap-2">
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-5 h-5 rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback";
                  }}
                />
                {author.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

interface StatusSelectProps {
  value: "draft" | "published" | "scheduled";
  onValueChange: (value: "draft" | "published" | "scheduled") => void;
}

export const StatusSelect = ({ value, onValueChange }: StatusSelectProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="status">Status</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="published">Published</SelectItem>
          <SelectItem value="scheduled">Scheduled</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

interface TagsCheckboxGroupProps {
  tags: Tag[];
  selectedTagIds: string[];
  onTagChange: (tagId: string, checked: boolean) => void;
}

export const TagsCheckboxGroup = ({
  tags,
  selectedTagIds,
  onTagChange,
}: TagsCheckboxGroupProps) => {
  return (
    <div className="space-y-2">
      <Label>Tags</Label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {tags.map((tag) => (
          <div key={tag.id} className="flex items-center space-x-2">
            <Checkbox
              id={`tag-${tag.id}`}
              checked={selectedTagIds.includes(tag.id)}
              onCheckedChange={(checked) =>
                onTagChange(tag.id, checked as boolean)
              }
            />
            <Label htmlFor={`tag-${tag.id}`} className="cursor-pointer">
              {tag.name}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};
