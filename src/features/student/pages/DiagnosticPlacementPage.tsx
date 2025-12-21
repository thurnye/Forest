import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  RecordVoiceOver as PhonicsIcon,
  MenuBook as ComprehensionIcon,
  Speed as FluencyIcon,
  Psychology as AwarenessIcon,
  Book as VocabularyIcon,
} from '@mui/icons-material';
import { useAppSelector } from '@app/hooks/app.hooks';
import { diagnosticService } from '@features/student/services/diagnostic.service';
import { SkillStrand, Student, UserRole } from '@shared/types/api.types';

const strandIcons: Record<SkillStrand, React.ReactNode> = {
  [SkillStrand.PHONOLOGICAL_AWARENESS]: <AwarenessIcon sx={{ fontSize: 60 }} />,
  [SkillStrand.PHONICS]: <PhonicsIcon sx={{ fontSize: 60 }} />,
  [SkillStrand.VOCABULARY]: <VocabularyIcon sx={{ fontSize: 60 }} />,
  [SkillStrand.COMPREHENSION]: <ComprehensionIcon sx={{ fontSize: 60 }} />,
  [SkillStrand.FLUENCY]: <FluencyIcon sx={{ fontSize: 60 }} />,
};

const strandLabels: Record<SkillStrand, string> = {
  [SkillStrand.PHONOLOGICAL_AWARENESS]: 'Sound Awareness',
  [SkillStrand.PHONICS]: 'Letter Sounds',
  [SkillStrand.VOCABULARY]: 'Words & Meanings',
  [SkillStrand.COMPREHENSION]: 'Understanding',
  [SkillStrand.FLUENCY]: 'Reading Smoothly',
};

export const DiagnosticPlacementPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const student = user?.role === UserRole.STUDENT ? (user as Student) : null;

  const [currentStrand, setCurrentStrand] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const warmupScore = location.state?.warmupScore || 75;

  const strands = [
    SkillStrand.PHONOLOGICAL_AWARENESS,
    SkillStrand.PHONICS,
    SkillStrand.VOCABULARY,
    SkillStrand.COMPREHENSION,
    SkillStrand.FLUENCY,
  ];

  useEffect(() => {
    if (!student || !student.targetGradeLevel) {
      navigate('/student');
      return;
    }

    // Simulate progression through each strand
    const timer = setInterval(() => {
      setCurrentStrand((prev) => {
        if (prev < strands.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          completePlacement();
          return prev;
        }
      });
    }, 2500); // 2.5 seconds per strand

    return () => clearInterval(timer);
  }, [student, navigate]);

  const completePlacement = async () => {
    if (!student) return;

    setIsProcessing(true);

    try {
      const result = await diagnosticService.runPlacementActivities(
        student.id,
        student.targetGradeLevel!,
        warmupScore
      );

      if (result.success && result.data) {
        // Navigate to results page with diagnostic data
        navigate('/student/diagnostic/results', {
          state: { diagnosticResult: result.data },
        });
      }
    } catch (error) {
      console.error('Placement failed:', error);
      setIsProcessing(false);
    }
  };

  if (!student) {
    return null;
  }

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
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Finding Your Perfect Learning Path
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
            We're analyzing your skills across different areas
          </Typography>

          <Stepper activeStep={currentStrand} sx={{ mb: 4 }}>
            {strands.map((strand) => (
              <Step key={strand}>
                <StepLabel>{strandLabels[strand]}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {currentStrand < strands.length && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                py: 4,
              }}
            >
              <Box
                sx={{
                  color: 'primary.main',
                  mb: 3,
                  animation: 'pulse 2s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': {
                      opacity: 1,
                      transform: 'scale(1)',
                    },
                    '50%': {
                      opacity: 0.7,
                      transform: 'scale(1.05)',
                    },
                  },
                }}
              >
                {strandIcons[strands[currentStrand]]}
              </Box>

              <Typography variant="h5" gutterBottom fontWeight="medium" color="primary">
                {strandLabels[strands[currentStrand]]}
              </Typography>

              <Box sx={{ mt: 3 }}>
                <CircularProgress size={60} />
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Evaluating your skills...
              </Typography>
            </Box>
          )}

          {currentStrand >= strands.length && isProcessing && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                py: 4,
              }}
            >
              <CircularProgress size={80} sx={{ mb: 3 }} />
              <Typography variant="h6" gutterBottom>
                Almost done!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Creating your personalized learning plan...
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};
