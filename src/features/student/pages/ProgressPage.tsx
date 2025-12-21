import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  CircularProgress,
  LinearProgress,
  Card,
  CardContent,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@app/hooks/app.hooks';
import { fetchProgress } from '@features/student/redux/slices/student.slice';

export const ProgressPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { progress, isLoading } = useAppSelector((state) => state.student);

  useEffect(() => {
    dispatch(fetchProgress());
  }, [dispatch]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const completionPercentage = progress
    ? Math.round((progress.exercisesCompleted / progress.totalExercises) * 100)
    : 0;

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/student')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">My Progress</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Your Learning Progress
        </Typography>

        {progress ? (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>
                      Current Reading Level
                    </Typography>
                    <Typography variant="h3">{progress.currentLevel}</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>
                      Average Score
                    </Typography>
                    <Typography variant="h3">{progress.averageScore}%</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>
                      Exercises Completed
                    </Typography>
                    <Typography variant="h3">
                      {progress.exercisesCompleted}/{progress.totalExercises}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Overall Progress
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={completionPercentage}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                  <Typography variant="body2" color="text.secondary">
                    {completionPercentage}%
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Last activity: {new Date(progress.lastActivityAt).toLocaleDateString()}
              </Typography>
            </Paper>

            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Keep Going!
              </Typography>
              <Typography variant="body1" paragraph>
                You're doing great! Keep practicing to improve your reading skills.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {progress.exercisesCompleted > 0
                  ? `You've completed ${progress.exercisesCompleted} exercise${
                      progress.exercisesCompleted === 1 ? '' : 's'
                    }. Keep up the good work!`
                  : 'Start your first exercise to begin your learning journey!'}
              </Typography>
            </Paper>
          </>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No progress data available yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Complete an assessment or exercise to start tracking your progress
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
};
