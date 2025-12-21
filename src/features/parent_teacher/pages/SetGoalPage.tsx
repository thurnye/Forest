import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { parentTeacherApiService } from '@features/parent_teacher/services/parent_teacher.api.service';
import { sanitizeInput } from '@shared/utils/security.utils';

// Validation schema
const goalSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  targetValue: z.number().min(1, 'Target value must be at least 1'),
  unit: z.enum(['exercises', 'score', 'reading-time']),
  deadline: z.string().min(1, 'Deadline is required'),
});

type GoalFormData = z.infer<typeof goalSchema>;

export const SetGoalPage = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      unit: 'exercises',
      targetValue: 5,
    },
  });

  const onSubmit = async (data: GoalFormData) => {
    if (!studentId) return;

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await parentTeacherApiService.setGoal({
        studentId,
        title: sanitizeInput(data.title),
        description: sanitizeInput(data.description),
        targetValue: data.targetValue,
        unit: data.unit,
        deadline: data.deadline,
      });

      setSuccessMessage('Goal set successfully!');
      reset();

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate(`/parent-teacher/students/${studentId}`);
      }, 2000);
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to set goal');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate(`/parent-teacher/students/${studentId}`)}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">Set Goal for Student</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Create a New Goal
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Set a learning goal to help your student stay motivated and track their progress.
          </Typography>

          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <TextField
              {...register('title')}
              fullWidth
              label="Goal Title"
              margin="normal"
              error={!!errors.title}
              helperText={errors.title?.message}
              placeholder="e.g., Complete 5 Reading Exercises"
            />

            <TextField
              {...register('description')}
              fullWidth
              label="Description"
              margin="normal"
              multiline
              rows={3}
              error={!!errors.description}
              helperText={errors.description?.message}
              placeholder="Describe what the student needs to achieve"
            />

            <FormControl fullWidth margin="normal" error={!!errors.unit}>
              <InputLabel>Goal Type</InputLabel>
              <Select {...register('unit')} label="Goal Type" defaultValue="exercises">
                <MenuItem value="exercises">Number of Exercises</MenuItem>
                <MenuItem value="score">Average Score (%)</MenuItem>
                <MenuItem value="reading-time">Reading Time (minutes)</MenuItem>
              </Select>
              {errors.unit && <FormHelperText>{errors.unit.message}</FormHelperText>}
            </FormControl>

            <TextField
              {...register('targetValue', { valueAsNumber: true })}
              fullWidth
              label="Target Value"
              type="number"
              margin="normal"
              error={!!errors.targetValue}
              helperText={errors.targetValue?.message}
              inputProps={{ min: 1 }}
            />

            <TextField
              {...register('deadline')}
              fullWidth
              label="Deadline"
              type="date"
              margin="normal"
              error={!!errors.deadline}
              helperText={errors.deadline?.message}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: minDate,
              }}
            />

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Setting Goal...' : 'Set Goal'}
              </Button>
              <Button
                variant="outlined"
                size="large"
                fullWidth
                onClick={() => navigate(`/parent-teacher/students/${studentId}`)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
