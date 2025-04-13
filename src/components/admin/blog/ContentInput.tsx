import React, { useRef } from "react";
import { Label } from "../../ui/label";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Edit3, FileText, Eye, Upload } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ContentInputProps {
  contentInputMethod: "editor" | "upload";
  onContentInputMethodChange: (value: "editor" | "upload") => void;
  content: string;
  onContentChange: (value?: string) => void;
  markdownFile: File | null;
  onMarkdownFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditingUploadedContent: boolean;
  setIsEditingUploadedContent: (value: boolean) => void;
}

const ContentInput: React.FC<ContentInputProps> = ({
  contentInputMethod,
  onContentInputMethodChange,
  content,
  onContentChange,
  markdownFile,
  onMarkdownFileChange,
  isEditingUploadedContent,
  setIsEditingUploadedContent,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Content Input Method</Label>
        <RadioGroup
          value={contentInputMethod}
          onValueChange={(value) =>
            onContentInputMethodChange(value as "editor" | "upload")
          }
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="editor" id="editor" />
            <Label
              htmlFor="editor"
              className="flex items-center cursor-pointer"
            >
              <Edit3 className="h-4 w-4 mr-2" /> Use Editor
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="upload" id="upload" />
            <Label
              htmlFor="upload"
              className="flex items-center cursor-pointer"
            >
              <FileText className="h-4 w-4 mr-2" /> Upload Markdown File
            </Label>
          </div>
        </RadioGroup>
      </div>

      {contentInputMethod === "editor" ? (
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <div className="min-h-[500px]" data-color-mode="light">
            <MDEditor
              value={content}
              onChange={onContentChange}
              height={500}
              preview="edit"
              placeholder="Write your blog post content here using Markdown..."
              enableScroll={true}
              fullscreen={false}
              previewOptions={{
                remarkPlugins: [remarkGfm],
              }}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="markdownFile">Upload Markdown File</Label>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-2">
              <Input
                type="file"
                id="markdownFile"
                ref={fileInputRef}
                accept=".md,.markdown,text/markdown"
                onChange={onMarkdownFileChange}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4" /> Upload
              </Button>
            </div>
            {markdownFile && (
              <div className="flex items-center p-2 bg-green-50 border border-green-200 rounded-md">
                <FileText className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm text-green-700">
                  {markdownFile.name} ({Math.round(markdownFile.size / 1024)}{" "}
                  KB)
                </span>
              </div>
            )}
            {content &&
              contentInputMethod === "upload" &&
              !isEditingUploadedContent && (
                <div className="p-4 border rounded-md bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-500">
                      Preview of uploaded content:
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => setIsEditingUploadedContent(true)}
                    >
                      <Edit3 className="h-3 w-3" /> Edit Content
                    </Button>
                  </div>
                  <div className="max-h-[200px] overflow-auto p-2 border rounded-md bg-white text-sm">
                    <div className="prose prose-sm markdown-body">
                      <pre className="whitespace-pre-wrap">
                        {content.substring(0, 500)}
                        {content.length > 500 ? "..." : ""}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            {content &&
              contentInputMethod === "upload" &&
              isEditingUploadedContent && (
                <div className="p-4 border rounded-md bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-500">
                      Edit uploaded content:
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => setIsEditingUploadedContent(false)}
                    >
                      <Eye className="h-3 w-3" /> View Preview
                    </Button>
                  </div>
                  <div className="min-h-[400px]" data-color-mode="light">
                    <MDEditor
                      value={content}
                      onChange={onContentChange}
                      height={400}
                      preview="edit"
                      enableScroll={true}
                      fullscreen={false}
                      previewOptions={{
                        remarkPlugins: [remarkGfm],
                      }}
                    />
                  </div>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentInput;
