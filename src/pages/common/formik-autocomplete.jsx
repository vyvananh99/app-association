import React from 'react';
import { useField, useFormikContext } from 'formik';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const FormikAutocomplete = ({
  name,
  options,
  getOptionLabel,
  label,
  size = 'small',
  fullWidth = true,
  sx,
  renderOption,
  onChange,
  filedName,
  inputHeight,
  disabled = false,
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);
  const filedNameCus = filedName ? filedName : 'id';

  // Tìm selected object đúng theo id
  const selectedOption =
    options?.find((opt) => {
      if (field.value === '' || field.value === null || field.value === undefined) return false;

      const optVal = opt[filedNameCus];
      const fieldVal = typeof field.value === 'object' ? field.value[filedNameCus] : field.value;

      return String(optVal) === String(fieldVal);
    }) || null;

  const onChangeLocal = (_, newValue) => {
    setFieldValue(name, newValue ? newValue[filedNameCus] : '');
  };

  return (
    <Autocomplete
      options={options || []}
      getOptionLabel={getOptionLabel}
      value={selectedOption}
      onChange={onChange ? onChange : onChangeLocal}
      isOptionEqualToValue={(option, value) => {
        if (value === '' || value === null || value === undefined) return false;

        const optVal = option[filedNameCus];
        const val = typeof value === 'object' ? value[filedNameCus] : value;

        return String(optVal) === String(val);
      }}
      renderOption={renderOption ?? undefined}
      sx={{
        ...(inputHeight && {
          '& .MuiOutlinedInput-root': {
            height: inputHeight
          }
        }),
        ...sx
      }}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          size={size}
          fullWidth={fullWidth}
          sx={{ backgroundColor: '#ffffff', ...sx }}
          error={meta.touched && Boolean(meta.error)}
          helperText={meta.touched && meta.error}
          slotProps={{
            inputLabel: { shrink: true }
          }}
        />
      )}
    />
  );
};

export default FormikAutocomplete;
