import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  AppBar,
  Toolbar,
  IconButton,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  MenuBook as MenuBookIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  Logout as LogoutIcon,
  Flag as FlagIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@app/hooks/app.hooks';
import { logout } from '@features/auth/redux/slices/auth.slice';
import { fetchProgress, fetchGoals } from '@features/student/redux/slices/student.slice';
import { Student, UserRole } from '@shared/types/api.types';

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const student = user?.role === UserRole.STUDENT ? (user as Student) : null;
  const { progress, goals } = useAppSelector((state) => state.student);

  useEffect(() => {
    // Check if student needs to take diagnostic
    if (student && student.diagnosticEnabled && !student.hasCompletedDiagnostic) {
      navigate('/student/diagnostic/warmup');
      return;
    }

    dispatch(fetchProgress());
    dispatch(fetchGoals());
  }, [dispatch, student, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Reading Forest - Student
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            {user?.firstName} {user?.lastName}
          </Typography>
          <Button
            color='inherit'
            startIcon={<FlagIcon />}
            onClick={() =>
              navigate(`/student/explorer`)
            }
            sx={{ mr: 1 }}
          >
            Explorer
          </Button>
          <Button
            color='inherit'
            startIcon={<FlagIcon />}
            onClick={() =>
              navigate(`/student/explorer/testingPage`)
            }
            sx={{ mr: 1 }}
          >
            Testing Page
          </Button>
          <Button
            color='inherit'
            startIcon={<FlagIcon />}
            onClick={() =>
              navigate(`/student/welcome`)
            }
            sx={{ mr: 1 }}
          >
            game
          </Button>

          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.firstName}!
        </Typography>

        {progress && (
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Your Progress
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Current Level
                </Typography>
                <Typography variant="h6">{progress.currentLevel}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Exercises Completed
                </Typography>
                <Typography variant="h6">
                  {progress.exercisesCompleted} / {progress.totalExercises}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Average Score
                </Typography>
                <Typography variant="h6">{progress.averageScore}%</Typography>
              </Grid>
            </Grid>
          </Paper>
        )}

        {goals.length > 0 && (
          <Paper sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FlagIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">Your Goals</Typography>
            </Box>
            <Grid container spacing={2}>
              {goals.map((goal) => {
                const progressPercentage = Math.round(
                  (goal.currentValue / goal.targetValue) * 100
                );
                const isOverdue = new Date(goal.deadline) < new Date() && !goal.isCompleted;
                const daysLeft = Math.ceil(
                  (new Date(goal.deadline).getTime() - new Date().getTime()) /
                    (1000 * 60 * 60 * 24)
                );

                return (
                  <Grid item xs={12} md={6} key={goal.id}>
                    <Card
                      sx={{
                        border: goal.isCompleted ? '2px solid #4caf50' : 'none',
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>
                            {goal.title}
                          </Typography>
                          {goal.isCompleted && (
                            <Chip label="Completed" color="success" size="small" />
                          )}
                          {isOverdue && (
                            <Chip label="Overdue" color="error" size="small" />
                          )}
                        </Box>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {goal.description}
                        </Typography>

                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              Progress: {goal.currentValue} / {goal.targetValue}{' '}
                              {goal.unit === 'exercises'
                                ? 'exercises'
                                : goal.unit === 'score'
                                ? '%'
                                : 'minutes'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {progressPercentage}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(progressPercentage, 100)}
                            sx={{ height: 8, borderRadius: 4 }}
                            color={goal.isCompleted ? 'success' : 'primary'}
                          />
                        </Box>

                        <Typography variant="caption" color="text.secondary">
                          {goal.isCompleted
                            ? 'Goal achieved! '
                            : isOverdue
                            ? 'Deadline passed'
                            : daysLeft === 0
                            ? 'Due today'
                            : daysLeft === 1
                            ? 'Due tomorrow'
                            : `${daysLeft} days left`}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AssessmentIcon sx={{ fontSize: 40, color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6">Take Assessment</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Find out your reading level with a quick assessment
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="large"
                  variant="contained"
                  fullWidth
                  onClick={() => navigate('/student/assessment')}
                >
                  Start Assessment
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MenuBookIcon sx={{ fontSize: 40, color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6">Practice Exercises</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Work on reading exercises tailored to your level
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="large"
                  variant="contained"
                  fullWidth
                  onClick={() => navigate('/student/exercises')}
                >
                  View Exercises
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUpIcon sx={{ fontSize: 40, color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6">View Progress</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  See how you're improving over time
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="large"
                  variant="contained"
                  fullWidth
                  onClick={() => navigate('/student/progress')}
                >
                  View Progress
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
