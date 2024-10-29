import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dataset } from '../types/api';
import { PlusCircle, Trash2, Edit } from 'lucide-react';

const DatasetManager: React.FC = () => {
  const [datasets, setDatasets] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newDataset, setNewDataset] = useState<Dataset>({
    dataset_name: '',
    table_name: null,
    file_prefix: null,
    file_suffix: null
  });

  const fetchDatasets = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/datasets');
      // Convert the object response to an array if needed
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

  useEffect(() => {
    fetchDatasets();
  }, []);

  const handleCreateDataset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/datasets', newDataset);
      setNewDataset({
        dataset_name: '',
        table_name: null,
        file_prefix: null,
        file_suffix: null
      });
      fetchDatasets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create dataset');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchDatasets}
          className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Dataset Manager</h1>
        
        {/* Create Dataset Form */}
        <form onSubmit={handleCreateDataset} className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Dataset Name"
                value={newDataset.dataset_name}
                onChange={(e) => setNewDataset(prev => ({ ...prev, dataset_name: e.target.value }))}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <PlusCircle size={20} />
              Create Dataset
            </button>
          </div>
        </form>
      </div>

      {/* Datasets List */}
      <div className="grid gap-4">
        {datasets.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No datasets available. Create one to get started.</p>
          </div>
        ) : (
          datasets.map((dataset) => (
            <div
              key={dataset.dataset_name}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{dataset.dataset_name}</h2>
                  {dataset.description && (
                    <p className="text-gray-600 mt-1">{dataset.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                    onClick={() => {/* Handle edit */}}
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                    onClick={() => {/* Handle delete */}}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DatasetManager;