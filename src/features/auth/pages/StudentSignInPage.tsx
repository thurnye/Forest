import { Box, CardMedia, TextField, Button, Typography, Alert } from '@mui/material';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import logo from '../../../assets/logo.png';
import loginBg from '../../../assets/student-login-bg.png';
import scroll from '../../../assets/scroll.png';
import { useAppDispatch, useAppSelector } from '@app/hooks/app.hooks';
import { login, clearError } from '@features/auth/redux/slices/auth.slice';
import { sanitizeInput } from '@shared/utils/security.utils';
import { rateLimiter } from '@shared/utils/botDetection.utils';

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function StudentSignInPage() {
  const dispatch = useAppDispatch();
  const { error, isLoading } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'student@test.com',
      password: '123456',
    },
  });

  useEffect(() => {
    // Clear any previous errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (data: LoginFormData) => {
    // Check rate limiting
    if (rateLimiter.isRateLimited('login', 5, 60000)) {
      alert('Too many login attempts. Please try again later.');
      return;
    }

    // Sanitize inputs
    const sanitizedData = {
      email: sanitizeInput(data.email),
      password: data.password, // Don't sanitize password
    };

    const result = await dispatch(login(sanitizedData));

    if (login.fulfilled.match(result)) {
      // Login successful - navigation handled by ProtectedRoute
      rateLimiter.clear('login');
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
            component="form"
            onSubmit={handleSubmit(onSubmit)}
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

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 2, fontFamily: '"Comic Sans MS", cursive' }}>
                {error}
              </Alert>
            )}

            {/* Email Input */}
            <TextField
              {...register('email')}
              fullWidth
              placeholder="Enter Your Email"
              type="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                sx: {
                  backgroundColor: '#fff',
                  borderRadius: 4,
                  fontSize: { xs: '0.95rem', sm: '1.1rem' },
                  fontFamily: '"Comic Sans MS", cursive',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  '& input': {
                    textAlign: 'center',
                    caretColor: '#FF6B6B',
                    '&::selection': {
                      backgroundColor: '#FFD700',
                      color: '#5a3a22',
                    },
                  },
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
              FormHelperTextProps={{
                sx: {
                  fontFamily: '"Comic Sans MS", cursive',
                  textAlign: 'center',
                },
              }}
              sx={{ mb: 3 }}
            />

            {/* Password Input */}
            <TextField
              {...register('password')}
              fullWidth
              placeholder="Enter Your Password"
              type="password"
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                sx: {
                  backgroundColor: '#fff',
                  borderRadius: 4,
                  fontSize: { xs: '0.95rem', sm: '1.1rem' },
                  fontFamily: '"Comic Sans MS", cursive',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  '& input': {
                    textAlign: 'center',
                    caretColor: '#FF6B6B',
                    '&::selection': {
                      backgroundColor: '#FFD700',
                      color: '#5a3a22',
                    },
                  },
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
              FormHelperTextProps={{
                sx: {
                  fontFamily: '"Comic Sans MS", cursive',
                  textAlign: 'center',
                },
              }}
              sx={{ mb: 3 }}
            />

            {/* Start Adventure Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                py: 2,
                borderRadius: 4,
                fontSize: { xs: '1.2rem', sm: '1.4rem' },
                fontWeight: 900,
                fontFamily: '"Comic Sans MS", cursive',
                textTransform: 'none',
                background: isLoading
                  ? 'linear-gradient(135deg, #999 0%, #666 100%)'
                  : 'linear-gradient(135deg, #FF6B6B 0%, #EE5A24 100%)',
                color: '#fff',
                border: '4px solid',
                borderColor: isLoading ? '#666' : '#C23616',
                boxShadow: isLoading
                  ? '0 4px 0 #555'
                  : '0 6px 0 #C23616, 0 8px 20px rgba(238,90,36,0.4)',
                animation: isLoading ? 'none' : 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': {
                    boxShadow: '0 6px 0 #C23616, 0 8px 20px rgba(238,90,36,0.4)',
                  },
                  '50%': {
                    boxShadow: '0 6px 0 #C23616, 0 8px 30px rgba(238,90,36,0.6)',
                  },
                },
                '&:hover': {
                  background: isLoading
                    ? 'linear-gradient(135deg, #999 0%, #666 100%)'
                    : 'linear-gradient(135deg, #FF8787 0%, #FF6348 100%)',
                  transform: isLoading ? 'none' : 'translateY(-4px)',
                  boxShadow: isLoading
                    ? '0 4px 0 #555'
                    : '0 8px 0 #C23616, 0 12px 24px rgba(238,90,36,0.5)',
                },
                '&:active': {
                  transform: isLoading ? 'none' : 'translateY(2px)',
                  boxShadow: isLoading ? '0 2px 0 #555' : '0 2px 0 #C23616',
                },
                '&.Mui-disabled': {
                  background: 'linear-gradient(135deg, #999 0%, #666 100%)',
                  color: '#ccc',
                },
              }}
            >
              {isLoading ? '🔄 Signing In...' : '🚀 Start Your Adventure! 🚀'}
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}
