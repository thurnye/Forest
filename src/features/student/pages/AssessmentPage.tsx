import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Alert,
  LinearProgress,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@app/hooks/app.hooks';
import { takeAssessment } from '@features/student/redux/slices/student.slice';

const assessmentQuestions = [
  {
    id: 'q1',
    text: 'The cat sat on the ___.',
    options: ['mat', 'car', 'tree', 'book'],
  },
  {
    id: 'q2',
    text: 'What sound does "ch" make in "chair"?',
    options: ['k', 'ch', 's', 'sh'],
  },
  {
    id: 'q3',
    text: 'Which word rhymes with "cat"?',
    options: ['bat', 'dog', 'run', 'jump'],
  },
];

export const AssessmentPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, currentAssessment } = useAppSelector((state) => state.student);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    const result = await dispatch(takeAssessment(answers));
    if (takeAssessment.fulfilled.match(result)) {
      setSubmitted(true);
    }
  };

  const allQuestionsAnswered = assessmentQuestions.every((q) => answers[q.id]);

  if (submitted && currentAssessment) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => navigate('/student')}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6">Assessment Results</Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom align="center" color="primary">
              Assessment Complete!
            </Typography>

            <Box sx={{ my: 4, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Your Reading Level
              </Typography>
              <Typography variant="h3" color="primary" gutterBottom>
                {currentAssessment.readingLevel}
              </Typography>

              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Score
              </Typography>
              <Typography variant="h3" color="secondary" gutterBottom>
                {currentAssessment.score}%
              </Typography>

              <Alert severity="success" sx={{ mt: 4 }}>
                {currentAssessment.feedback}
              </Alert>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button variant="contained" onClick={() => navigate('/student/exercises')}>
                Start Exercises
              </Button>
              <Button variant="outlined" onClick={() => navigate('/student')}>
                Back to Dashboard
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/student')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">Reading Assessment</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Reading Level Assessment
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Answer the following questions to determine your reading level.
          </Typography>

          {isLoading && <LinearProgress sx={{ mb: 2 }} />}

          <Box sx={{ mt: 4 }}>
            {assessmentQuestions.map((question, index) => (
              <Box key={question.id} sx={{ mb: 4 }}>
                <FormControl component="fieldset" fullWidth>
                  <FormLabel component="legend">
                    Question {index + 1}: {question.text}
                  </FormLabel>
                  <RadioGroup
                    value={answers[question.id] || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  >
                    {question.options.map((option) => (
                      <FormControlLabel
                        key={option}
                        value={option}
                        control={<Radio />}
                        label={option}
                      />
                    ))}
                  </RadioGroup>
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
            {isLoading ? 'Submitting...' : 'Submit Assessment'}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};
