import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadFile, findMatch } from '../api/client';

interface FileStatus {
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  match?: any;
}

const FileUploader: React.FC = () => {
  const [files, setFiles] = useState<FileStatus[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      status: 'pending' as const,
      progress: 0
    }));
    
    setFiles(prev => [...prev, ...newFiles]);

    for (const fileStatus of newFiles) {
      try {
        const match = await findMatch(fileStatus.file.name);
        fileStatus.match = match;
        
        await uploadFile(fileStatus.file.name, fileStatus.file);
        
        setFiles(prev => 
          prev.map(f => 
            f.file === fileStatus.file 
              ? { ...f, status: 'success' as const, progress: 100 }
              : f
          )
        );
        
        toast.success(`Successfully uploaded ${fileStatus.file.name}`);
      } catch (error) {
        setFiles(prev => 
          prev.map(f => 
            f.file === fileStatus.file 
              ? { ...f, status: 'error' as const }
              : f
          )
        );
        toast.error(`Failed to upload ${fileStatus.file.name}`);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 300 * 1024 * 1024, // 300MB
    maxFiles: 10
  });

  const removeFile = (file: File) => {
    setFiles(prev => prev.filter(f => f.file !== file));
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-500'}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drag and drop files here, or click to select files
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Up to 10 files, max 300MB each
        </p>
      </div>

      {files.length > 0 && (
        <div className="bg-white shadow rounded-lg divide-y">
          {files.map((fileStatus, index) => (
            <div key={index} className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {fileStatus.status === 'uploading' && (
                  <Loader2 className="h-5 w-5 text-indigo-500 animate-spin" />
                )}
                {fileStatus.status === 'success' && (
                  <Check className="h-5 w-5 text-green-500" />
                )}
                {fileStatus.status === 'error' && (
                  <X className="h-5 w-5 text-red-500" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {fileStatus.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(fileStatus.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  {fileStatus.match && (
                    <p className="text-xs text-indigo-600">
                      Matched dataset: {fileStatus.match.dataset_name}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => removeFile(fileStatus.file)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploader;