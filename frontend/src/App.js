import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from "axios";
import { Link, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SummaryApi from './common';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/auth/Login';

const App = () => {
    const [testData, setTestData] = useState();
    const [testMessage, setTestMessage] = useState();

    const fetchTestdata = async () => {
        try {
            const res = await axios({
                method: SummaryApi.Test.method,
                url: SummaryApi.Test.url,
            });
            setTestData(res.data.data);
            setTestMessage(res.data.message);
        } catch (err) {
            console.error("Error fetching test data:", err);
        }
    };

    useEffect(() => {
        fetchTestdata();
    }, []);

    return (
        <AuthProvider>
            <Header />
            <Outlet />
            <Footer />
        </AuthProvider>
    );
};

export default App;