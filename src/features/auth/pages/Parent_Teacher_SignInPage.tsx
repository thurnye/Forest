import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Link as MuiLink,
} from '@mui/material';
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

export const Parent_Teacher_SignInPage = () => {
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
      password: '123456' 
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
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Reading Forest
          </Typography>
          <Typography variant="h6" component="h2" gutterBottom align="center" color="text.secondary">
            Sign In
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
            <TextField
              {...register('email')}
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              error={!!errors.email}
              helperText={errors.email?.message}
              autoComplete="email"
            />

            <TextField
              {...register('password')}
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              error={!!errors.password}
              helperText={errors.password?.message}
              autoComplete="current-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                Don't have an account?{' '}
                <MuiLink component={Link} to="/signup" underline="hover">
                  Sign Up
                </MuiLink>
              </Typography>
            </Box>

            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary" component="div">
                <strong>Test Accounts:</strong>
                <br />
                Student: student@test.com
                <br />
                Parent: parent@test.com
                <br />
                Teacher: teacher@test.com
                <br />
                Password: any
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
