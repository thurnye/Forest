import { Box, CardMedia, TextField, Button, Typography, Stack } from '@mui/material';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import { useState } from 'react';

import logo from '../../../assets/logo.png';
import loginBg from '../../../assets/student-login-bg.png';
import scroll from '../../../assets/scroll.png';
// Optional assets (safe to remove if you don’t have them yet)
// import owlPng from "../assets/reading-forest/owl.png";
// import challengeImg from "../assets/reading-forest/challenge.jpg";

type Props = {
  onStudent?: (name: string) => void;
  onAdult?: (name: string) => void;
  onStart?: () => void;
  onParentsArea?: () => void;
  onHelp?: () => void;
  onSettings?: () => void;
};

export default function TestingPage({ onStudent, onStart }: Props) {
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<'student' | 'adult' | null>(null);

  const handleStudentClick = () => {
    setSelectedRole('student');
    if (onStudent && name) {
      onStudent(name);
    }
  };

  const handleStart = () => {
    if (onStart && name && selectedRole) {
      onStart();
    }
  };

  return (
    <>
      <Box
        sx={{
          minHeight: '100vh',
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: `url(${loginBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* title header */}
        <Box>
          <CardMedia
            component='img'
            image={logo}
            alt='Paella dish'
            sx={{
              height: 350,
              width: { xs: '90%', sm: '80%', md: '70%', lg: '60%' },
              maxWidth: 700,
              margin: { xs: 'auto', sm: 'auto' },
            }}
          />
        </Box>

        <Box
          aria-hidden
          sx={
            {
              // position: "absolute",
              // inset: 0,
              // background:
              //   "radial-gradient(circle at 50% 35%, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.18) 55%, rgba(0,0,0,0.35) 100%)",
            }
          }
        />
        <Box
          sx={{
            height: { xs: 500, sm: 600, md: 650 },
            width: { xs: '95%', sm: '85%', md: '75%', lg: '65%' },
            maxWidth: 700,
            margin: 'auto',
            position: 'relative',
            backgroundImage: `url(${scroll})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            marginTop: '-75px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Adventure Game Login Form */}
          <Box
            sx={{
              width: { xs: '85%', sm: '75%', md: '70%' },
              maxWidth: 500,
              px: { xs: 2, sm: 3 },
              py: { xs: 3, sm: 4 },
            }}
          >
            {/* Welcome Title */}
            <Typography
              variant="h4"
              sx={{
                fontFamily: '"Comic Sans MS", cursive, system-ui',
                fontWeight: 900,
                color: '#5a3a22',
                textAlign: 'center',
                mb: 3,
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                textShadow: '2px 2px 4px rgba(255,215,0,0.3)',
              }}
            >
              Welcome, Explorer!
            </Typography>

            {/* Name Input */}
            <TextField
              fullWidth
              placeholder="Enter Your Adventurer Name"
              value={name}
              onChange={(e) => setName(e.target.value.toUpperCase())}
              InputProps={{
                // startAdornment: (
                //   <InputAdornment position="start">
                //     <SearchRoundedIcon sx={{ color: '#8d6e4e', fontSize: 28 }} />
                //   </InputAdornment>
                // ),
                sx: {
                  backgroundColor: '#fff',
                  textAlign: 'center',
                  borderRadius: 4,
                  fontSize: { xs: '0.95rem', sm: '1.1rem' },
                  fontFamily: '"Comic Sans MS", cursive',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  '& fieldset': {
                    border: '3px solid #d2691e',
                  },
                  '&:hover fieldset': {
                    border: '3px solid #8B4513 !important',
                  },
                  '&.Mui-focused fieldset': {
                    border: '3px solid #8B4513 !important',
                  },
                },
              }}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              placeholder="Enter Your Adventurer Name"
              value={name}
              onChange={(e) => setName(e.target.value.toUpperCase())}
              InputProps={{
                // startAdornment: (
                //   <InputAdornment position="start">
                //     <SearchRoundedIcon sx={{ color: '#8d6e4e', fontSize: 28 }} />
                //   </InputAdornment>
                // ),
                sx: {
                  backgroundColor: '#fff',
                  textAlign: 'center',
                  borderRadius: 4,
                  fontSize: { xs: '0.95rem', sm: '1.1rem' },
                  fontFamily: '"Comic Sans MS", cursive',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  '& fieldset': {
                    border: '3px solid #d2691e',
                  },
                  '&:hover fieldset': {
                    border: '3px solid #8B4513 !important',
                  },
                  '&.Mui-focused fieldset': {
                    border: '3px solid #8B4513 !important',
                  },
                },
              }}
              sx={{ mb: 3 }}
            />

            {/* Role Selection */}
            <Stack spacing={2} sx={{ mb: 3 }}>
              {/* Student Button */}
              <Button
                fullWidth
                variant="contained"
                startIcon={<SchoolRoundedIcon sx={{ fontSize: 28 }} />}
                onClick={handleStudentClick}
                sx={{
                  py: 1.8,
                  borderRadius: 4,
                  fontSize: { xs: '1rem', sm: '1.2rem' },
                  fontWeight: 800,
                  fontFamily: '"Comic Sans MS", cursive',
                  textTransform: 'none',
                  background: selectedRole === 'student'
                    ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
                    : 'linear-gradient(135deg, #5EDD5E 0%, #2E9E3E 100%)',
                  color: '#fff',
                  border: '4px solid',
                  borderColor: selectedRole === 'student' ? '#FFA500' : '#2E7D32',
                  boxShadow: selectedRole === 'student'
                    ? '0 6px 0 #FF8C00, 0 8px 16px rgba(255,165,0,0.4)'
                    : '0 6px 0 #1e6e28, 0 8px 16px rgba(46,158,62,0.3)',
                  transform: selectedRole === 'student' ? 'translateY(-2px)' : 'none',
                  transition: 'all 0.2s',
                  '&:hover': {
                    background: selectedRole === 'student'
                      ? 'linear-gradient(135deg, #FFE55C 0%, #FFB84D 100%)'
                      : 'linear-gradient(135deg, #78EE79 0%, #34A845 100%)',
                    transform: 'translateY(-4px)',
                    boxShadow: selectedRole === 'student'
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
                {selectedRole === 'student' && <Box component="span" sx={{ ml: 1 }}>✨</Box>}
              </Button>

              {/* Grown-Up Button */}
              {/* <Button
                fullWidth
                variant="contained"
                startIcon={<PersonRoundedIcon sx={{ fontSize: 28 }} />}
                onClick={handleAdultClick}
                sx={{
                  py: 1.8,
                  borderRadius: 4,
                  fontSize: { xs: '1rem', sm: '1.2rem' },
                  fontWeight: 800,
                  fontFamily: '"Comic Sans MS", cursive',
                  textTransform: 'none',
                  background: selectedRole === 'adult'
                    ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
                    : 'linear-gradient(135deg, #FFC84A 0%, #D8931E 100%)',
                  color: '#fff',
                  border: '4px solid',
                  borderColor: selectedRole === 'adult' ? '#FFA500' : '#D8931E',
                  boxShadow: selectedRole === 'adult'
                    ? '0 6px 0 #FF8C00, 0 8px 16px rgba(255,165,0,0.4)'
                    : '0 6px 0 #a56d14, 0 8px 16px rgba(216,147,30,0.3)',
                  transform: selectedRole === 'adult' ? 'translateY(-2px)' : 'none',
                  transition: 'all 0.2s',
                  '&:hover': {
                    background: selectedRole === 'adult'
                      ? 'linear-gradient(135deg, #FFE55C 0%, #FFB84D 100%)'
                      : 'linear-gradient(135deg, #FFDA7A 0%, #ECA134 100%)',
                    transform: 'translateY(-4px)',
                    boxShadow: selectedRole === 'adult'
                      ? '0 8px 0 #FF8C00, 0 12px 20px rgba(255,165,0,0.5)'
                      : '0 8px 0 #a56d14, 0 12px 20px rgba(216,147,30,0.4)',
                  },
                  '&:active': {
                    transform: 'translateY(2px)',
                    boxShadow: '0 2px 0 #a56d14',
                  },
                }}
              >
                I'm a Grown-Up
                {selectedRole === 'adult' && <Box component="span" sx={{ ml: 1 }}>✨</Box>}
              </Button> */}
            </Stack>

            {/* Start Adventure Button */}
            <Button
              fullWidth
              variant="contained"
              disabled={!name || !selectedRole}
              onClick={handleStart}
              sx={{
                py: 2,
                borderRadius: 4,
                fontSize: { xs: '1.2rem', sm: '1.4rem' },
                fontWeight: 900,
                fontFamily: '"Comic Sans MS", cursive',
                textTransform: 'none',
                background: (!name || !selectedRole)
                  ? 'linear-gradient(135deg, #999 0%, #666 100%)'
                  : 'linear-gradient(135deg, #FF6B6B 0%, #EE5A24 100%)',
                color: '#fff',
                border: '4px solid',
                borderColor: (!name || !selectedRole) ? '#666' : '#C23616',
                boxShadow: (!name || !selectedRole)
                  ? '0 4px 0 #555'
                  : '0 6px 0 #C23616, 0 8px 20px rgba(238,90,36,0.4)',
                animation: (!name || !selectedRole) ? 'none' : 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': {
                    boxShadow: '0 6px 0 #C23616, 0 8px 20px rgba(238,90,36,0.4)',
                  },
                  '50%': {
                    boxShadow: '0 6px 0 #C23616, 0 8px 30px rgba(238,90,36,0.6)',
                  },
                },
                '&:hover': {
                  background: (!name || !selectedRole)
                    ? 'linear-gradient(135deg, #999 0%, #666 100%)'
                    : 'linear-gradient(135deg, #FF8787 0%, #FF6348 100%)',
                  transform: (!name || !selectedRole) ? 'none' : 'translateY(-4px)',
                  boxShadow: (!name || !selectedRole)
                    ? '0 4px 0 #555'
                    : '0 8px 0 #C23616, 0 12px 24px rgba(238,90,36,0.5)',
                },
                '&:active': {
                  transform: (!name || !selectedRole) ? 'none' : 'translateY(2px)',
                  boxShadow: (!name || !selectedRole) ? '0 2px 0 #555' : '0 2px 0 #C23616',
                },
                '&.Mui-disabled': {
                  background: 'linear-gradient(135deg, #999 0%, #666 100%)',
                  color: '#ccc',
                },
              }}
            >
              🚀 Start Your Adventure! 🚀
            </Button>

            {/* Helper Text */}
            {(!name || !selectedRole) && (
              <Typography
                sx={{
                  mt: 2,
                  textAlign: 'center',
                  fontSize: { xs: '0.85rem', sm: '0.95rem' },
                  color: '#8d6e4e',
                  fontFamily: '"Comic Sans MS", cursive',
                  fontStyle: 'italic',
                }}
              >
                {!name ? '📝 Enter your name to begin!' : '👤 Choose your role to continue!'}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}
