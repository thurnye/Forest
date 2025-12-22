import { Box, Button } from '@mui/material';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import React from 'react';
import { useNavigate } from 'react-router';

export const WelcomePage = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = React.useState<
    'student' | 'adult' | null
  >(null);

  const handleStudentClick = () => {
    setSelectedRole('student');
    navigate('/login/student');
  };

  const handleAdultClick = () => {
    setSelectedRole('adult');
    navigate('/login/guardian');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #87CEEB 0%, #98D8E8 50%, #90EE90 100%)',
        position: 'relative',
        py: 4,
      }}
    >
      {/* Clouds decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          left: '10%',
          fontSize: '3rem',
          opacity: 0.7,
        }}
      >
        ☁️
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: 40,
          right: '15%',
          fontSize: '2.5rem',
          opacity: 0.7,
        }}
      >
        ☁️
      </Box>

    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '90vh',
      }}
    >
      {/* Student Button */}
      <Button
        variant='contained'
        startIcon={<SchoolRoundedIcon sx={{ fontSize: 28 }} />}
        onClick={handleStudentClick}
        sx={{
          width: 300,
          mr: 10,
          py: 1.8,
          borderRadius: 4,
          fontSize: { xs: '1rem', sm: '1.2rem' },
          fontWeight: 800,
          fontFamily: '"Comic Sans MS", cursive',
          textTransform: 'none',
          background:
            selectedRole === 'student'
              ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
              : 'linear-gradient(135deg, #5EDD5E 0%, #2E9E3E 100%)',
          color: '#fff',
          border: '4px solid',
          borderColor: selectedRole === 'student' ? '#FFA500' : '#2E7D32',
          boxShadow:
            selectedRole === 'student'
              ? '0 6px 0 #FF8C00, 0 8px 16px rgba(255,165,0,0.4)'
              : '0 6px 0 #1e6e28, 0 8px 16px rgba(46,158,62,0.3)',
          transform: selectedRole === 'student' ? 'translateY(-2px)' : 'none',
          transition: 'all 0.2s',
          '&:hover': {
            background:
              selectedRole === 'student'
                ? 'linear-gradient(135deg, #FFE55C 0%, #FFB84D 100%)'
                : 'linear-gradient(135deg, #78EE79 0%, #34A845 100%)',
            transform: 'translateY(-4px)',
            boxShadow:
              selectedRole === 'student'
                ? '0 8px 0 #FF8C00, 0 12px 20px rgba(255,165,0,0.5)'
                : '0 8px 0 #1e6e28, 0 12px 20px rgba(46,158,62,0.4)',
          },
          '&:active': {
            transform: 'translateY(2px)',
            boxShadow: '0 2px 0 #1e6e28',
          },
        }}
      >
        I'm a Student
      </Button>

      {/* Grown-Up Button */}
      <Button
        // fullWidth
        variant='contained'
        startIcon={<PersonRoundedIcon sx={{ fontSize: 28 }} />}
        onClick={handleAdultClick}
        sx={{
          width: 300,
          ml: 10,
          py: 1.8,
          borderRadius: 4,
          fontSize: { xs: '1rem', sm: '1.2rem' },
          fontWeight: 800,
          fontFamily: '"Comic Sans MS", cursive',
          textTransform: 'none',
          background:
            selectedRole === 'adult'
              ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
              : 'linear-gradient(135deg, #FFC84A 0%, #D8931E 100%)',
          color: '#fff',
          border: '4px solid',
          borderColor: selectedRole === 'adult' ? '#FFA500' : '#D8931E',
          boxShadow:
            selectedRole === 'adult'
              ? '0 6px 0 #FF8C00, 0 8px 16px rgba(255,165,0,0.4)'
              : '0 6px 0 #a56d14, 0 8px 16px rgba(216,147,30,0.3)',
          transform: selectedRole === 'adult' ? 'translateY(-2px)' : 'none',
          transition: 'all 0.2s',
          '&:hover': {
            background:
              selectedRole === 'adult'
                ? 'linear-gradient(135deg, #FFE55C 0%, #FFB84D 100%)'
                : 'linear-gradient(135deg, #FFDA7A 0%, #ECA134 100%)',
            transform: 'translateY(-4px)',
            boxShadow:
              selectedRole === 'adult'
                ? '0 8px 0 #FF8C00, 0 12px 20px rgba(255,165,0,0.5)'
                : '0 8px 0 #a56d14, 0 12px 20px rgba(216,147,30,0.4)',
          },
          '&:active': {
            transform: 'translateY(2px)',
            boxShadow: '0 2px 0 #a56d14',
          },
        }}
      >
        I'm a Parent / Teacher
      </Button>
    </Box>
    </Box>
  );
};
