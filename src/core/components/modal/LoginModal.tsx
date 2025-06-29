interface LoginModalProps {
  onClose: () => void;
}

import React from 'react';

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-md w-96">
      <h2 className="text-2xl fond-bold mb-4 text-center">Login</h2>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter your password."
          />
        </div>
        <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
          Login
        </button>
      </form>
      <button
        onClick={onClose}
        className="mt-4 w-full text-center text-gray-600 hover:text-gray-800"
      >
        Close
      </button>
    </div>
  </div>
);

export default LoginModal;
