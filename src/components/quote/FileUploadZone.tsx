import { cn } from "@/lib/utils";
import { Upload, FileCheck, AlertCircle, Loader2 } from "lucide-react";
import { useState, useCallback, useRef } from "react";

interface FileUploadZoneProps {
    onFileSelect: (file: File) => void;
    acceptedFormats?: string[];
    maxSizeMB?: number;
    className?: string;
}

type UploadState = 'idle' | 'dragging' | 'uploading' | 'success' | 'error';

const ACCEPTED_EXTENSIONS = ['.stl', '.3mf', '.obj'];

export function FileUploadZone({
    onFileSelect,
    acceptedFormats = ACCEPTED_EXTENSIONS,
    maxSizeMB = 100,
    className
}: FileUploadZoneProps) {
    const [state, setState] = useState<UploadState>('idle');
    const [fileName, setFileName] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const validateFile = useCallback((file: File): { valid: boolean; error?: string } => {
        // Check extension
        const ext = '.' + file.name.split('.').pop()?.toLowerCase();
        if (!acceptedFormats.includes(ext)) {
            return { valid: false, error: `Invalid format. Accepted: ${acceptedFormats.join(', ')}` };
        }

        // Check size
        const sizeMB = file.size / (1024 * 1024);
        if (sizeMB > maxSizeMB) {
            return { valid: false, error: `File too large. Maximum: ${maxSizeMB}MB` };
        }

        return { valid: true };
    }, [acceptedFormats, maxSizeMB]);

    const handleFile = useCallback((file: File) => {
        const validation = validateFile(file);
        if (!validation.valid) {
            setState('error');
            setErrorMessage(validation.error || 'Invalid file');
            return;
        }

        setState('uploading');
        setFileName(file.name);

        // Simulate upload progress
        setTimeout(() => {
            setState('success');
            onFileSelect(file);
        }, 800);
    }, [validateFile, onFileSelect]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setState('idle');

        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    }, [handleFile]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setState('dragging');
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setState('idle');
    }, []);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    }, [handleFile]);

    const handleClick = useCallback(() => {
        inputRef.current?.click();
    }, []);

    const handleReset = useCallback(() => {
        setState('idle');
        setFileName(null);
        setErrorMessage(null);
        if (inputRef.current) inputRef.current.value = '';
    }, []);

    return (
        <div
            className={cn(
                "panel-card relative overflow-hidden cursor-pointer",
                "min-h-[200px] flex flex-col items-center justify-center gap-4",
                "transition-all duration-300",
                {
                    'border-secondary shadow-glow-sm': state === 'dragging',
                    'border-success/50 bg-success/5': state === 'success',
                    'border-destructive/50 bg-destructive/5': state === 'error',
                },
                className
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={state === 'idle' || state === 'error' ? handleClick : undefined}
            role="button"
            tabIndex={0}
            aria-label="Upload 3D model file"
        >
            {/* Hidden input */}
            <input
                ref={inputRef}
                type="file"
                accept={acceptedFormats.join(',')}
                onChange={handleInputChange}
                className="hidden"
                aria-hidden="true"
            />

            {/* State-based content */}
            {state === 'idle' && (
                <>
                    <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
                        <Upload className="w-8 h-8 text-secondary" />
                    </div>
                    <div className="text-center">
                        <p className="font-tech font-semibold text-lg text-foreground">
                            Drop your 3D model here
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            or click to browse
                        </p>
                    </div>
                    <div className="flex gap-2 mt-2">
                        {acceptedFormats.map((format) => (
                            <span
                                key={format}
                                className="px-2 py-1 text-xs font-tech bg-muted rounded-md text-muted-foreground"
                            >
                                {format.toUpperCase()}
                            </span>
                        ))}
                    </div>
                </>
            )}

            {state === 'dragging' && (
                <>
                    <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center animate-pulse">
                        <Upload className="w-8 h-8 text-secondary" />
                    </div>
                    <p className="font-tech font-semibold text-lg text-secondary">
                        Drop to upload
                    </p>
                </>
            )}

            {state === 'uploading' && (
                <>
                    <Loader2 className="w-12 h-12 text-secondary animate-spin" />
                    <p className="font-tech font-semibold text-foreground">
                        Processing {fileName}...
                    </p>
                </>
            )}

            {state === 'success' && (
                <>
                    <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center">
                        <FileCheck className="w-8 h-8 text-success" />
                    </div>
                    <div className="text-center">
                        <p className="font-tech font-semibold text-lg text-success">
                            {fileName}
                        </p>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleReset(); }}
                            className="text-sm text-muted-foreground hover:text-secondary mt-2 underline"
                        >
                            Upload different file
                        </button>
                    </div>
                </>
            )}

            {state === 'error' && (
                <>
                    <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-destructive" />
                    </div>
                    <div className="text-center">
                        <p className="font-tech font-semibold text-destructive">
                            {errorMessage}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Click to try again
                        </p>
                    </div>
                </>
            )}

            {/* Scan line effect */}
            {(state === 'idle' || state === 'dragging') && (
                <div className="scanner-line" />
            )}
        </div>
    );
}
