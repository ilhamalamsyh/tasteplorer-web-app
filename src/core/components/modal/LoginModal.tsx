import React from 'react';
import LoginForm from '@/features/auth/components/LoginForm';
import Modal from './Modal';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <LoginForm isModal={true} onClose={onClose} />
    </Modal>
  );
};

export default LoginModal;
