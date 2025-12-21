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
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Chip,
  CircularProgress,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Snackbar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Assignment as AssignmentIcon,
  Flag as FlagIcon,
  Psychology as PsychologyIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { SkillStrand, SkillLevel } from '@shared/types/api.types';
import { useAppDispatch, useAppSelector } from '@app/hooks/app.hooks';
import {
  fetchStudentDetail,
  clearSelectedStudent,
  updateStudent,
} from '@features/parent_teacher/redux/slices/parent_teacher.slice';
import { parentTeacherApiService } from '@features/parent_teacher/services/parent_teacher.api.service';
import { EditStudentDialog } from '@features/parent_teacher/components/EditStudentDialog';
import { ReadingLevel } from '@shared/types/api.types';

const strandLabels: Record<SkillStrand, string> = {
  [SkillStrand.PHONOLOGICAL_AWARENESS]: 'Sound Awareness',
  [SkillStrand.PHONICS]: 'Letter Sounds',
  [SkillStrand.VOCABULARY]: 'Words & Meanings',
  [SkillStrand.COMPREHENSION]: 'Understanding',
  [SkillStrand.FLUENCY]: 'Reading Smoothly',
};

const skillLevelLabels: Record<SkillLevel, string> = {
  [SkillLevel.BELOW_GRADE]: 'Developing',
  [SkillLevel.ON_GRADE]: 'On Track',
  [SkillLevel.ABOVE_GRADE]: 'Excelling',
};

const skillLevelColors: Record<SkillLevel, 'warning' | 'info' | 'success'> = {
  [SkillLevel.BELOW_GRADE]: 'warning',
  [SkillLevel.ON_GRADE]: 'info',
  [SkillLevel.ABOVE_GRADE]: 'success',
};

