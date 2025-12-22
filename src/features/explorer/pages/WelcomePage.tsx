import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Paper,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

export const WelcomePage = () => {
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState('');

  const handleStudentClick = () => {
    navigate('/student/explorer');
  };

  const handleGrownUpClick = () => {
    navigate('/parent-teacher/students');
  };

  const handleStartChallenge = () => {
    navigate('/student/explorer/wonder/wonder-36'); // Great Wall of China
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #87CEEB 0%, #98D8E8 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Forest Background Elements */}
      {/* Left Tree */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '25%',
          backgroundImage: 'linear-gradient(135deg, #228B22 0%, #32CD32 100%)',
          clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '10%',
            left: '5%',
            fontSize: '8rem',
          },
        }}
      />

      {/* Right Tree */}
      <Box
        sx={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '25%',
          backgroundImage: 'linear-gradient(135deg, #228B22 0%, #32CD32 100%)',
          clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)',
        }}
      />

      {/* Waterfall decorations */}
      <Box
        sx={{
          position: 'absolute',
          left: '15%',
          top: '30%',
          fontSize: '3rem',
          opacity: 0.6,
        }}
      >
        💧
      </Box>
      <Box
        sx={{
          position: 'absolute',
          right: '15%',
          top: '35%',
          fontSize: '3rem',
          opacity: 0.6,
        }}
      >
        💧
      </Box>

      {/* Nature decorations */}
      <Box sx={{ position: 'absolute', left: '10%', bottom: '20%', fontSize: '2rem' }}>🦋</Box>
      <Box sx={{ position: 'absolute', left: '12%', bottom: '15%', fontSize: '1.5rem' }}>🐞</Box>
      <Box sx={{ position: 'absolute', right: '10%', bottom: '25%', fontSize: '2rem' }}>🌸</Box>
      <Box sx={{ position: 'absolute', right: '8%', bottom: '18%', fontSize: '1.5rem' }}>🍄</Box>

      <Container maxWidth="md" sx={{ position: 'relative', pt: 6 }}>
        {/* Main Welcome Card */}
        <Paper
          elevation={12}
          sx={{
            background: 'linear-gradient(135deg, #D2691E 0%, #CD853F 100%)',
            border: '6px solid #8B4513',
            borderRadius: 4,
            overflow: 'visible',
            position: 'relative',
            boxShadow: '0 12px 48px rgba(0,0,0,0.4)',
          }}
        >
          {/* Header Sign */}
          <Box
            sx={{
              position: 'relative',
              top: -30,
              mx: 'auto',
              width: 'fit-content',
              bgcolor: '#8B4513',
              border: '4px solid #654321',
              borderRadius: 3,
              px: 6,
              py: 2,
              boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
            }}
          >
            {/* Leaves decoration */}
            <Box
              sx={{
                position: 'absolute',
                top: -15,
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '3rem',
              }}
            >
              🍃
            </Box>

            <Typography
              variant="h2"
              sx={{
                color: '#FFF9E6',
                fontWeight: 'bold',
                fontFamily: '"Comic Sans MS", cursive',
                textShadow: '4px 4px 8px rgba(0,0,0,0.5)',
                fontSize: { xs: '2.5rem', md: '3.5rem' },
              }}
            >
              Reading Forest
            </Typography>
          </Box>

          {/* Content Area */}
          <Box sx={{ px: { xs: 3, md: 6 }, pb: 4, bgcolor: '#FFF9E6', pt: 2 }}>
            {/* Welcome Text */}
            <Typography
              variant="h3"
              sx={{
                color: '#8B4513',
                fontWeight: 'bold',
                fontFamily: '"Comic Sans MS", cursive',
                textAlign: 'center',
                mb: 3,
                fontSize: { xs: '2rem', md: '3rem' },
              }}
            >
              Welcome!
            </Typography>

            {/* Name Input */}
            <TextField
              fullWidth
              placeholder="Enter Your Name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#999', fontSize: '2rem' }} />
                  </InputAdornment>
                ),
                sx: {
                  bgcolor: 'white',
                  borderRadius: 25,
                  fontSize: '1.3rem',
                  fontFamily: '"Comic Sans MS", cursive',
                  border: '3px solid #D2691E',
                  '& fieldset': { border: 'none' },
                  py: 1,
                },
              }}
              sx={{ mb: 3 }}
            />

            {/* Role Selection Buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleStudentClick}
                sx={{
                  bgcolor: '#4CAF50',
                  color: '#FFF',
                  fontWeight: 'bold',
                  fontSize: { xs: '1.3rem', md: '1.8rem' },
                  py: 2.5,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontFamily: '"Comic Sans MS", cursive',
                  border: '4px solid #2E7D32',
                  boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
                  display: 'flex',
                  gap: 2,
                  '&:hover': {
                    bgcolor: '#45a049',
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <Box sx={{ fontSize: '2.5rem' }}>🎒</Box>
                I'm a Student
                <Box sx={{ fontSize: '1.5rem' }}>⭐</Box>
              </Button>

              <Button
                variant="contained"
                size="large"
                onClick={handleGrownUpClick}
                sx={{
                  bgcolor: '#FF9800',
                  color: '#FFF',
                  fontWeight: 'bold',
                  fontSize: { xs: '1.3rem', md: '1.8rem' },
                  py: 2.5,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontFamily: '"Comic Sans MS", cursive',
                  border: '4px solid #F57C00',
                  boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
                  display: 'flex',
                  gap: 2,
                  '&:hover': {
                    bgcolor: '#FB8C00',
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <Box sx={{ fontSize: '2.5rem' }}>📋</Box>
                I'm a Grown-Up
                <Box sx={{ fontSize: '1.5rem' }}>⭐</Box>
              </Button>
            </Box>

            {/* Today's Challenge */}
            <Paper
              elevation={4}
              sx={{
                bgcolor: '#FFF',
                border: '3px solid #8B4513',
                borderRadius: 3,
                p: 3,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: '#8B4513',
                  fontWeight: 'bold',
                  fontFamily: '"Comic Sans MS", cursive',
                  textAlign: 'center',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                }}
              >
                Today's 🌱 Challenge 🎃
              </Typography>

              {/* Challenge Image */}
              <Box
                sx={{
                  height: 180,
                  borderRadius: 2,
                  backgroundImage: 'linear-gradient(135deg, #FFE0B2 0%, #FFCC80 100%)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  mb: 2,
                  border: '2px solid #D2691E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box sx={{ fontSize: '5rem' }}>🏯</Box>
              </Box>

              <Typography
                variant="h6"
                sx={{
                  color: '#333',
                  fontWeight: 'bold',
                  fontFamily: '"Comic Sans MS", cursive',
                  textAlign: 'center',
                  mb: 2,
                }}
              >
                Explore the Great Wall of China!
              </Typography>

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleStartChallenge}
                sx={{
                  bgcolor: '#4CAF50',
                  color: '#FFF',
                  fontWeight: 'bold',
                  fontSize: '1.5rem',
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontFamily: '"Comic Sans MS", cursive',
                  border: '4px solid #2E7D32',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  '&:hover': {
                    bgcolor: '#45a049',
                  },
                }}
              >
                Start!
              </Button>
            </Paper>
          </Box>
        </Paper>

        {/* Bottom Navigation */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            mt: 3,
            flexWrap: 'wrap',
          }}
        >
          {['📚 Parents Area', '❓ Help', '⚙️ Settings'].map((label) => (
            <Button
              key={label}
              variant="contained"
              sx={{
                bgcolor: '#8B4513',
                color: '#FFF',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                px: 3,
                py: 1.5,
                borderRadius: 3,
                textTransform: 'none',
                fontFamily: '"Comic Sans MS", cursive',
                border: '3px solid #654321',
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                '&:hover': {
                  bgcolor: '#A0522D',
                },
              }}
            >
              {label}
            </Button>
          ))}
        </Box>

        {/* Owl Mascot */}
        <Box
          sx={{
            position: 'fixed',
            bottom: 40,
            right: { xs: 20, md: 60 },
            zIndex: 1000,
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: { xs: 120, md: 180 },
              height: { xs: 120, md: 180 },
              borderRadius: '50%',
              bgcolor: '#D2691E',
              border: '4px solid #8B4513',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
            }}
          >
            <Typography sx={{ fontSize: { xs: '5rem', md: '8rem' } }}>🦉</Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
