import type { ITextfield } from './types';
import styles from './style.module.scss';
import type { ChangeEvent } from 'react';

export const Textfield = ({
  label,
  error,
  helperText,
  fullWidth = false,
  variant = 'outlined',
  disabled,
  required,
  startIcon,
  endIcon,
  onChange,
  ...inputProps
}: ITextfield) => {
  const wrapperClasses = [styles.wrapper, fullWidth && styles.fullWidth].filter(Boolean).join(' ');

  const labelClasses = [styles.label, required && styles.required, error && styles.error]
    .filter(Boolean)
    .join(' ');

  const containerClasses = [
    styles.inputContainer,
    styles[variant],
    error && styles.error,
    disabled && styles.disabled,
  ]
    .filter(Boolean)
    .join(' ');

  const inputClasses = [
    styles.input,
    startIcon && styles.hasStartIcon,
    endIcon && styles.hasEndIcon,
  ]
    .filter(Boolean)
    .join(' ');

  const helperClasses = [styles.helperText, error && styles.error].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses}>
      {label && <label className={labelClasses}>{label}</label>}
      <div className={containerClasses}>
        {startIcon && <span className={`${styles.icon} ${styles.startIcon}`}>{startIcon}</span>}
        <input
          onChange={onChange}
          className={inputClasses}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error || helperText ? 'textfield-helper-text' : undefined}
          {...inputProps}
        />
        {endIcon && <span className={`${styles.icon} ${styles.endIcon}`}>{endIcon}</span>}
      </div>
      {(error || helperText) && (
        <span id="textfield-helper-text" className={helperClasses}>
          {error || helperText}
        </span>
      )}
    </div>
  );
};
