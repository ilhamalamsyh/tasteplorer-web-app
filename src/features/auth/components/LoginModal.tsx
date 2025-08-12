import React, { useEffect } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import Modal from '@/core/components/modal/Modal';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMobileFullScreen?: boolean;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  isMobileFullScreen = false,
}) => {
  const [showRegister, setShowRegister] = React.useState(false);

  // Reset to login form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setShowRegister(false);
    }
  }, [isOpen]);

  const handleSwitchToRegister = () => {
    setShowRegister(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegister(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isMobileFullScreen={isMobileFullScreen}
    >
      {showRegister ? (
        <RegisterForm
          isModal={true}
          onClose={onClose}
          onSwitchToLogin={handleSwitchToLogin}
        />
      ) : (
        <LoginForm
          isModal={true}
          onClose={onClose}
          onSwitchToRegister={handleSwitchToRegister}
        />
      )}
    </Modal>
  );
};

export default LoginModal;
