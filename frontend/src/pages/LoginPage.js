import React from 'react';
import LoginForm from '../components/LoginForm';
import './LoginPage.css'; // Style file (to be created)

function LoginPage() {
  return (
    <div className="login-page-container">
      <header className="login-page-header">
        <h1>Welcome to the Energy Management System</h1>
        <p>Please log in to continue.</p>
      </header>
      <main className="login-form-section">
        <LoginForm />
      </main>
      <footer className="login-page-footer">
        <p>&copy; {new Date().getFullYear()} Energy Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LoginPage; 