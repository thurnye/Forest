import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@app/hooks/app.hooks';
import { fetchExercises } from '@features/student/redux/slices/student.slice';

export const ExercisesListPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { exercises, isLoading } = useAppSelector((state) => state.student);

  useEffect(() => {
    dispatch(fetchExercises());
  }, [dispatch]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/student')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">Practice Exercises</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Your Exercises
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Complete these exercises to improve your reading skills
        </Typography>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {exercises.map((exercise) => (
              <Grid item xs={12} md={6} key={exercise.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Chip
                        label={exercise.readingLevel}
                        color="primary"
                        size="small"
                      />
                      {exercise.isCompleted && (
                        <CheckCircleIcon color="success" />
                      )}
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {exercise.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {exercise.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      {exercise.questions.length} questions
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="large"
                      variant={exercise.isCompleted ? 'outlined' : 'contained'}
                      fullWidth
                      onClick={() => navigate(`/student/exercises/${exercise.id}`)}
                    >
                      {exercise.isCompleted ? 'Review' : 'Start Exercise'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {!isLoading && exercises.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No exercises available yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Take an assessment to get personalized exercises
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => navigate('/student/assessment')}
            >
              Take Assessment
            </Button>
          </Paper>
        )}
      </Container>
    </Box>
  );
};
