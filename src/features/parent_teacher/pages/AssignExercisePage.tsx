import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@app/hooks/app.hooks';
import {
  fetchAvailableExercises,
  fetchStudentDetail,
  assignExercise,
} from '@features/parent_teacher/redux/slices/parent_teacher.slice';

export const AssignExercisePage = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { availableExercises, selectedStudent, isLoading } = useAppSelector(
    (state) => state.parentTeacher
  );
  const [assignedExerciseId, setAssignedExerciseId] = useState<string | null>(null);

  useEffect(() => {
    if (studentId) {
      dispatch(fetchStudentDetail(studentId));
      dispatch(fetchAvailableExercises());
    }
  }, [dispatch, studentId]);

  const handleAssignExercise = async (exerciseId: string) => {
    if (!studentId) return;

    const result = await dispatch(assignExercise({ studentId, exerciseId }));
    if (assignExercise.fulfilled.match(result)) {
      setAssignedExerciseId(exerciseId);
      setTimeout(() => {
        navigate(`/parent-teacher/students/${studentId}`);
      }, 2000);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

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
          <Typography variant="h6">
            Assign Exercise to {selectedStudent?.firstName}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Available Exercises
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Select an exercise to assign to {selectedStudent?.firstName}
        </Typography>

        {assignedExerciseId && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Exercise assigned successfully! Redirecting...
          </Alert>
        )}

        <Grid container spacing={3}>
          {availableExercises.map((exercise) => (
            <Grid item xs={12} md={6} key={exercise.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Chip label={exercise.readingLevel} color="primary" size="small" />
                    {exercise.isCompleted && <Chip label="Completed" color="success" size="small" />}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {exercise.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {exercise.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {exercise.questions?.length || 0} questions
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="large"
                    variant="contained"
                    fullWidth
                    onClick={() => handleAssignExercise(exercise.id)}
                    disabled={assignedExerciseId === exercise.id}
                  >
                    {assignedExerciseId === exercise.id ? 'Assigned!' : 'Assign Exercise'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {availableExercises.length === 0 && !isLoading && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No exercises available
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
};
