// frontend/src/components/SellerApply/StepProgress.jsx
function StepProgress({ currentStep, totalSteps = 3 }) {
    const steps = [
        { number: 1, label: 'Shop Info' },
        { number: 2, label: 'Identity' },
        { number: 3, label: 'Documents' },
    ];

    return (
        <div className="flex items-center justify-between mb-8">
            {steps.slice(0, totalSteps).map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                    <div className={`flex items-center gap-3 ${currentStep >= step.number ? 'text-black' : 'text-gray-300'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                            currentStep >= step.number ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'
                        }`}>
                            {step.number}
                        </div>
                        <span className={`text-xs font-medium hidden sm:block ${
                            currentStep >= step.number ? 'text-black' : 'text-gray-400'
                        }`}>
                            {step.label}
                        </span>
                    </div>
                    {index < totalSteps - 1 && (
                        <div className={`flex-1 h-px mx-4 transition-colors ${
                            currentStep > step.number ? 'bg-black' : 'bg-gray-200'
                        }`} />
                    )}
                </div>
            ))}
        </div>
    );
}

export default StepProgress;