import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import SummaryApi from '../common';
import Toast from '../components/Toast';

const CreateAuth = () => {
    const { isLoggedIn, token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        domain: '',
        dbType: '',
        mongoUri: '',
        mysqlHost: '',
        mysqlUser: '',
        mysqlPassword: '',
        mysqlDatabase: ''
    });
    const [fields, setFields] = useState([{ name: '', type: 'text', required: false }]);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    // Redirect to /login if not logged in
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFieldChange = (index, key, value) => {
        const updatedFields = [...fields];
        updatedFields[index][key] = value;
        setFields(updatedFields);
    };

    const addField = () => {
        setFields([...fields, { name: '', type: 'text', required: false }]);
    };

    const removeField = (index) => {
        setFields(fields.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.domain || !formData.dbType) {
            setToast({ show: true, message: 'Please fill in all required fields', type: 'error' });
            return;
        }
        if (formData.dbType === 'mongodb' && !formData.mongoUri) {
            setToast({ show: true, message: 'MongoDB URI is required', type: 'error' });
            return;
        }
        if (formData.dbType === 'mysql' && (!formData.mysqlHost || !formData.mysqlUser || !formData.mysqlPassword || !formData.mysqlDatabase)) {
            setToast({ show: true, message: 'All MySQL credentials are required', type: 'error' });
            return;
        }
        if (fields.some(field => !field.name)) {
            setToast({ show: true, message: 'All model fields must have a name', type: 'error' });
            return;
        }

        try {
            const res = await axios({
                method: SummaryApi.CreateAuth.method,
                url: SummaryApi.CreateAuth.url,
                data: { ...formData, fields },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.data.success) {
                setToast({ show: true, message: res.data.message, type: 'success' });
                setTimeout(() => navigate('/manage-auths'), 2000); // Redirect to /manage-auths
            }
        } catch (err) {
            setToast({ show: true, message: err.response?.data?.message || 'Failed to create authentication', type: 'error' });
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-900 to-blue-950 px-4 sm:px-6 lg:px-8">
            <div className="text-center w-full max-w-2xl">
                <h2 className="text-3xl font-bold text-white mb-8">Create Authentication</h2>
                <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
                    <div className="mb-6 w-full">
                        <input
                            type="text"
                            name="domain"
                            value={formData.domain}
                            onChange={handleChange}
                            placeholder="Domain (e.g., example.com)"
                            className="w-full p-3 bg-transparent border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-6 w-full">
                        <select
                            name="dbType"
                            value={formData.dbType}
                            onChange={handleChange}
                            className="w-full p-3 bg-transparent border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="" disabled>Select Database Type</option>
                            <option value="mongodb">MongoDB</option>
                            <option value="mysql">MySQL</option>
                        </select>
                    </div>
                    {formData.dbType === 'mongodb' && (
                        <div className="mb-6 w-full">
                            <input
                                type="text"
                                name="mongoUri"
                                value={formData.mongoUri}
                                onChange={handleChange}
                                placeholder="MongoDB URI (e.g., mongodb://localhost:27017/dbname)"
                                className="w-full p-3 bg-transparent border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    )}
                    {formData.dbType === 'mysql' && (
                        <div className="mb-6 w-full space-y-4">
                            <input
                                type="text"
                                name="mysqlHost"
                                value={formData.mysqlHost}
                                onChange={handleChange}
                                placeholder="MySQL Host (e.g., localhost)"
                                className="w-full p-3 bg-transparent border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <input
                                type="text"
                                name="mysqlUser"
                                value={formData.mysqlUser}
                                onChange={handleChange}
                                placeholder="MySQL User"
                                className="w-full p-3 bg-transparent border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <input
                                type="password"
                                name="mysqlPassword"
                                value={formData.mysqlPassword}
                                onChange={handleChange}
                                placeholder="MySQL Password"
                                className="w-full p-3 bg-transparent border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <input
                                type="text"
                                name="mysqlDatabase"
                                value={formData.mysqlDatabase}
                                onChange={handleChange}
                                placeholder="MySQL Database Name"
                                className="w-full p-3 bg-transparent border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    )}
                    <div className="mb-6 w-full">
                        <h3 className="text-xl font-semibold text-white mb-4">Define Model Fields</h3>
                        {fields.map((field, index) => (
                            <div key={index} className="flex items-center gap-4 mb-4">
                                <input
                                    type="text"
                                    value={field.name}
                                    onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                                    placeholder="Field Name"
                                    className="flex-1 p-3 bg-transparent border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <select
                                    value={field.type}
                                    onChange={(e) => handleFieldChange(index, 'type', e.target.value)}
                                    className="p-3 bg-transparent border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="text">Text</option>
                                    <option value="email">Email</option>
                                    <option value="password">Password</option>
                                    <option value="number">Number</option>
                                </select>
                                <label className="flex items-center text-white">
                                    <input
                                        type="checkbox"
                                        checked={field.required}
                                        onChange={(e) => handleFieldChange(index, 'required', e.target.checked)}
                                        className="mr-2"
                                    />
                                    Required
                                </label>
                                <button
                                    type="button"
                                    onClick={() => removeField(index)}
                                    className="text-red-400 hover:text-red-500"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addField}
                            className="mt-2 text-blue-400 hover:text-blue-500"
                        >
                            + Add Field
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="w-full max-w-md bg-white text-gray-800 font-semibold p-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                        Create Authentication
                    </button>
                </form>
                {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ show: false, message: '', type: '' })} />}
            </div>
        </div>
    );
};

export default CreateAuth;