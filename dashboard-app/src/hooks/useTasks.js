import { useState, useCallback } from 'react';
import api from '../services/api';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/tasks');
      const tasksData = response.data.tasks || response.data || [];
      setTasks(Array.isArray(tasksData) ? tasksData : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = async (taskData) => {
    setError('');
    try {
      const response = await api.post('/tasks', taskData);
      const newTask = response.data.task || response.data;
      setTasks(prev => [...prev, newTask]);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
      return false;
    }
  };

  const updateTask = async (taskId, taskData) => {
    setError('');
    try {
      const response = await api.put(`/tasks/${taskId}`, taskData);
      const updatedTask = response.data.task || response.data;
      setTasks(prev => prev.map(task => 
        (task.id === taskId || task._id === taskId) ? updatedTask : task
      ));
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
      return false;
    }
  };

  const deleteTask = async (taskId) => {
    setError('');
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(prev => prev.filter(task => 
        task.id !== taskId && task._id !== taskId
      ));
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
      return false;
    }
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask
  };
};