'use client';
import React, { useCallback, useState } from 'react';
import { Upload as UploadIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { uploadSqlFile } from '../services/api';

interface UploadProps {
  onUploadSuccess: (data: any) => void;
}

export const Upload: React.FC<UploadProps> = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.sql')) {
      setError('Please upload a .sql file');
      toast.warning('Please upload a valid .sql file.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await uploadSqlFile(file);
      onUploadSuccess(data);
      toast.success('SQL file uploaded successfully!');
    } catch (err) {
      setError('Failed to process file. Check console for details.');
      console.error(err);
      toast.error('Failed to parse SQL. Please check the file format.');
    } finally {
      setIsLoading(false);
    }
  };

  const onDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50/10'
            : 'border-slate-300 dark:border-slate-700 hover:border-blue-400'
        }`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
            {isLoading ? (
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            ) : (
              <UploadIcon className="w-8 h-8 text-slate-500 dark:text-slate-400" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Upload Database Schema
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Drag & drop your .sql file here, or click to browse
            </p>
          </div>
          
          <input
            type="file"
            accept=".sql"
            className="hidden"
            id="file-upload"
            onChange={onInputChange}
            disabled={isLoading}
          />
          <label
            htmlFor="file-upload"
            className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Processing...' : 'Select File'}
          </label>
        </div>
      </div>
      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">
          {error}
        </div>
      )}
    </div>
  );
};
