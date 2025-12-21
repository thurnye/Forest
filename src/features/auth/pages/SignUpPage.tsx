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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '@app/hooks/app.hooks';
import { signup, clearError } from '@features/auth/redux/slices/auth.slice';
import { UserRole } from '@shared/types/api.types';
import { sanitizeInput, validatePassword } from '@shared/utils/security.utils';
import { rateLimiter, performBotCheck } from '@shared/utils/botDetection.utils';

// Validation schema
const signupSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    role: z.nativeEnum(UserRole),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export const SignUpPage = () => {
  const dispatch = useAppDispatch();
  const { error, isLoading } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: UserRole.STUDENT,
    },
  });

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (data: SignupFormData) => {
    // Check rate limiting
    if (rateLimiter.isRateLimited('signup', 3, 60000)) {
      alert('Too many signup attempts. Please try again later.');
      return;
    }

    // Perform bot detection
    const botCheck = performBotCheck();
    if (botCheck.isLikelyBot) {
      console.warn('Bot detection triggered:', botCheck.reasons);
    }

    // Validate password strength
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      alert(passwordValidation.message);
      return;
    }

    // Sanitize inputs
    const sanitizedData = {
      email: sanitizeInput(data.email),
      password: data.password,
      firstName: sanitizeInput(data.firstName),
      lastName: sanitizeInput(data.lastName),
      role: data.role,
    };

    const result = await dispatch(signup(sanitizedData));

    if (signup.fulfilled.match(result)) {
      rateLimiter.clear('signup');
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
          py: 4,
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Reading Forest
          </Typography>
          <Typography variant="h6" component="h2" gutterBottom align="center" color="text.secondary">
            Create Account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
            <TextField
              {...register('firstName')}
              fullWidth
              label="First Name"
              margin="normal"
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              autoComplete="given-name"
            />

            <TextField
              {...register('lastName')}
              fullWidth
              label="Last Name"
              margin="normal"
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              autoComplete="family-name"
            />

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

            <FormControl fullWidth margin="normal" error={!!errors.role}>
              <InputLabel>I am a...</InputLabel>
              <Select {...register('role')} label="I am a..." defaultValue={UserRole.STUDENT}>
                <MenuItem value={UserRole.STUDENT}>Student</MenuItem>
                <MenuItem value={UserRole.PARENT}>Parent</MenuItem>
                <MenuItem value={UserRole.TEACHER}>Teacher</MenuItem>
              </Select>
              {errors.role && <FormHelperText>{errors.role.message}</FormHelperText>}
            </FormControl>

            <TextField
              {...register('password')}
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              error={!!errors.password}
              helperText={errors.password?.message || 'At least 8 characters with uppercase, lowercase, and number'}
              autoComplete="new-password"
            />

            <TextField
              {...register('confirmPassword')}
              fullWidth
              label="Confirm Password"
              type="password"
              margin="normal"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              autoComplete="new-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <MuiLink component={Link} to="/login" underline="hover">
                  Sign In
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
