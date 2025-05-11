
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

interface FileUploadProps {
  label: string;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in MB
  onFilesSelected: (files: File[]) => void;
}

const FileUpload = ({
  label,
  accept = "*/*",
  multiple = false,
  maxFiles = 10,
  maxSize = 10, // Default 10MB
  onFilesSelected,
}: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const validateFiles = (files: File[]): File[] => {
    return Array.from(files).filter((file) => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the maximum size of ${maxSize}MB`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = e.dataTransfer.files;
      
      if (!multiple && droppedFiles.length > 1) {
        toast({
          title: "Too many files",
          description: "Only one file can be uploaded at a time",
          variant: "destructive",
        });
        return;
      }

      if (multiple && droppedFiles.length > maxFiles) {
        toast({
          title: "Too many files",
          description: `Maximum ${maxFiles} files can be uploaded at once`,
          variant: "destructive",
        });
        return;
      }

      const validFiles = validateFiles(Array.from(droppedFiles));
      if (validFiles.length > 0) {
        setSelectedFiles(validFiles);
        onFilesSelected(validFiles);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = e.target.files;
      
      if (multiple && selectedFiles.length > maxFiles) {
        toast({
          title: "Too many files",
          description: `Maximum ${maxFiles} files can be uploaded at once`,
          variant: "destructive",
        });
        return;
      }

      const validFiles = validateFiles(Array.from(selectedFiles));
      if (validFiles.length > 0) {
        setSelectedFiles(validFiles);
        onFilesSelected(validFiles);
      }
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const fileCount = selectedFiles.length;

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
          isDragging
            ? "border-primary bg-primary/10"
            : "border-gray-300 hover:border-primary/50"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
        />
        
        <div className="space-y-4">
          <div className="mx-auto bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center">
            <Upload size={24} className="text-gray-500" />
          </div>
          <div>
            <p className="text-gray-700 font-medium mb-1">{label}</p>
            <p className="text-sm text-gray-500">
              Drag and drop {multiple ? "files" : "a file"}, or click to select
            </p>
          </div>
          <Button variant="outline" onClick={handleButtonClick}>
            Select {multiple ? "Files" : "File"}
          </Button>
        </div>
      </div>

      {fileCount > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            {fileCount} {fileCount === 1 ? "file" : "files"} selected
          </p>
          <ul className="space-y-1 max-h-32 overflow-y-auto text-sm">
            {Array.from(selectedFiles).map((file, index) => (
              <li
                key={index}
                className="bg-gray-50 border border-gray-200 rounded px-3 py-2 flex justify-between"
              >
                <span className="truncate">{file.name}</span>
                <span className="text-gray-500 text-xs">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
