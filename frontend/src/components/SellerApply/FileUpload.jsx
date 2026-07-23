// frontend/src/components/SellerApply/FileUpload.jsx
function FileUpload({ 
    label, 
    preview, 
    onUpload, 
    onRemove, 
    required = false,
    info = '',
    className = '',
    accept = 'image/jpeg,image/jpg,image/png,image/webp',
    isDocument = false,
}) {
    // ✅ For documents, accept PDF as well
    const getAccept = () => {
        if (isDocument) {
            return 'image/jpeg,image/jpg,image/png,image/webp,application/pdf';
        }
        return accept;
    };

    // ✅ Check if preview is a PDF placeholder
    const isPDF = preview === 'pdf-placeholder' || (preview && preview.endsWith('.pdf'));

    return (
        <div className={className}>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-gray-500 font-medium mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="flex items-center gap-4">
                <div className={`w-32 h-24 bg-gray-50 border-2 border-dashed border-gray-200 hover:border-black flex flex-col items-center justify-center cursor-pointer transition-colors relative flex-shrink-0 ${
                    preview ? 'border-solid border-black' : ''
                }`}>
                    {preview ? (
                        // ✅ Show preview for images, PDF icon for PDFs
                        isPDF ? (
                            <div className="flex flex-col items-center justify-center w-full h-full bg-red-50">
                                <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"/>
                                </svg>
                                <span className="text-[8px] text-red-500 mt-1">PDF</span>
                            </div>
                        ) : (
                            <img src={preview} alt={label} className="w-full h-full object-cover" />
                        )
                    ) : (
                        <>
                            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-[8px] text-gray-400 mt-1">Upload</span>
                            {isDocument && (
                                <span className="text-[6px] text-gray-400 mt-0.5">JPG, PNG, PDF</span>
                            )}
                        </>
                    )}
                    <input
                        type="file"
                        accept={getAccept()}
                        onChange={(e) => onUpload(e.target.files[0])}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    {info && <p className="text-sm text-gray-600">{info}</p>}
                    {preview && (
                        <button
                            type="button"
                            onClick={onRemove}
                            className="text-xs text-gray-400 hover:text-red-500 mt-1 transition-colors"
                        >
                            Remove
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// ✅ Make sure default export is present
export default FileUpload;