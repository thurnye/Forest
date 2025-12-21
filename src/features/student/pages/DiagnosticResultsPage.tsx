import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { DiagnosticResult, SkillStrand, SkillLevel } from '@shared/types/api.types';
import { diagnosticService } from '@features/student/services/diagnostic.service';
import { useAppSelector, useAppDispatch } from '@app/hooks/app.hooks';
import { getCurrentUser } from '@features/auth/redux/slices/auth.slice';

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

export const DiagnosticResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [isSaving, setIsSaving] = useState(false);
  const [diagnosticResult] = useState<DiagnosticResult | null>(
    location.state?.diagnosticResult || null
  );

  useEffect(() => {
    if (!diagnosticResult || !user) {
      navigate('/student');
    }
  }, [diagnosticResult, user, navigate]);

  const handleContinue = async () => {
    if (!diagnosticResult || !user) return;

    console.log('Submitting diagnostic results:', diagnosticResult);
    console.log('For user:', user);

    setIsSaving(true);

    console.log('Saving diagnostic results...');

    try {
      const result = await diagnosticService.submitDiagnosticResults(user.id, diagnosticResult);
      if (!result.success) {
        throw new Error(result.message || 'Failed to save diagnostic results');
      }

      // Refresh user data to get updated diagnostic status
      console.log('Refreshing user data...');
      await dispatch(getCurrentUser()).unwrap();

      // Navigate to student dashboard
      navigate('/student', { replace: true });
    } catch (error) {
      console.log('Error saving diagnostic results:', error);
      console.error('Failed to save diagnostic results:', error);
      setIsSaving(false);
    }
  };

  if (!diagnosticResult) {
    return null;
  }

  const averageAccuracy =
    diagnosticResult.strandResults.reduce((sum, result) => sum + result.accuracy, 0) /
    diagnosticResult.strandResults.length;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Paper
          sx={{
            p: 6,
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box sx={{ mb: 2 }}>
              <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main' }} />
            </Box>

            <Typography variant="h3" gutterBottom fontWeight="bold">
              You Did It!
            </Typography>

            <Typography variant="h6" color="text.secondary" paragraph>
              Here's your personalized learning plan
            </Typography>
          </Box>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <StarIcon sx={{ fontSize: 50, mb: 2 }} />
                  <Typography variant="body2" gutterBottom>
                    Your Starting Level
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {diagnosticResult.recommendedStartingLevel.replace('-', ' ').toUpperCase()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <TrendingUpIcon sx={{ fontSize: 50, mb: 2, color: 'primary.main' }} />
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Overall Accuracy
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {Math.round(averageAccuracy)}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <CheckCircleIcon sx={{ fontSize: 50, mb: 2, color: 'success.main' }} />
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Skills Evaluated
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {diagnosticResult.strandResults.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Typography variant="h5" gutterBottom fontWeight="medium" sx={{ mb: 3 }}>
            Your Skill Breakdown
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {diagnosticResult.strandResults.map((result) => (
              <Grid item xs={12} md={6} key={result.strand}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6" fontWeight="medium">
                        {strandLabels[result.strand]}
                      </Typography>
                      <Chip
                        label={skillLevelLabels[result.level]}
                        color={skillLevelColors[result.level]}
                        size="small"
                      />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Accuracy
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {result.accuracy}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={result.accuracy}
                        sx={{ height: 8, borderRadius: 4 }}
                        color={skillLevelColors[result.level]}
                      />
                    </Box>

                    <Typography variant="caption" color="text.secondary">
                      Placement: {result.placementLevel.replace('-', ' ').toUpperCase()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Paper sx={{ p: 3, bgcolor: 'primary.50', mb: 4 }}>
            <Typography variant="h6" gutterBottom color="primary" fontWeight="medium">
              What's Next?
            </Typography>
            <Typography variant="body1" paragraph>
              Based on your results, we've created a personalized learning path just for you!
              You'll start with activities at the <strong>{diagnosticResult.recommendedStartingLevel.replace('-', ' ')}</strong> level.
            </Typography>
            <Typography variant="body1">
              Don't worry - the activities will adapt to your progress. If something is too easy or
              too hard, we'll adjust automatically to keep you learning at just the right pace.
            </Typography>
          </Paper>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleContinue}
              disabled={isSaving}
              sx={{ px: 8, py: 2, fontSize: '1.1rem' }}
            >
              {isSaving ? 'Saving...' : 'Start Learning!'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
