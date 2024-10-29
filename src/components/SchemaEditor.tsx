import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { getDatasets, getTable, updateTable } from '../api/client';
import { Dataset, Table, Column, ColumnDtype, Sensitivity, ColumnExtraAction } from '../types/api';
import toast from 'react-hot-toast';

const SchemaEditor: React.FC = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<string>('');
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [tableData, setTableData] = useState<Table | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDatasets();
  }, []);

  useEffect(() => {
    if (selectedDataset && selectedTable) {
      loadTableSchema();
    }
  }, [selectedDataset, selectedTable]);

  const loadDatasets = async () => {
    try {
      const data = await getDatasets();
      setDatasets(data);
    } catch (error) {
      toast.error('Failed to load datasets');
    }
  };

  const loadTableSchema = async () => {
    setLoading(true);
    try {
      const data = await getTable(selectedDataset, selectedTable);
      setTableData(data);
    } catch (error) {
      toast.error('Failed to load table schema');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSchema = async () => {
    if (!tableData) return;

    try {
      await updateTable(selectedDataset, selectedTable, tableData);
      toast.success('Schema updated successfully');
    } catch (error) {
      toast.error('Failed to update schema');
    }
  };

  const addColumn = () => {
    if (!tableData) return;

    const newColumn: Column = {
      column_Name: '',
      column_type: 'String',
      description: '',
      is_nullable: true,
      is_primary_key: false,
      is_sort_key: false,
      sensitivity: 'PUBLIC',
    };

    setTableData({
      ...tableData,
      columns: [...tableData.columns, newColumn],
    });
  };

  const updateColumn = (index: number, field: keyof Column, value: any) => {
    if (!tableData) return;

    const updatedColumns = [...tableData.columns];
    updatedColumns[index] = {
      ...updatedColumns[index],
      [field]: value,
    };

    setTableData({
      ...tableData,
      columns: updatedColumns,
    });
  };

  const removeColumn = (index: number) => {
    if (!tableData) return;

    const updatedColumns = tableData.columns.filter((_, i) => i !== index);
    setTableData({
      ...tableData,
      columns: updatedColumns,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex space-x-4 mb-6">
          <select
            className="block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={selectedDataset}
            onChange={(e) => setSelectedDataset(e.target.value)}
          >
            <option value="">Select Dataset</option>
            {datasets.map((dataset) => (
              <option key={dataset.dataset_name} value={dataset.dataset_name}>
                {dataset.dataset_name}
              </option>
            ))}
          </select>

          {selectedDataset && (
            <select
              className="block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
            >
              <option value="">Select Table</option>
              {datasets
                .find((d) => d.dataset_name === selectedDataset)
                ?.tables?.map((table) => (
                  <option key={table} value={table}>
                    {table}
                  </option>
                ))}
            </select>
          )}
        </div>

        {tableData && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Schema Editor</h3>
              <div className="space-x-4">
                <button
                  onClick={addColumn}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Column
                </button>
                <button
                  onClick={handleSaveSchema}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Column Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Properties
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sensitivity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tableData.columns.map((column, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={column.column_Name}
                          onChange={(e) =>
                            updateColumn(index, 'column_Name', e.target.value)
                          }
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={column.column_type}
                          onChange={(e) =>
                            updateColumn(
                              index,
                              'column_type',
                              e.target.value as ColumnDtype
                            )
                          }
                        >
                          {[
                            'Decimal',
                            'Integer',
                            'String',
                            'Date',
                            'DateTime',
                            'Boolean',
                            'Float',
                            'Double',
                            'Long',
                            'Binary',
                            'Array',
                            'Map',
                            'Struct',
                          ].map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={column.description || ''}
                          onChange={(e) =>
                            updateColumn(index, 'description', e.target.value)
                          }
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-2">
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                              checked={column.is_nullable}
                              onChange={(e) =>
                                updateColumn(index, 'is_nullable', e.target.checked)
                              }
                            />
                            <span className="ml-2 text-sm text-gray-600">
                              Nullable
                            </span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                              checked={column.is_primary_key}
                              onChange={(e) =>
                                updateColumn(
                                  index,
                                  'is_primary_key',
                                  e.target.checked
                                )
                              }
                            />
                            <span className="ml-2 text-sm text-gray-600">
                              Primary Key
                            </span>
                          </label>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={column.sensitivity}
                          onChange={(e) =>
                            updateColumn(
                              index,
                              'sensitivity',
                              e.target.value as Sensitivity
                            )
                          }
                        >
                          {['PII', 'SENSITIVE', 'INTERNAL', 'PUBLIC'].map(
                            (sensitivity) => (
                              <option key={sensitivity} value={sensitivity}>
                                {sensitivity}
                              </option>
                            )
                          )}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => removeColumn(index)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchemaEditor;