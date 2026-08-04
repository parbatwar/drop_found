// frontend/src/components/common/VerificationBadge.jsx
export function VerificationBadge({ type, showLabel = true, size = 'sm' }) {
  const config = {
    thrift: {
      className: 'badge-thrift',
      label: 'Thrift Verified',
      icon: '🌿',
    },
    retail: {
      className: 'badge-retail',
      label: 'Retail Verified',
      icon: '🏢',
    },
  };

  const { className, label, icon } = config[type];

  return (
    <span 
      className={`${className} ${size === 'sm' ? 'text-xs px-2.5 py-1' : 'text-sm px-3 py-1.5'} animate-scale-in`}
      style={{ animationDelay: '0.1s' }}
    >
      <span className="text-base">{icon}</span>
      {showLabel && <span>{label}</span>}
    </span>
  );
}