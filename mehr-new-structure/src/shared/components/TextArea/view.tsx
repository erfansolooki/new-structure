import type { ITextArea } from './types';
import styles from './style.module.scss';

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
  const wrapperClasses = [styles.wrapper, fullWidth && styles.fullWidth].filter(Boolean).join(' ');
  
  const labelClasses = [
    styles.label,
    required && styles.required,
    error && styles.error
  ].filter(Boolean).join(' ');

  const textareaClasses = [
    styles.textarea,
    styles[variant],
    error && styles.error
  ].filter(Boolean).join(' ');

  const helperClasses = [
    styles.helperText,
    error && styles.error
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses}>
      {label && (
        <label className={labelClasses}>
          {label}
        </label>
      )}
      <textarea
        className={textareaClasses}
        disabled={disabled}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error || helperText ? 'textarea-helper-text' : undefined}
        {...textareaProps}
      />
      {(error || helperText) && (
        <span id="textarea-helper-text" className={helperClasses}>
          {error || helperText}
        </span>
      )}
    </div>
  );
};