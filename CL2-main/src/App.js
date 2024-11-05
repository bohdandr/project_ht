import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [tasks, setTasks] = useState([]);
    const [ipAddress, setIpAddress] = useState('');
    const [taskDescription, setTaskDescription] = useState('');

    // Function to get the user's IP address
    const fetchIpAddress = async () => {
        try {
            const response = await axios.get('https://api.ipify.org?format=json');
            setIpAddress(response.data.ip);
        } catch (error) {
            console.error("Error fetching IP address:", error);
        }
    };

    // Function to get all tasks
    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://54.89.130.1:5000/tasks');
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    // Fetch IP address and tasks on component load
    useEffect(() => {
        fetchIpAddress();
        fetchTasks();
    }, []);

    // Function to add a new task
    const handleAddTask = async (e) => {
        e.preventDefault(); // Prevent page reload

        try {
            await axios.post('http://54.89.130.1:5000/tasks', {
                ip_address: ipAddress,
                description: taskDescription,
            });

            // Refresh tasks list after adding a new task
            fetchTasks();

            // Clear the input field
            setTaskDescription('');
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    return (
        <div className="task-planner">
            <h1>Task Planner</h1>

            <form onSubmit={handleAddTask} className="task-form">
                <textarea
                    placeholder="Enter task description"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    required
                    className="task-input"
                />
                <button type="submit" className="add-task-button">Add Task</button>
            </form>

            <h2>Task List:</h2>
            <ul className="task-list">
                {tasks.map(task => (
                    <li key={task.id} className="task-item">
                        <strong>{task.ip_address}</strong>: {task.description}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
