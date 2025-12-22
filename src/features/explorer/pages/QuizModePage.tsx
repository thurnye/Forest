import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  IconButton,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useAppSelector } from '@app/hooks/app.hooks';
import { WonderCategory } from '../types/explorer.types';

export const QuizModePage = () => {
  const navigate = useNavigate();
  const { wonders } = useAppSelector((state) => state.explorer);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);

  // Generate quiz questions from wonders
  const naturalWonders = wonders.filter((w) => w.category === WonderCategory.NATURAL);
  const currentWonder = naturalWonders[currentQuestionIndex % naturalWonders.length];

  // Generate random question (50% chance to show correct wonder, 50% wrong)
  const isCorrectWonder = Math.random() > 0.5;
  const displayedWonder = isCorrectWonder
    ? currentWonder
    : naturalWonders[(currentQuestionIndex + 1) % naturalWonders.length];

  const handleAnswer = (answer: boolean) => {
    setSelectedAnswer(answer);
    setAnswered(true);

    // Check if answer is correct
    const isCorrect = (answer && isCorrectWonder) || (!answer && !isCorrectWonder);
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setAnswered(false);
    setSelectedAnswer(null);

    // After 5 questions, show results
    if (currentQuestionIndex >= 4) {
      navigate('/student/explorer/achievement');
    }
  };

  const getCategoryIcon = () => {
    if (currentWonder.category === 'natural') return '🌿';
    return '🏛️';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #87CEEB 0%, #98D8E8 100%)',
        py: 4,
      }}
    >
      <Container maxWidth='sm'>
        {/* Back Button */}
        <IconButton
          onClick={() => navigate('/student/explorer')}
          sx={{
            mb: 2,
            bgcolor: 'rgba(255,255,255,0.9)',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,1)',
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        {/* Main Quiz Card */}
        <Paper
          elevation={8}
          sx={{
            background: 'linear-gradient(135deg, #D2691E 0%, #CD853F 100%)',
            border: '4px solid #8B4513',
            borderRadius: 4,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              bgcolor: '#8B4513',
              px: 3,
              py: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              borderBottom: '3px solid #654321',
            }}
          >
            <Box sx={{ fontSize: '1.5rem' }}>⭐</Box>
            <Typography
              variant='h4'
              sx={{
                color: '#FFD700',
                fontWeight: 'bold',
                fontFamily: '"Comic Sans MS", cursive',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              Quiz Mode
            </Typography>
            <Box sx={{ fontSize: '1.5rem' }}>⭐</Box>
          </Box>

          {/* Challenge Banner */}
          <Box
            sx={{
              bgcolor: '#4CAF50',
              px: 3,
              py: 2,
              borderBottom: '3px solid #2E7D32',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            <Typography
              variant='h5'
              sx={{
                color: '#FFF',
                fontWeight: 'bold',
                textAlign: 'center',
                fontFamily: '"Comic Sans MS", cursive',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              <Box sx={{ fontSize: '1.5rem' }}>{getCategoryIcon()}</Box>
              Find a Natural Wonder!
              <Box sx={{ fontSize: '1.5rem' }}>✨</Box>
            </Typography>
          </Box>

          {/* Wonder Image */}
          <Box
            sx={{
              bgcolor: '#FFF',
              p: 2,
              m: 3,
              borderRadius: 3,
              border: '3px solid #8B4513',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            }}
          >
            <Box
              sx={{
                height: 200,
                backgroundImage: currentWonder.imageUrl
                  ? `url(${currentWonder.imageUrl})`
                  : 'linear-gradient(135deg, #81C784 0%, #66BB6A 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {!currentWonder.imageUrl && (
                <Box
                  sx={{
                    fontSize: '6rem',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                  }}
                >
                  🏞️
                </Box>
              )}
            </Box>
          </Box>

          {/* Question */}
          <Box sx={{ px: 3, py: 2 }}>
            <Typography
              variant='h5'
              sx={{
                color: '#FFF',
                fontWeight: 'bold',
                textAlign: 'center',
                fontFamily: '"Comic Sans MS", cursive',
                bgcolor: 'rgba(0,0,0,0.2)',
                py: 2,
                px: 3,
                borderRadius: 2,
              }}
            >
              Is it the {displayedWonder.name}?
            </Typography>
          </Box>

          {/* Answer Buttons */}
          <Box
            sx={{
              px: 3,
              py: 3,
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
            }}
          >
            <Button
              variant='contained'
              size='large'
              onClick={() => handleAnswer(true)}
              disabled={answered}
              sx={{
                bgcolor: selectedAnswer === true ? '#2E7D32' : '#4CAF50',
                color: '#FFF',
                fontWeight: 'bold',
                fontSize: '1.8rem',
                px: 6,
                py: 2,
                borderRadius: 3,
                textTransform: 'none',
                fontFamily: '"Comic Sans MS", cursive',
                border: '4px solid #2E7D32',
                boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
                minWidth: 150,
                '&:hover': {
                  bgcolor: '#45a049',
                  transform: 'scale(1.05)',
                },
                '&:disabled': {
                  bgcolor: selectedAnswer === true ? '#2E7D32' : '#999',
                  color: '#FFF',
                },
              }}
            >
              YES!
            </Button>

            <Button
              variant='contained'
              size='large'
              onClick={() => handleAnswer(false)}
              disabled={answered}
              sx={{
                bgcolor: selectedAnswer === false ? '#C62828' : '#F44336',
                color: '#FFF',
                fontWeight: 'bold',
                fontSize: '1.8rem',
                px: 6,
                py: 2,
                borderRadius: 3,
                textTransform: 'none',
                fontFamily: '"Comic Sans MS", cursive',
                border: '4px solid #C62828',
                boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
                minWidth: 150,
                '&:hover': {
                  bgcolor: '#e53935',
                  transform: 'scale(1.05)',
                },
                '&:disabled': {
                  bgcolor: selectedAnswer === false ? '#C62828' : '#999',
                  color: '#FFF',
                },
              }}
            >
              NOPE!
            </Button>
          </Box>

          {/* Next Button */}
          {answered && (
            <Box sx={{ px: 3, pb: 3, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant='contained'
                size='large'
                onClick={handleNext}
                sx={{
                  bgcolor: '#FFB300',
                  color: '#FFF',
                  fontWeight: 'bold',
                  fontSize: '1.3rem',
                  px: 6,
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontFamily: '"Comic Sans MS", cursive',
                  border: '4px solid #F57C00',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  '&:hover': {
                    bgcolor: '#FFA000',
                    transform: 'scale(1.05)',
                  },
                }}
              >
                Let's Go! 🚀
              </Button>
            </Box>
          )}

          {/* Score Display */}
          <Box
            sx={{
              position: 'absolute',
              top: 20,
              right: 20,
              bgcolor: '#FFD700',
              px: 2,
              py: 1,
              borderRadius: 2,
              border: '2px solid #FFA000',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            <Typography
              sx={{
                fontWeight: 'bold',
                color: '#8B4513',
                fontFamily: '"Comic Sans MS", cursive',
              }}
            >
              Score: {score}/{currentQuestionIndex + (answered ? 1 : 0)}
            </Typography>
          </Box>

          {/* Owl Mascot */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 20,
              right: 20,
              fontSize: '3rem',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            }}
          >
            🦉
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
