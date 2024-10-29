import React from 'react';
import { Dataset } from '../../types/api';

interface DatasetSelectorProps {
  datasets: Record<string, any>[];
  selectedDataset: string;
  onSelect: (dataset: string) => void;
}

export const DatasetSelector: React.FC<DatasetSelectorProps> = ({
  datasets,
  selectedDataset,
  onSelect,
}) => {
  return (
    <div className="flex-1">
      <label htmlFor="dataset" className="block text-sm font-medium text-gray-700 mb-1">
        Select Dataset
      </label>
      <select
        id="dataset"
        value={selectedDataset}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Select a dataset...</option>
        {datasets.map((dataset) => (
          <option key={dataset.dataset_name} value={dataset.dataset_name}>
            {dataset.dataset_name}
          </option>
        ))}
      </select>
    </div>
  );
};