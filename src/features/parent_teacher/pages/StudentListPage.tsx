import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tab,
  Tabs,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@app/hooks/app.hooks';
import {
  fetchStudents,
  linkStudent,
  createStudent,
  clearError,
} from '@features/parent_teacher/redux/slices/parent_teacher.slice';
import { sanitizeInput } from '@shared/utils/security.utils';
import { ReadingLevel } from '@shared/types/api.types';

const linkSchema = z.object({
  studentEmail: z.string().email('Invalid email address'),
});

const createSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  targetGradeLevel: z.nativeEnum(ReadingLevel),
  diagnosticEnabled: z.boolean(),
});

type LinkFormData = z.infer<typeof linkSchema>;
type CreateFormData = z.infer<typeof createSchema>;

export const StudentListPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { students, isLoading, error } = useAppSelector((state) => state.parentTeacher);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const linkForm = useForm<LinkFormData>({
    resolver: zodResolver(linkSchema),
  });

  const createForm = useForm<CreateFormData>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      targetGradeLevel: ReadingLevel.KINDERGARTEN,
      diagnosticEnabled: true,
    },
  });

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  const handleLinkStudent = async (data: LinkFormData) => {
    const result = await dispatch(linkStudent({ studentEmail: sanitizeInput(data.studentEmail) }));
    if (linkStudent.fulfilled.match(result)) {
      setDialogOpen(false);
      linkForm.reset();
    }
  };

  const handleCreateStudent = async (data: CreateFormData) => {
    const result = await dispatch(
      createStudent({
        email: sanitizeInput(data.email),
        firstName: sanitizeInput(data.firstName),
        lastName: sanitizeInput(data.lastName),
        password: data.password,
        targetGradeLevel: data.targetGradeLevel,
        diagnosticEnabled: data.diagnosticEnabled,
      })
    );
    if (createStudent.fulfilled.match(result)) {
      setDialogOpen(false);
      createForm.reset();
    }
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/parent-teacher')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            My Students
          </Typography>
          <Button
            color="inherit"
            startIcon={<PersonAddIcon />}
            onClick={() => {
              dispatch(clearError());
              setDialogOpen(true);
            }}
          >
            Add Student
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : students.length > 0 ? (
          <Grid container spacing={3}>
            {students.map((student) => (
              <Grid item xs={12} sm={6} md={4} key={student.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 6 },
                    transition: 'box-shadow 0.3s',
                  }}
                  onClick={() => navigate(`/parent-teacher/students/${student.id}`)}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {student.firstName} {student.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {student.email}
                    </Typography>
                    {student.readingLevel && (
                      <Chip label={student.readingLevel} size="small" color="primary" sx={{ mt: 1 }} />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No students yet
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Add your first student to get started
            </Typography>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={() => setDialogOpen(true)}
            >
              Add Student
            </Button>
          </Paper>
        )}
      </Container>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Student</DialogTitle>
        <DialogContent>
          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ mb: 2 }}>
            <Tab label="Link Existing" />
            <Tab label="Create New" />
          </Tabs>

          {tabValue === 0 ? (
            <Box component="form" onSubmit={linkForm.handleSubmit(handleLinkStudent)}>
              <Typography variant="body2" color="text.secondary" paragraph>
                Enter the email of an existing student account to link them to your profile.
              </Typography>
              <TextField
                {...linkForm.register('studentEmail')}
                fullWidth
                label="Student Email"
                type="email"
                margin="normal"
                error={!!linkForm.formState.errors.studentEmail}
                helperText={linkForm.formState.errors.studentEmail?.message}
              />
              <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                Link Student
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={createForm.handleSubmit(handleCreateStudent)}>
              <Typography variant="body2" color="text.secondary" paragraph>
                Create a new student account.
              </Typography>
              <TextField
                {...createForm.register('firstName')}
                fullWidth
                label="First Name"
                margin="normal"
                error={!!createForm.formState.errors.firstName}
                helperText={createForm.formState.errors.firstName?.message}
              />
              <TextField
                {...createForm.register('lastName')}
                fullWidth
                label="Last Name"
                margin="normal"
                error={!!createForm.formState.errors.lastName}
                helperText={createForm.formState.errors.lastName?.message}
              />
              <TextField
                {...createForm.register('email')}
                fullWidth
                label="Email"
                type="email"
                margin="normal"
                error={!!createForm.formState.errors.email}
                helperText={createForm.formState.errors.email?.message}
              />
              <TextField
                {...createForm.register('password')}
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                error={!!createForm.formState.errors.password}
                helperText={createForm.formState.errors.password?.message}
              />
              <FormControl fullWidth margin="normal" error={!!createForm.formState.errors.targetGradeLevel}>
                <InputLabel>Target Grade Level</InputLabel>
                <Select
                  {...createForm.register('targetGradeLevel')}
                  defaultValue={ReadingLevel.KINDERGARTEN}
                  label="Target Grade Level"
                >
                  <MenuItem value={ReadingLevel.PRE_K}>Pre-K</MenuItem>
                  <MenuItem value={ReadingLevel.KINDERGARTEN}>Kindergarten</MenuItem>
                  <MenuItem value={ReadingLevel.GRADE_1}>Grade 1</MenuItem>
                  <MenuItem value={ReadingLevel.GRADE_2}>Grade 2</MenuItem>
                  <MenuItem value={ReadingLevel.GRADE_3}>Grade 3</MenuItem>
                  <MenuItem value={ReadingLevel.GRADE_4}>Grade 4</MenuItem>
                  <MenuItem value={ReadingLevel.GRADE_5}>Grade 5</MenuItem>
                </Select>
                {createForm.formState.errors.targetGradeLevel && (
                  <FormHelperText>{createForm.formState.errors.targetGradeLevel.message}</FormHelperText>
                )}
              </FormControl>
              <FormControlLabel
                control={
                  <Switch
                    {...createForm.register('diagnosticEnabled')}
                    defaultChecked={true}
                  />
                }
                label="Enable diagnostic assessment on first login"
                sx={{ mt: 2, mb: 1 }}
              />
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                When enabled, the student will take a placement test on their first login to determine their starting level.
              </Typography>
              <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                Create Student
              </Button>
            </Box>
          )}

          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
