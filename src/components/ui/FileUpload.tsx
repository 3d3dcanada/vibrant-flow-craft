import { cn } from '@/lib/utils';
import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { NeonButton } from './NeonButton';

interface FileUploadProps {
    accept: string; // e.g., '.stl,.3mf'
    maxSize: number; // bytes
    onUpload: (file: File) => Promise<void>;
    onAnalysis?: (analysis: FileAnalysis) => void;
    className?: string;
}

export interface FileAnalysis {
    weight: number; // grams
    dimensions: { x: number; y: number; z: number }; // mm
    estimatedPrintTime: number; // hours
    volume: number; // mm³
}

type UploadState = 'idle' | 'dragover' | 'uploading' | 'success' | 'error';

/**
 * FileUpload Component
 * Drag-and-drop file upload with validation
 */
export function FileUpload({
    accept,
    maxSize,
    onUpload,
    onAnalysis,
    className,
}: FileUploadProps) {
    const [state, setState] = useState<UploadState>('idle');
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string>('');
    const [progress, setProgress] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File): string | null => {
        // Check file extension
        const extension = '.' + file.name.split('.').pop()?.toLowerCase();
        const acceptedExtensions = accept.split(',').map(ext => ext.trim().toLowerCase());

        if (!acceptedExtensions.includes(extension)) {
            return `Invalid file type. Please upload ${accept} files only.`;
        }

        // Check file size
        if (file.size > maxSize) {
            const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0);
            return `File too large. Maximum size is ${maxSizeMB}MB.`;
        }

        return null;
    };

    const handleFile = async (file: File) => {
        const validationError = validateFile(file);
        if (validationError) {
            setError(validationError);
            setState('error');
            // Shake animation
            setTimeout(() => setState('idle'), 2000);
            return;
        }

        setFile(file);
        setState('uploading');
        setProgress(0);

        try {
            // Simulate progress (replace with actual upload progress if available)
            const progressInterval = setInterval(() => {
                setProgress(prev => Math.min(prev + 10, 90));
            }, 200);

            await onUpload(file);

            clearInterval(progressInterval);
            setProgress(100);
            setState('success');
        } catch (err) {
            setState('error');
            setError(err instanceof Error ? err.message : 'Upload failed');
            setTimeout(() => setState('idle'), 3000);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setState('idle');

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            handleFile(droppedFile);
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setState('dragover');
    };

    const handleDragLeave = () => {
        setState('idle');
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            handleFile(selectedFile);
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleCancel = () => {
        setFile(null);
        setState('idle');
        setProgress(0);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    return (
        <div className={cn('w-full', className)}>
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={handleInputChange}
                className="hidden"
                aria-label="File upload input"
            />

            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={state === 'idle' || state === 'dragover' ? handleClick : undefined}
                className={cn(
                    'relative border-2 border-dashed rounded-xl p-8',
                    'transition-all duration-300 ease-out',
                    state === 'idle' && 'border-border bg-background/50 cursor-pointer hover:border-secondary/50 hover:bg-background/70',
                    state === 'dragover' && 'border-secondary bg-secondary/10 scale-[1.02] shadow-neon-teal cursor-pointer',
                    state === 'uploading' && 'border-border bg-background/50',
                    state === 'success' && 'border-success bg-success/10',
                    state === 'error' && 'border-destructive bg-destructive/10 animate-[shake_0.3s_ease-in-out]'
                )}
            >
                {/* Idle/Dragover State */}
                {(state === 'idle' || state === 'dragover') && (
                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                        <Upload className={cn(
                            'w-12 h-12 transition-colors',
                            state === 'dragover' ? 'text-secondary' : 'text-muted-foreground'
                        )} />
                        <div>
                            <p className="text-lg font-tech font-semibold text-foreground">
                                {state === 'dragover' ? 'Drop file here' : 'Drop file here or click to browse'}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Accepts {accept} files (max {(maxSize / (1024 * 1024)).toFixed(0)}MB)
                            </p>
                        </div>
                    </div>
                )}

                {/* Uploading State */}
                {state === 'uploading' && file && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <File className="w-8 h-8 text-secondary shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                                </p>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCancel();
                                }}
                                className="text-muted-foreground hover:text-destructive transition-colors"
                                aria-label="Cancel upload"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-secondary to-secondary-glow transition-all duration-300 shadow-glow-sm"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                            Uploading... {progress}%
                        </p>
                    </div>
                )}

                {/* Success State */}
                {state === 'success' && file && (
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-8 h-8 text-success shrink-0 animate-scale-in" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                            <p className="text-xs text-success">Upload complete!</p>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCancel();
                            }}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                            aria-label="Remove file"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Error State */}
                {state === 'error' && (
                    <div className="flex items-center gap-3">
                        <AlertCircle className="w-8 h-8 text-destructive shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-destructive">Upload failed</p>
                            <p className="text-xs text-muted-foreground mt-1">{error}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Add shake animation to tailwind config if not present
// @keyframes shake {
//   0%, 100% { transform: translateX(0); }
//   25% { transform: translateX(-10px); }
//   75% { transform: translateX(10px); }
// }

export default FileUpload;
