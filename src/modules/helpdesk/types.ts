export type HelpdeskFieldType = 'text' | 'email' | 'number' | 'textarea' | 'select' | 'date' | 'datetime' | 'list';

export type HelpdeskOption = { value: string; label: string };

export type HelpdeskFieldConfig = {
  key: string;
  label: string;
  type: HelpdeskFieldType;
  required?: boolean;
  options?: HelpdeskOption[];
  placeholder?: string;
  min?: number;
  max?: number;
  step?: string;
  defaultValue?: string | number | boolean;
};

export type HelpdeskColumnFormat = 'text' | 'status' | 'currency' | 'date' | 'datetime' | 'array' | 'boolean';

export type HelpdeskColumnConfig = {
  key: string;
  label: string;
  format?: HelpdeskColumnFormat;
};

export type HelpdeskFilterConfig = {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number';
  options?: HelpdeskOption[];
  placeholder?: string;
};

export type HelpdeskModuleConfig = {
  id: string;
  title: string;
  subtitle: string;
  apiPath: string;
  searchPlaceholder: string;
  fields: HelpdeskFieldConfig[];
  columns: HelpdeskColumnConfig[];
  filters?: HelpdeskFilterConfig[];
  readOnly?: boolean;
  supportsExport?: boolean;
  supportsCopy?: boolean;
  supportsConfirm?: boolean;
  exportPath?: string;
  defaultParams?: Record<string, any>;
};
