import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  LinearProgress,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from '@mui/material';
import { Psychology as PsychologyIcon } from '@mui/icons-material';
import { useAppSelector } from '@app/hooks/app.hooks';
import { diagnosticService } from '@features/student/services/diagnostic.service';
import { Student, UserRole } from '@shared/types/api.types';

interface WarmupTask {
  id: string;
  type: 'letter-sound' | 'word-recognition' | 'rhyming';
  question: string;
  options: string[];
  correctAnswer: string;
}

const mockWarmupTasks: WarmupTask[] = [
  {
    id: '1',
    type: 'letter-sound',
    question: 'What sound does the letter "B" make?',
    options: ['/b/', '/d/', '/p/', '/t/'],
    correctAnswer: '/b/',
  },
  {
    id: '2',
    type: 'word-recognition',
    question: 'Which word is "cat"?',
    options: ['dog', 'cat', 'bat', 'hat'],
    correctAnswer: 'cat',
  },
  {
    id: '3',
    type: 'rhyming',
    question: 'Which word rhymes with "dog"?',
    options: ['cat', 'log', 'big', 'hat'],
    correctAnswer: 'log',
  },
  {
    id: '4',
    type: 'letter-sound',
    question: 'What sound does the letter "M" make?',
    options: ['/n/', '/m/', '/w/', '/v/'],
    correctAnswer: '/m/',
  },
  {
    id: '5',
    type: 'word-recognition',
    question: 'Which word is "sun"?',
    options: ['run', 'sun', 'fun', 'bun'],
    correctAnswer: 'sun',
  },
];

export const DiagnosticWarmupPage = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const student = user?.role === UserRole.STUDENT ? (user as Student) : null;
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const currentTask = mockWarmupTasks[currentTaskIndex];
  const progress = ((currentTaskIndex + 1) / mockWarmupTasks.length) * 100;

  useEffect(() => {
    // Check if user has target grade level set
    if (!student || !student.targetGradeLevel) {
      navigate('/student');
    }
  }, [student, navigate]);

  const handleStartWarmup = () => {
    setShowIntro(false);
  };

  const handleAnswerChange = (value: string) => {
    setSelectedAnswer(value);
  };

  const handleNext = () => {
    if (currentTaskIndex < mockWarmupTasks.length - 1) {
      setCurrentTaskIndex((prev) => prev + 1);
      setSelectedAnswer('');
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    if (!student) return;

    setIsSubmitting(true);

    try {
      // Run warm-up tasks simulation
      const result = await diagnosticService.runWarmupTasks(
        student.id,
        student.targetGradeLevel!
      );

      if (result.success && result.data) {
        // Navigate to placement activities with warmup score
        navigate('/student/diagnostic/placement', {
          state: { warmupScore: result.data.warmupScore },
        });
      }
    } catch (error) {
      console.error('Warmup failed:', error);
      setIsSubmitting(false);
    }
  };

  if (showIntro) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Container maxWidth="md">
          <Paper
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }}
          >
            <Box sx={{ mb: 3 }}>
              <PsychologyIcon sx={{ fontSize: 80, color: 'primary.main' }} />
            </Box>

            <Typography variant="h3" gutterBottom fontWeight="bold">
              Welcome to Reading Forest!
            </Typography>

            <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4 }}>
              Let's find the perfect learning path for you
            </Typography>

            <Card sx={{ mb: 4, textAlign: 'left' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  What to expect:
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  <Typography component="li" paragraph>
                    You'll complete some fun, quick activities
                  </Typography>
                  <Typography component="li" paragraph>
                    There are no wrong answers - just do your best!
                  </Typography>
                  <Typography component="li" paragraph>
                    This helps us create activities perfect for you
                  </Typography>
                  <Typography component="li">
                    It will take about 5-10 minutes
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Button
              variant="contained"
              size="large"
              onClick={handleStartWarmup}
              sx={{ px: 6, py: 2, fontSize: '1.1rem' }}
            >
              Let's Get Started!
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Question {currentTaskIndex + 1} of {mockWarmupTasks.length}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ mt: 1, height: 8, borderRadius: 4 }}
            />
          </Box>

          <Typography variant="h5" gutterBottom fontWeight="medium" sx={{ mb: 4 }}>
            {currentTask.question}
          </Typography>

          <FormControl component="fieldset" fullWidth>
            <RadioGroup value={selectedAnswer} onChange={(e) => handleAnswerChange(e.target.value)}>
              {currentTask.options.map((option) => (
                <Card
                  key={option}
                  sx={{
                    mb: 2,
                    cursor: 'pointer',
                    border: selectedAnswer === option ? '2px solid' : '1px solid',
                    borderColor: selectedAnswer === option ? 'primary.main' : 'grey.300',
                    bgcolor: selectedAnswer === option ? 'primary.50' : 'white',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'primary.50',
                    },
                  }}
                  onClick={() => handleAnswerChange(option)}
                >
                  <CardContent>
                    <FormControlLabel
                      value={option}
                      control={<Radio />}
                      label={
                        <Typography variant="h6" fontWeight="medium">
                          {option}
                        </Typography>
                      }
                      sx={{ width: '100%', m: 0 }}
                    />
                  </CardContent>
                </Card>
              ))}
            </RadioGroup>
          </FormControl>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleNext}
              disabled={!selectedAnswer || isSubmitting}
              sx={{ px: 6 }}
            >
              {currentTaskIndex === mockWarmupTasks.length - 1
                ? isSubmitting
                  ? 'Processing...'
                  : 'Finish Warm-up'
                : 'Next'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
