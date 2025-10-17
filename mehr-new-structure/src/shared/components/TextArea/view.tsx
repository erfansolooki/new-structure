import type { ITextArea } from './types';
import './TextArea.css';

export const TextArea = ({
  label,
  error,
  helperText,
  fullWidth = false,
  variant = 'outlined',
  disabled,
  required,
  ...textareaProps
}: ITextArea) => {
  return (
    <div className={`textarea-wrapper ${fullWidth ? 'full-width' : ''}`}>
      {label && (
        <label className={`textarea-label ${required ? 'required' : ''} ${error ? 'error' : ''}`}>
          {label}
        </label>
      )}
      <textarea
        className={`textarea ${variant} ${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`}
        disabled={disabled}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error || helperText ? 'textarea-helper-text' : undefined}
        {...textareaProps}
      />
      {(error || helperText) && (
        <span id="textarea-helper-text" className={`textarea-helper-text ${error ? 'error' : ''}`}>
          {error || helperText}
        </span>
      )}
    </div>
  );
};