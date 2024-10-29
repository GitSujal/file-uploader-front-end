import React from 'react';
import { Table, Column, ColumnDtypes, Sensitivity, ColumnExtraActions } from '../../types/api';

interface ColumnEditorProps {
  schema: Table;
  onUpdate: (schema: Table) => void;
  loading: boolean;
}

export const ColumnEditor: React.FC<ColumnEditorProps> = ({
  schema,
  onUpdate,
  loading
}) => {
  const handleColumnUpdate = (index: number, updatedColumn: Column) => {
    const updatedSchema = {
      ...schema,
      columns: schema.columns.map((col, i) => 
        i === index ? updatedColumn : col
      )
    };
    onUpdate(updatedSchema);
  };

  const handleAddColumn = () => {
    const newColumn: Column = {
      column_Name: '',
      column_type: ColumnDtypes.String,
      description: null,
      is_nullable: true,
      is_primary_key: false,
      is_sort_key: false,
      sensitivity: Sensitivity.PUBLIC,
      extra_action: null
    };

    onUpdate({
      ...schema,
      columns: [...schema.columns, newColumn]
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Column Definitions</h2>
        <button
          onClick={handleAddColumn}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          Add Column
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Properties</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sensitivity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {schema.columns.map((column, index) => (
              <tr key={index}>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={column.column_Name}
                    onChange={(e) => handleColumnUpdate(index, { ...column, column_Name: e.target.value })}
                    className="w-full px-2 py-1 border rounded"
                  />
                </td>
                <td className="px-6 py-4">
                  <select
                    value={column.column_type}
                    onChange={(e) => handleColumnUpdate(index, { ...column, column_type: e.target.value as ColumnDtypes })}
                    className="w-full px-2 py-1 border rounded"
                  >
                    {Object.values(ColumnDtypes).map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={column.description || ''}
                    onChange={(e) => handleColumnUpdate(index, { ...column, description: e.target.value })}
                    className="w-full px-2 py-1 border rounded"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={column.is_nullable}
                        onChange={(e) => handleColumnUpdate(index, { ...column, is_nullable: e.target.checked })}
                        className="mr-1"
                      />
                      Nullable
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={column.is_primary_key}
                        onChange={(e) => handleColumnUpdate(index, { ...column, is_primary_key: e.target.checked })}
                        className="mr-1"
                      />
                      PK
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={column.is_sort_key}
                        onChange={(e) => handleColumnUpdate(index, { ...column, is_sort_key: e.target.checked })}
                        className="mr-1"
                      />
                      Sort
                    </label>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={column.sensitivity}
                    onChange={(e) => handleColumnUpdate(index, { ...column, sensitivity: e.target.value as Sensitivity })}
                    className="w-full px-2 py-1 border rounded"
                  >
                    {Object.values(Sensitivity).map((sensitivity) => (
                      <option key={sensitivity} value={sensitivity}>{sensitivity}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={column.extra_action || ''}
                    onChange={(e) => handleColumnUpdate(index, { ...column, extra_action: e.target.value as ColumnExtraActions })}
                    className="w-full px-2 py-1 border rounded"
                  >
                    <option value="">None</option>
                    {Object.values(ColumnExtraActions).map((action) => (
                      <option key={action} value={action}>{action}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};