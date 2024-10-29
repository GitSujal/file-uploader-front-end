// API Types based on the OpenAPI specification
export interface Dataset {
  dataset_name: string;
  table_name: string | null;
  file_prefix: string | null;
  file_suffix: string | null;
}

export enum ColumnDtypes {
  Decimal = 'Decimal',
  Integer = 'Integer',
  String = 'String',
  Date = 'Date',
  DateTime = 'DateTime',
  Boolean = 'Boolean',
  Float = 'Float',
  Double = 'Double',
  Long = 'Long',
  Binary = 'Binary',
  Array = 'Array',
  Map = 'Map',
  Struct = 'Struct'
}

export enum Sensitivity {
  PII = 'PII',
  SENSITIVE = 'SENSITIVE',
  INTERNAL = 'INTERNAL',
  PUBLIC = 'PUBLIC'
}

export enum ColumnExtraActions {
  HASH = 'HASH',
  MASK = 'MASK',
  ENCRYPT = 'ENCRYPT',
  REDACT = 'REDACT',
  NONE = 'NONE'
}

export interface Column {
  column_Name: string;
  column_type: ColumnDtypes;
  description: string | null;
  is_nullable: boolean;
  is_primary_key: boolean;
  is_sort_key: boolean;
  sensitivity: Sensitivity;
  extra_action?: ColumnExtraActions | null;
}

export enum WriteMode {
  APPEND = 'APPEND',
  OVERWRITE = 'OVERWRITE',
  MERGE = 'MERGE'
}

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  FAILED = 'FAILED',
  STOPPED = 'STOPPED'
}

export interface Table {
  dataset_name: string;
  table_name: string;
  description?: string | null;
  file_prefix?: string | null;
  file_suffix?: string | null;
  owner?: string | null;
  columns: Column[];
  write_mode?: WriteMode;
  last_updated?: string;
  last_updated_by?: string | null;
  num_rows?: number | null;
  last_refreshed?: string | null;
  status?: Status;
}