export const StudentDetailPage = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedStudent, isLoading } = useAppSelector(
    (state) => state.parentTeacher
  );
  const [isTogglingDiagnostic, setIsTogglingDiagnostic] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [diagnosticDialogOpen, setDiagnosticDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    if (studentId) {
      dispatch(fetchStudentDetail(studentId));
    }

    return () => {
      dispatch(clearSelectedStudent());
    };
  }, [dispatch, studentId]);

  const handleToggleDiagnostic = async () => {
    if (!studentId || !selectedStudent) return;

    setIsTogglingDiagnostic(true);

    try {
      const newStatus = !selectedStudent.diagnosticEnabled;
      console.log(studentId, newStatus);
      const result = await parentTeacherApiService.toggleDiagnostic(
        studentId,
        newStatus
      );

      if (result.success) {
        setSnackbarMessage(result.message || 'Diagnostic status updated');
        setSnackbarOpen(true);

        // Refresh student details
        dispatch(fetchStudentDetail(studentId));
      }
    } catch (error: any) {
      setSnackbarMessage(error.message || 'Failed to update diagnostic status');
      setSnackbarOpen(true);
    } finally {
      setIsTogglingDiagnostic(false);
    }
  };

  const handleUpdateStudent = async (
    studentId: string,
    data: {
      firstName: string;
      lastName: string;
      email: string;
      targetGradeLevel: ReadingLevel;
    }
  ) => {
    await dispatch(
      updateStudent({
        studentId,
        ...data,
      })
    ).unwrap();

    setSnackbarMessage('Student information updated successfully');
    setSnackbarOpen(true);
  };

  if (isLoading || !selectedStudent) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const completionPercentage = Math.round(
    (selectedStudent.progress.exercisesCompleted /
      selectedStudent.progress.totalExercises) *
      100
  );

  return (
    <Box>
      <AppBar position='static'>
        <Toolbar>
          <IconButton
            edge='start'
            color='inherit'
            onClick={() => navigate('/parent-teacher/students')}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant='h6' sx={{ flexGrow: 1 }}>
            {selectedStudent.firstName} {selectedStudent.lastName}
          </Typography>
          <Button
            color='inherit'
            startIcon={<PsychologyIcon />}
            onClick={handleToggleDiagnostic}
            disabled={isTogglingDiagnostic}
            sx={{ mr: 1 }}
          >
            {selectedStudent.diagnosticEnabled
              ? 'Disable Diagnostic'
              : 'Enable Diagnostic'}
          </Button>
          <Button
            color='inherit'
            startIcon={<FlagIcon />}
            onClick={() =>
              navigate(`/parent-teacher/students/${studentId}/set-goal`)
            }
            sx={{ mr: 1 }}
          >
            Set Goal
          </Button>
          <Button
            color='inherit'
            startIcon={<AssignmentIcon />}
            onClick={() =>
              navigate(`/parent-teacher/students/${studentId}/assign`)
            }
          >
            Assign Exercise
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant='h5'>
              Student Information
            </Typography>
            <Button
              variant='outlined'
              size='small'
              onClick={() => setEditDialogOpen(true)}
            >
              Edit
            </Button>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant='body2' color='text.secondary'>
                Name
              </Typography>
              <Typography variant='body1'>
                {selectedStudent.firstName} {selectedStudent.lastName}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant='body2' color='text.secondary'>
                Email
              </Typography>
              <Typography variant='body1'>{selectedStudent.email}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant='body2' color='text.secondary'>
                Reading Level
              </Typography>
              <Chip
                label={selectedStudent.readingLevel || 'Not assessed'}
                color={selectedStudent.readingLevel ? 'primary' : 'default'}
                sx={{ mt: 0.5 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant='body2' color='text.secondary'>
                Target Grade Level
              </Typography>
              <Typography variant='body1'>
                {selectedStudent.targetGradeLevel
                  ? selectedStudent.targetGradeLevel
                      .replace('-', ' ')
                      .toUpperCase()
                  : 'Not set'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography variant='body2' color='text.secondary'>
                  Diagnostic Status
                </Typography>
              </Box>
              <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={
                    selectedStudent.hasCompletedDiagnostic
                      ? 'Completed'
                      : selectedStudent.diagnosticEnabled
                      ? 'Pending'
                      : 'Disabled'
                  }
                  color={
                    selectedStudent.hasCompletedDiagnostic
                      ? 'success'
                      : selectedStudent.diagnosticEnabled
                      ? 'warning'
                      : 'default'
                  }
                  size='small'
                />
                {selectedStudent.hasCompletedDiagnostic && selectedStudent.diagnosticResult && (
                  <IconButton
                    size='small'
                    color='primary'
                    onClick={() => setDiagnosticDialogOpen(true)}
                    title='View diagnostic results'
                  >
                    <VisibilityIcon fontSize='small' />
                  </IconButton>
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Typography variant='h5' gutterBottom>
          Progress Overview
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant='h6' color='primary' gutterBottom>
                  Current Level
                </Typography>
                <Typography variant='h4'>
                  {selectedStudent.progress.currentLevel}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant='h6' color='primary' gutterBottom>
                  Average Score
                </Typography>
                <Typography variant='h4'>
                  {selectedStudent.progress.averageScore}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant='h6' color='primary' gutterBottom>
                  Exercises Completed
                </Typography>
                <Typography variant='h4'>
                  {selectedStudent.progress.exercisesCompleted}/
                  {selectedStudent.progress.totalExercises}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant='h6' gutterBottom>
            Overall Progress
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
              <LinearProgress
                variant='determinate'
                value={completionPercentage}
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
            <Box sx={{ minWidth: 35 }}>
              <Typography variant='body2' color='text.secondary'>
                {completionPercentage}%
              </Typography>
            </Box>
          </Box>
          <Typography variant='body2' color='text.secondary' sx={{ mt: 2 }}>
            Last activity:{' '}
            {new Date(
              selectedStudent.progress.lastActivityAt
            ).toLocaleDateString()}
          </Typography>
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant='h6' gutterBottom>
            Recent Exercise Attempts
          </Typography>
          {selectedStudent.recentExerciseAttempts &&
          selectedStudent.recentExerciseAttempts.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Exercise ID</TableCell>
                    <TableCell>Score</TableCell>
                    <TableCell>Time Spent</TableCell>
                    <TableCell>Feedback</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedStudent.recentExerciseAttempts.map((attempt) => {
                    const minutes = Math.floor(attempt.timeSpentSeconds / 60);
                    const seconds = attempt.timeSpentSeconds % 60;
                    const timeDisplay =
                      minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

                    return (
                      <TableRow key={attempt.id}>
                        <TableCell>
                          {new Date(attempt.completedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{attempt.exerciseId}</TableCell>
                        <TableCell>
                          <Chip
                            label={`${attempt.score}%`}
                            size='small'
                            color={
                              attempt.score >= 80
                                ? 'success'
                                : attempt.score >= 60
                                ? 'warning'
                                : 'error'
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={timeDisplay}
                            size='small'
                            variant='outlined'
                          />
                        </TableCell>
                        <TableCell>{attempt.feedback}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant='body2' color='text.secondary'>
              No exercise attempts yet
            </Typography>
          )}
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant='h6' gutterBottom>
            Recent Assessments
          </Typography>
          {selectedStudent.recentAssessments.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Reading Level</TableCell>
                    <TableCell>Score</TableCell>
                    <TableCell>Feedback</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedStudent.recentAssessments.map((assessment) => (
                    <TableRow key={assessment.id}>
                      <TableCell>
                        {new Date(assessment.completedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={assessment.readingLevel}
                          size='small'
                          color='primary'
                        />
                      </TableCell>
                      <TableCell>{assessment.score}%</TableCell>
                      <TableCell>{assessment.feedback}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant='body2' color='text.secondary'>
              No assessments completed yet
            </Typography>
          )}
        </Paper>

      </Container>

      {/* Edit Student Dialog */}
      <EditStudentDialog
        open={editDialogOpen}
        student={selectedStudent}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleUpdateStudent}
      />

      {/* Diagnostic Results Dialog */}
      <Dialog
        open={diagnosticDialogOpen}
        onClose={() => setDiagnosticDialogOpen(false)}
        maxWidth='md'
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 28, color: 'success.main', mr: 1 }} />
              <Typography variant='h6' fontWeight='medium'>
                Diagnostic Assessment Results
              </Typography>
            </Box>
            <IconButton
              edge='end'
              color='inherit'
              onClick={() => setDiagnosticDialogOpen(false)}
              aria-label='close'
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedStudent.diagnosticResult && (
            <>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                Completed on{' '}
                {new Date(
                  selectedStudent.diagnosticResult.completedAt
                ).toLocaleDateString()}
              </Typography>

              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Card
                    sx={{
                      background:
                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography
                        variant='body2'
                        gutterBottom
                        sx={{ opacity: 0.9 }}
                      >
                        Overall Placement
                      </Typography>
                      <Typography variant='h4' fontWeight='bold'>
                        {selectedStudent.diagnosticResult.overallPlacement
                          .replace('-', ' ')
                          .toUpperCase()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        gutterBottom
                      >
                        Recommended Starting Level
                      </Typography>
                      <Typography variant='h4' fontWeight='bold' color='primary'>
                        {selectedStudent.diagnosticResult.recommendedStartingLevel
                          .replace('-', ' ')
                          .toUpperCase()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant='h6' gutterBottom fontWeight='medium' sx={{ mb: 2 }}>
                Skill Breakdown
              </Typography>

              <Grid container spacing={2}>
                {selectedStudent.diagnosticResult.strandResults.map((result) => (
                  <Grid item xs={12} sm={6} key={result.strand}>
                    <Card variant='outlined'>
                      <CardContent>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2,
                          }}
                        >
                          <Typography variant='subtitle1' fontWeight='medium'>
                            {strandLabels[result.strand]}
                          </Typography>
                          <Chip
                            label={skillLevelLabels[result.level]}
                            color={skillLevelColors[result.level]}
                            size='small'
                          />
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              mb: 1,
                            }}
                          >
                            <Typography variant='body2' color='text.secondary'>
                              Accuracy
                            </Typography>
                            <Typography variant='body2' fontWeight='medium'>
                              {result.accuracy}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant='determinate'
                            value={result.accuracy}
                            sx={{ height: 6, borderRadius: 3 }}
                            color={skillLevelColors[result.level]}
                          />
                        </Box>

                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Typography variant='caption' color='text.secondary'>
                            Placement Level
                          </Typography>
                          <Typography variant='caption' fontWeight='medium'>
                            {result.placementLevel
                              .replace('-', ' ')
                              .toUpperCase()}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDiagnosticDialogOpen(false)} variant='contained'>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity='success'
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
