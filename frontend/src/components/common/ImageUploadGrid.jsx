import { Icons } from '../Icons';

export function ImageUploadGrid({ images, onAdd, onRemove, maxCount = 6, className = '' }) {
    return (
        <div className={className}>
            <div className="grid grid-cols-3 gap-3">
                {images.map((img, index) => (
                    <div key={index} className="relative aspect-square bg-neutral-50 border border-neutral-200 overflow-hidden group">
                        <img src={img.previewUrl} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={() => onRemove(index)}
                            className="absolute top-2 right-2 w-6 h-6 bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                            <Icons.X className="w-3 h-3" />
                        </button>
                    </div>
                ))}

                {images.length < maxCount && (
                    <div 
                        onClick={onAdd}
                        className="aspect-square border-2 border-dashed border-neutral-200 hover:border-black flex flex-col items-center justify-center cursor-pointer transition-colors duration-300 bg-neutral-50"
                    >
                        <Icons.Upload className="w-6 h-6 text-neutral-300" />
                        <span className="text-[9px] tracking-[0.2em] uppercase text-neutral-400 mt-2">Add Image</span>
                    </div>
                )}
            </div>
        </div>
    );
}