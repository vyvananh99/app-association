import React, { useMemo, useEffect, useCallback, useRef } from 'react';
import { TextField } from '@mui/material';
import debounce from 'lodash/debounce';

const FormTextFieldShrink = ({
  field,
  form,
  sx = {},
  parseNumber,
  formatNumber,
  inputHeight,
  onChange,
  onDebouncedChange,
  debounceTime = 500,
  ...props
}) => {
  const { name, value } = field;
  const { touched, errors, setFieldValue } = form;

  const showError = touched[name] && Boolean(errors[name]);

  // Dùng useCallback để hàm luôn lấy state mới nhất
  const latestCallback = useRef(onDebouncedChange);
  useEffect(() => {
    latestCallback.current = onDebouncedChange;
  }, [onDebouncedChange]);

  const handleDebounced = useMemo(
    () =>
      debounce((val) => {
        if (latestCallback.current) {
          latestCallback.current(val);
        }
      }, debounceTime),
    [debounceTime]
  );

  useEffect(() => {
    return () => {
      handleDebounced.cancel();
    };
  }, [handleDebounced]);

  const handleChange = (e) => {
    let inputValue = e.target.value;

    if (parseNumber) {
      inputValue = parseNumber(inputValue);
    } else if (props.type === 'number') {
      inputValue = inputValue === '' ? '' : Number(inputValue);
    }

    // Update Formik ngay
    setFieldValue(name, inputValue);

    // Gọi onChange ngay (nếu có)
    if (onChange) {
      onChange(inputValue);
    }

    // Delay API call
    handleDebounced(inputValue);
  };

  return (
    <TextField
      {...field}
      {...props}
      value={formatNumber ? formatNumber(value ?? '') : (value ?? '')}
      onChange={handleChange}
      fullWidth
      error={showError}
      helperText={showError ? errors[name] : ''}
      InputLabelProps={{
        shrink: true
      }}
      sx={{
        ...(inputHeight && {
          '& .MuiOutlinedInput-root': {
            height: inputHeight
          }
        }),
        ...sx
      }}
    />
  );
};

export default FormTextFieldShrink;
