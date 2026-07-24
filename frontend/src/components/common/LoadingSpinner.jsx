function LoadingSpinner({ message = 'Loading...' }) {
    return (
        <div className="bg-white min-h-screen flex items-center justify-center">
            <div className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 animate-pulse">
                {message}
            </div>
        </div>
    );
}