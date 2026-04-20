/**
 * FormField — reusable labeled input with error message display.
 */
export function FormField({ label, id, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

/**
 * Input — styled text input component.
 */
export function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900
        placeholder-gray-400 outline-none transition-all duration-150
        focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
        disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60
        ${className}`}
      {...props}
    />
  );
}

/**
 * Button — primary action button with loading state support.
 */
export function Button({ children, loading = false, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm',
    secondary: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold
        transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-60
        ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {children}
    </button>
  );
}

/**
 * AlertBanner — error / success message banner.
 */
export function AlertBanner({ message, type = 'error', onDismiss }) {
  if (!message) return null;
  const styles = {
    error: 'bg-red-50 border-red-200 text-red-700',
    success: 'bg-green-50 border-green-200 text-green-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700',
  };
  return (
    <div className={`flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${styles[type]}`}>
      <span className="mt-0.5 shrink-0">{type === 'error' ? '⚠' : '✔'}</span>
      <p className="flex-1">{message}</p>
      {onDismiss && (
        <button onClick={onDismiss} className="shrink-0 opacity-50 hover:opacity-100">✕</button>
      )}
    </div>
  );
}
