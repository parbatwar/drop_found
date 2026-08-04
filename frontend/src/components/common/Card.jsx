// frontend/src/components/common/Card.jsx
export function Card({ variant = 'solid', className = '', children }) {
  const variants = {
    solid: 'card-solid',
    thrift: 'card-thrift',
    retail: 'card-retail',
    glass: 'card-glass',
  };

  return (
    <div className={`${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}