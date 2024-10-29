import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface TableSelectorProps {
  dataset: string;
  selectedTable: string;
  onSelect: (table: string) => void;
}

export const TableSelector: React.FC<TableSelectorProps> = ({
  dataset,
  selectedTable,
  onSelect,
}) => {
  const [tables, setTables] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTables = async () => {
      if (!dataset) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`/api/${dataset}/tables`);
        const tablesList = response.data && typeof response.data === 'object'
          ? Object.keys(response.data)
          : [];
        setTables(tablesList);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tables');
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, [dataset]);

  return (
    <div className="flex-1">
      <label htmlFor="table" className="block text-sm font-medium text-gray-700 mb-1">
        Select Table
      </label>
      <select
        id="table"
        value={selectedTable}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        disabled={loading || !dataset}
      >
        <option value="">Select a table...</option>
        {tables.map((table) => (
          <option key={table} value={table}>
            {table}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};