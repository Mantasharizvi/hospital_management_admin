import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(function Select(
  { label, error, hint, options = [], placeholder = 'Select an option', className = '', id, value, ...props },
  ref
) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
  // Only fall back to an uncontrolled defaultValue when the caller isn't controlling this select.
  const valueProps = value !== undefined ? { value } : { defaultValue: '' };

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-ink-900 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          {...valueProps}
          className={`
            w-full appearance-none rounded-lg border bg-white text-ink-900 text-sm
            px-3.5 py-2.5 pr-10
            focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
            transition-colors duration-150
            ${error ? 'border-danger-600' : 'border-line'}
            ${className}
          `}
          aria-invalid={!!error}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none" />
      </div>
      {error && <p className="mt-1.5 text-xs text-danger-600">{error}</p>}
      {!error && hint && <p className="mt-1.5 text-xs text-ink-600">{hint}</p>}
    </div>
  );
});

export default Select;
