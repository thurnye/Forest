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
  AppBar,
  Toolbar,
  IconButton,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@app/hooks/app.hooks';
import { logout } from '@features/auth/redux/slices/auth.slice';
import { fetchStudents } from '@features/parent_teacher/redux/slices/parent_teacher.slice';

export const ParentTeacherDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { students, isLoading } = useAppSelector((state) => state.parentTeacher);

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Reading Forest - {user?.role === 'parent' ? 'Parent' : 'Teacher'}
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            {user?.firstName} {user?.lastName}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.firstName}!
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PeopleIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h6">My Students</Typography>
                    <Typography variant="body2" color="text.secondary">
                      View and manage student progress
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate('/parent-teacher/students')}
                >
                  View All Students
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonAddIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h6">Add Student</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Link or create a new student account
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/parent-teacher/students')}
                >
                  Add New Student
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Student Overview
          </Typography>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : students.length > 0 ? (
            <Grid container spacing={2}>
              {students.slice(0, 3).map((student) => (
                <Grid item xs={12} sm={6} md={4} key={student.id}>
                  <Card
                    sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
                    onClick={() => navigate(`/parent-teacher/students/${student.id}`)}
                  >
                    <CardContent>
                      <Typography variant="h6">
                        {student.firstName} {student.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {student.email}
                      </Typography>
                      {student.readingLevel && (
                        <Chip
                          label={student.readingLevel}
                          size="small"
                          color="primary"
                          sx={{ mt: 1 }}
                        />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
              No students linked yet. Add a student to get started.
            </Typography>
          )}

          {students.length > 3 && (
            <Button
              variant="text"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => navigate('/parent-teacher/students')}
            >
              View All {students.length} Students
            </Button>
          )}
        </Paper>
      </Container>
    </Box>
  );
};
