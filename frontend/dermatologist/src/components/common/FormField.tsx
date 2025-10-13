import React from 'react';
import { Form, Input, Select, DatePicker, InputNumber, Switch, Radio, Checkbox } from 'antd';
import type { FormItemProps } from 'antd/es/form';

const { Option } = Select;
const { TextArea } = Input;

interface FormFieldProps extends Omit<FormItemProps, 'children'> {
  type?: 'input' | 'password' | 'email' | 'textarea' | 'select' | 'date' | 'datetime' | 'number' | 'switch' | 'radio' | 'checkbox';
  placeholder?: string;
  options?: Array<{ label: string; value: any }>;
  rows?: number;
  disabled?: boolean;
  required?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  type = 'input',
  placeholder,
  options = [],
  rows,
  disabled = false,
  required = false,
  ...formItemProps
}) => {
  const renderInput = () => {
    switch (type) {
      case 'password':
        return <Input.Password placeholder={placeholder} disabled={disabled} />;
      case 'email':
        return <Input type="email" placeholder={placeholder} disabled={disabled} />;
      case 'textarea':
        return <TextArea placeholder={placeholder} rows={rows} disabled={disabled} />;
      case 'select':
        return (
          <Select placeholder={placeholder} disabled={disabled}>
            {options.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        );
      case 'date':
        return (
          <DatePicker
            placeholder={placeholder}
            disabled={disabled}
            className="w-full"
            format="DD/MM/YYYY"
          />
        );
      case 'datetime':
        return (
          <DatePicker
            placeholder={placeholder}
            disabled={disabled}
            className="w-full"
            showTime
            format="DD/MM/YYYY HH:mm"
          />
        );
      case 'number':
        return <InputNumber placeholder={placeholder} disabled={disabled} className="w-full" />;
      case 'switch':
        return <Switch disabled={disabled} />;
      case 'radio':
        return (
          <Radio.Group disabled={disabled}>
            {options.map((option) => (
              <Radio key={option.value} value={option.value}>
                {option.label}
              </Radio>
            ))}
          </Radio.Group>
        );
      case 'checkbox':
        return (
          <Checkbox.Group disabled={disabled}>
            {options.map((option) => (
              <Checkbox key={option.value} value={option.value}>
                {option.label}
              </Checkbox>
            ))}
          </Checkbox.Group>
        );
      case 'input':
      default:
        return <Input placeholder={placeholder} disabled={disabled} />;
    }
  };

  return (
    <Form.Item
      {...formItemProps}
      rules={required ? [{ required: true, message: `${formItemProps.label} is required!` }] : formItemProps.rules}
    >
      {renderInput()}
    </Form.Item>
  );
};

export default FormField;
