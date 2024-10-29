import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dataset, Table, Column } from '../../types/api';
import { DatasetSelector } from './DatasetSelector';
import { TableSelector } from './TableSelector';
import { ColumnEditor } from './ColumnEditor';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';

const SchemaEditor: React.FC = () => {
  const [datasets, setDatasets] = useState<Record<string, any>[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<string>('');
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [tableSchema, setTableSchema] = useState<Table | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDatasets = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/datasets');
      const datasetsArray = response.data && typeof response.data === 'object'
        ? Object.entries(response.data).map(([key, value]) => ({
            dataset_name: key,
            ...value
          }))
        : [];
      setDatasets(datasetsArray);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch datasets');
    } finally {
      setLoading(false);
    }
  };

  const fetchTableSchema = async () => {
    if (!selectedDataset || !selectedTable) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`/${selectedDataset}/tables/${selectedTable}`);
      setTableSchema(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch table schema');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  useEffect(() => {
    if (selectedDataset && selectedTable) {
      fetchTableSchema();
    }
  }, [selectedDataset, selectedTable]);

  const handleUpdateSchema = async (updatedSchema: Table) => {
    try {
      setLoading(true);
      await axios.put(`/${selectedDataset}/tables/${selectedTable}`, updatedSchema);
      await fetchTableSchema();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update schema');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !tableSchema) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchDatasets} />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Schema Editor</h1>
      
      <div className="grid gap-6">
        <div className="flex gap-4">
          <DatasetSelector
            datasets={datasets}
            selectedDataset={selectedDataset}
            onSelect={setSelectedDataset}
          />
          
          {selectedDataset && (
            <TableSelector
              dataset={selectedDataset}
              selectedTable={selectedTable}
              onSelect={setSelectedTable}
            />
          )}
        </div>

        {tableSchema && (
          <ColumnEditor
            schema={tableSchema}
            onUpdate={handleUpdateSchema}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default SchemaEditor;