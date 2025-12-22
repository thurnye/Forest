import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { SceneCanvas } from '../components/SceneCanvas';
import { HTMLOverlay } from '../components/HTMLOverlay';

export const PixiWelcomePage = () => {
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState('');
  const [selectedRole, setSelectedRole] = useState<'student' | 'grownup' | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if start button should be enabled
  const isStartEnabled = studentName.trim().length > 0 && selectedRole !== null;

  const handleRoleSelect = (role: 'student' | 'grownup') => {
    setSelectedRole(role);
    // Could trigger owl reaction animation here
  };

  const handleStartClick = () => {
    if (!isStartEnabled) return;

    setIsLoading(true);

    // Simulate loading animation
    setTimeout(() => {
      if (selectedRole === 'student') {
        navigate('/student/explorer/wonder/wonder-36'); // Great Wall of China
      } else {
        navigate('/parent-teacher/students');
      }
    }, 800);
  };

  const handleFooterClick = (buttonId: string) => {
    setActiveModal(buttonId);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const handleNameChange = (name: string) => {
    setStudentName(name);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#87CEEB',
      }}
    >
      {/* PixiJS Scene Canvas */}
      <SceneCanvas
        onRoleSelect={handleRoleSelect}
        onStartClick={handleStartClick}
        onFooterClick={handleFooterClick}
        isStartEnabled={isStartEnabled}
        selectedRole={selectedRole}
      />

      {/* HTML Overlay for Input and Modals */}
      <HTMLOverlay
        studentName={studentName}
        onNameChange={handleNameChange}
        activeModal={activeModal}
        onCloseModal={handleCloseModal}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <Box
            sx={{
              fontSize: '4rem',
              animation: 'bounce 0.6s ease-in-out infinite',
              '@keyframes bounce': {
                '0%, 100%': {
                  transform: 'translateY(0)',
                },
                '50%': {
                  transform: 'translateY(-30px)',
                },
              },
            }}
          >
            🦉
          </Box>
        </Box>
      )}
    </Box>
  );
};
