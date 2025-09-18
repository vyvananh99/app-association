import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/vi'; // nếu muốn tiếng Việt
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const CommonDatePicker = ({ field, form, label, size = 'small', format = 'DD/MM/YYYY', ...props }) => {
  const { name, value } = field;
  const { touched, errors, setFieldValue } = form;

  const error = touched[name] && !!errors[name];
  const helperText = touched[name] && errors[name];

  return (
    <DatePicker
      label={label}
      format={format}
      value={value ? dayjs(value) : null}
      onChange={(date) => {
        setFieldValue(name, date ? date.toISOString() : '');
      }}
      slotProps={{
        textField: {
          fullWidth: true,
          size,
          InputLabelProps: { shrink: true },
          error,
          helperText,
        }
      }}
      {...props}
    />
  );
};

export default CommonDatePicker;
