import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  AppBar,
  Toolbar,
  IconButton,
  CircularProgress,
  Alert,
  TextField,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@app/hooks/app.hooks';
import {
  fetchExerciseById,
  submitExercise,
  clearCurrentExercise,
} from '@features/student/redux/slices/student.slice';

export const ExerciseDetailPage = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentExercise, isLoading } = useAppSelector((state) => state.student);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const startTimeRef = useRef<number>(Date.now()); // Track when exercise started

  useEffect(() => {
    if (exerciseId) {
      // Reset start time when exercise loads
      startTimeRef.current = Date.now();
      dispatch(fetchExerciseById(exerciseId));
    }

    return () => {
      dispatch(clearCurrentExercise());
    };
  }, [dispatch, exerciseId]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    if (!exerciseId) return;

    // Calculate time spent in seconds
    const endTime = Date.now();
    const timeSpentSeconds = Math.floor((endTime - startTimeRef.current) / 1000);

    const result = await dispatch(
      submitExercise({
        exerciseId,
        answers,
        timeSpentSeconds
      })
    );
    if (submitExercise.fulfilled.match(result)) {
      setSubmitted(true);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!currentExercise) {
    return (
      <Box>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => navigate('/student/exercises')}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6">Exercise Not Found</Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Alert severity="error">Exercise not found</Alert>
        </Container>
      </Box>
    );
  }

  const allQuestionsAnswered = currentExercise.questions.every((q) => answers[q.id]);

  if (submitted) {
    return (
      <Box>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => navigate('/student/exercises')}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6">Exercise Complete</Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom align="center" color="primary">
              Great Job!
            </Typography>
            <Alert severity="success" sx={{ mb: 3 }}>
              You've completed this exercise successfully!
            </Alert>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button variant="contained" onClick={() => navigate('/student/exercises')}>
                Back to Exercises
              </Button>
              <Button variant="outlined" onClick={() => navigate('/student')}>
                Dashboard
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/student/exercises')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">{currentExercise.title}</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            {currentExercise.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {currentExercise.description}
          </Typography>

          <Paper variant="outlined" sx={{ p: 3, mb: 4, bgcolor: 'grey.50' }}>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {currentExercise.content}
            </Typography>
          </Paper>

          <Typography variant="h6" gutterBottom>
            Questions
          </Typography>

          <Box sx={{ mt: 3 }}>
            {currentExercise.questions.map((question, index) => (
              <Box key={question.id} sx={{ mb: 4 }}>
                <FormControl component="fieldset" fullWidth>
                  <FormLabel component="legend">
                    {index + 1}. {question.text}
                  </FormLabel>
                  {question.type === 'multiple-choice' ? (
                    <RadioGroup
                      value={answers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    >
                      {question.options?.map((option) => (
                        <FormControlLabel
                          key={option}
                          value={option}
                          control={<Radio />}
                          label={option}
                        />
                      ))}
                    </RadioGroup>
                  ) : (
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      value={answers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      placeholder="Type your answer here..."
                      sx={{ mt: 1 }}
                    />
                  )}
                </FormControl>
              </Box>
            ))}
          </Box>

          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleSubmit}
            disabled={!allQuestionsAnswered || isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit Exercise'}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};
