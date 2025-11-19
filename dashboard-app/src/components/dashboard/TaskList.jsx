import React, { useState, useEffect } from 'react';
import { useTasks } from '../../hooks/useTasks';
import SearchFilter from './SearchFilter';
import TaskForm from './TaskForm';

const TaskList = () => {
  const { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (Array.isArray(tasks)) {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks([]);
    }
  }, [tasks]);

  const handleCreateTask = async (taskData) => {
    const success = await createTask(taskData);
    if (success) {
      setShowForm(false);
    }
  };

  const handleUpdateTask = async (taskData) => {
    if (!editingTask) return;
    
    const taskId = editingTask.id || editingTask._id;
    const success = await updateTask(taskId, taskData);
    if (success) {
      setEditingTask(null);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId);
    }
  };

  const handleFilter = (filters) => {
    if (!Array.isArray(tasks)) {
      setFilteredTasks([]);
      return;
    }

    let filtered = tasks;

    if (filters.search) {
      filtered = filtered.filter(task =>
        task.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.priority && filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    setFilteredTasks(filtered);
  };

  const displayTasks = Array.isArray(filteredTasks) ? filteredTasks : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">My Tasks</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Add New Task
        </button>
      </div>

      <SearchFilter onFilter={handleFilter} />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <TaskForm
            onSave={handleCreateTask}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {editingTask && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <TaskForm
            task={editingTask}
            onSave={handleUpdateTask}
            onCancel={() => setEditingTask(null)}
          />
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {displayTasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {Array.isArray(tasks) && tasks.length === 0 
                ? "No tasks found. Create your first task!" 
                : "No tasks match your filters."}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {displayTasks.map((task) => (
              <li key={task.id || task._id}>
                <div className="px-4 py-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={task.status === 'completed'}
                        onChange={() => updateTask(task.id || task._id, {
                          status: task.status === 'completed' ? 'pending' : 'completed'
                        })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3">
                      <p className={`text-sm font-medium ${
                        task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-900'
                      }`}>
                        {task.title}
                      </p>
                      <p className="text-sm text-gray-500">{task.description}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          task.priority === 'high' 
                            ? 'bg-red-100 text-red-800' 
                            : task.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                        {task.dueDate && (
                          <span className="text-xs text-gray-500">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingTask(task)}
                      className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id || task._id)}
                      className="text-red-600 hover:text-red-900 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TaskList;