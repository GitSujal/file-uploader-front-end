import axios from 'axios';
import { Dataset, Table } from '../types/api';

const api = axios.create({
  baseURL: '/api',
});

export const getDatasets = () => api.get('/datasets').then(res => res.data);

export const createDataset = (dataset: Dataset) => 
  api.post('/datasets', dataset).then(res => res.data);

export const getTables = (dataset: string) => 
  api.get(`/${dataset}/tables`).then(res => res.data);

export const getTable = (dataset: string, table: string) => 
  api.get(`/${dataset}/tables/${table}`).then(res => res.data);

export const updateTable = (dataset: string, table: string, data: Table) => 
  api.put(`/${dataset}/tables/${table}`, data).then(res => res.data);

export const uploadFile = (filename: string, file: File, metadata?: string) => {
  const formData = new FormData();
  formData.append('file', file);
  if (metadata) {
    formData.append('metadata', metadata);
  }
  return api.post(`/upload/${filename}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(res => res.data);
};

export const findMatch = (filename: string) => 
  api.get(`/findmatch/${filename}`).then(res => res.data);