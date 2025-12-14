export type ColumnConfig<T> = {
  field: Extract<keyof T, string>
  header: string
  sortable?: boolean
  format?: 'date' | 'boolean' | 'capitalize' | 'truncate' | 'percentage'
  width?: string
  align?: 'left' | 'center' | 'right'
}
