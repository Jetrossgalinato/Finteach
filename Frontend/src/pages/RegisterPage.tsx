import React, { useState } from 'react';
import logo from '../assets/logo.png'; 

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);
    console.log('Username:', username);
  };

  return (
   <div className="flex items-center justify-center min-h-screen"> 
      <div className="max-w-md w-full mx-auto p-10 text-center">
        <img src={logo} alt="Logo" className="mx-auto mb-4 w-24 h-24" />
        <h1 className="text-2xl font-bold mb-4">Register now!</h1>
        <p className="text-gray-600 mb-6">Please enter your credentials to register your account.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-left text-gray-700 mb-1">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-left text-gray-700 mb-1">Username:</label>
            <input
              type="text"
              id="username"
              value={email}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-left text-gray-700 mb-1">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-left text-gray-700 mb-1">Confirm Password:</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-gray-600">
          Already have an accont? <a href="/" className="text-blue-500 hover:underline">Sign in here</a>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;