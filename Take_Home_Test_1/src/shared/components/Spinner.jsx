/**
 * Shared Loading Spinner component.
 * Usage: <Spinner size="md" />
 */
const sizeMap = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-4',
  lg: 'h-14 w-14 border-4',
};

export default function Spinner({ size = 'md', className = '' }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`
        animate-spin rounded-full border-current border-t-transparent
        ${sizeMap[size]} ${className}
      `}
    />
  );
}
