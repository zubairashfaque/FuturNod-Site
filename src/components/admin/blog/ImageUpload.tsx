import React, { useRef } from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Upload, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  featuredImage: string;
  imagePreview: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  featuredImage,
  imagePreview,
  onInputChange,
  onFileChange,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="featuredImage">Featured Image</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Input
              id="featuredImage"
              name="featuredImage"
              value={featuredImage}
              onChange={onInputChange}
              placeholder="Enter image URL"
              className="flex-1"
            />
            <div className="relative">
              <Input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={onFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" /> Upload
              </Button>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Enter a URL or upload an image from your device
          </p>
        </div>

        <div>
          {(featuredImage || imagePreview) && (
            <div className="mt-2 border rounded-md overflow-hidden w-full max-w-xs">
              <img
                src={imagePreview || featuredImage}
                alt="Featured preview"
                className="w-full h-auto object-cover max-h-[200px]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/300x200?text=Invalid+Image+URL";
                }}
              />
            </div>
          )}
          {!featuredImage && !imagePreview && (
            <div className="flex flex-col items-center justify-center border border-dashed rounded-md p-6 h-[200px]">
              <ImageIcon className="h-12 w-12 text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">No image selected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
