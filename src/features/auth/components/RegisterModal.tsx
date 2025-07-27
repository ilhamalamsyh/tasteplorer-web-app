import React from 'react';
import RegisterForm from './RegisterForm';
import Modal from '@/core/components/modal/Modal';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <RegisterForm isModal={true} onClose={onClose} />
    </Modal>
  );
};

export default RegisterModal;
