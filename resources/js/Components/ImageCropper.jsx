import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { ZoomIn, ZoomOut, Crop, Image as ImageIcon, Sparkles, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

/**
 * Create image element from URL
 */
const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
    });

/**
 * Get cropped image as blob with smart compression
 */
async function getCroppedImg(imageSrc, pixelCrop, targetSize = 300) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas to target size
    canvas.width = targetSize;
    canvas.height = targetSize;

    // Draw cropped and resized image with high quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        targetSize,
        targetSize
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error('Canvas is empty'));
                    return;
                }
                resolve(blob);
            },
            'image/jpeg',
            0.92 // High quality initial render
        );
    });
}

/**
 * Smart compression to meet target size while maintaining quality
 */
async function compressImage(blob, maxSizeBytes = 1024 * 1024) {
    if (blob.size <= maxSizeBytes) {
        return blob;
    }

    const image = await createImage(URL.createObjectURL(blob));
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 300;
    canvas.height = 300;
    
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(image, 0, 0, 300, 300);

    // Progressive quality reduction to find optimal balance
    const qualities = [0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5];
    
    for (const quality of qualities) {
        const compressed = await new Promise((resolve) => {
            canvas.toBlob(resolve, 'image/jpeg', quality);
        });
        
        if (compressed.size <= maxSizeBytes) {
            return compressed;
        }
    }

    // Last resort compression
    return await new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', 0.5);
    });
}

/**
 * Format file size for display
 */
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export default function ImageCropper({ open, onClose, imageSrc, onCropComplete }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [previewSize, setPreviewSize] = useState(null);

    const onCropChange = (crop) => {
        setCrop(crop);
    };

    const onZoomChange = (value) => {
        setZoom(value[0]);
    };

    const onCropCompleteCallback = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        try {
            setProcessing(true);
            
            // Get cropped image
            const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels, 300);
            
            // Compress if needed
            const finalBlob = await compressImage(croppedBlob, 1024 * 1024);
            
            // Convert to File
            const file = new File([finalBlob], 'photo.jpg', { type: 'image/jpeg' });
            
            // Create preview URL
            const preview = URL.createObjectURL(finalBlob);
            
            onCropComplete(file, preview);
            onClose();
        } catch (error) {
            console.error('Error cropping image:', error);
            alert('Failed to process image. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    // Estimate file size on crop change
    const estimateSize = useCallback(async () => {
        if (!croppedAreaPixels) return;
        
        try {
            const cropped = await getCroppedImg(imageSrc, croppedAreaPixels, 300);
            const compressed = await compressImage(cropped, 1024 * 1024);
            setPreviewSize(compressed.size);
        } catch (error) {
            console.error('Error estimating size:', error);
        }
    }, [imageSrc, croppedAreaPixels]);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0">
                <DialogHeader className="p-4 sm:p-6 pb-0 pr-12 sm:pr-6">
                    <div className="flex items-start sm:items-center justify-between gap-2 sm:gap-3">
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                                <Crop className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <DialogTitle className="text-base sm:text-2xl truncate">Crop Your Photo</DialogTitle>
                                <DialogDescription className="hidden sm:block text-xs sm:text-sm">
                                    Position and zoom to create the perfect 300×300px passport photo
                                </DialogDescription>
                            </div>
                        </div>
                    </div>
                    {/* Crop & Continue Button - Below Title on Mobile, Top Right on Desktop */}
                    <div className="mt-3 sm:mt-0 sm:absolute sm:right-16 sm:top-6">
                        <Button 
                            type="button"
                            onClick={handleSave} 
                            disabled={processing}
                            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
                            size="sm"
                        >
                            {processing ? (
                                <>
                                    <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    <span>Crop & Continue</span>
                                </>
                            )}
                        </Button>
                    </div>
                </DialogHeader>
                
                <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-4">
                    {/* Main Cropper Area */}
                    <Card className="relative h-[300px] sm:h-[400px] bg-gray-900 rounded-xl overflow-hidden border-2 border-gray-700 shadow-2xl">
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={onCropChange}
                            onZoomChange={setZoom}
                            onCropComplete={onCropCompleteCallback}
                            style={{
                                containerStyle: {
                                    background: '#1a1a1a',
                                },
                                cropAreaStyle: {
                                    border: '2px solid #a855f7',
                                    boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)',
                                }
                            }}
                        />
                        
                        {/* Overlay Instructions */}
                        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 flex justify-between items-start pointer-events-none">
                            <Badge className="bg-purple-600 text-white border-0 shadow-lg text-xs">
                                <ImageIcon className="h-3 w-3 mr-1" />
                                300 × 300 px
                            </Badge>
                            {previewSize && (
                                <Badge className={`border-0 shadow-lg text-xs ${previewSize <= 1024 * 1024 ? 'bg-green-600' : 'bg-amber-600'} text-white`}>
                                    {previewSize <= 1024 * 1024 ? (
                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                    ) : (
                                        <Sparkles className="h-3 w-3 mr-1" />
                                    )}
                                    {formatFileSize(previewSize)}
                                </Badge>
                            )}
                        </div>
                    </Card>
                    
                    {/* Zoom Controls */}
                    <Card className="p-4 sm:p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-2">
                        <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ZoomOut className="h-4 sm:h-5 w-4 sm:w-5 text-muted-foreground" />
                                    <span className="text-xs sm:text-sm font-semibold text-muted-foreground">Zoom Level</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="font-mono text-xs">
                                        {(zoom * 100).toFixed(0)}%
                                    </Badge>
                                    <ZoomIn className="h-4 sm:h-5 w-4 sm:w-5 text-muted-foreground" />
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3 sm:gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 sm:h-10 sm:w-10 shrink-0"
                                    onClick={() => setZoom(Math.max(1, zoom - 0.1))}
                                >
                                    <ZoomOut className="h-3 sm:h-4 w-3 sm:w-4" />
                                </Button>
                                
                                <Slider
                                    value={[zoom]}
                                    onValueChange={onZoomChange}
                                    min={1}
                                    max={3}
                                    step={0.05}
                                    className="flex-1"
                                />
                                
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 sm:h-10 sm:w-10 shrink-0"
                                    onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                                >
                                    <ZoomIn className="h-3 sm:h-4 w-3 sm:w-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                    
                    {/* Instructions */}
                    <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4">
                        <div className="flex gap-2 sm:gap-3">
                            <Sparkles className="h-4 sm:h-5 w-4 sm:w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-xs sm:text-sm font-medium text-blue-900 dark:text-blue-100">
                                    Pro Tips for Perfect Photo
                                </p>
                                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                                    <li>• <strong>Drag</strong> the image to reposition</li>
                                    <li>• <strong>Zoom</strong> using slider or scroll wheel</li>
                                    <li>• Final image will be automatically compressed to under 1MB</li>
                                    <li className="hidden sm:list-item">• Ensure your face is centered and clearly visible</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
