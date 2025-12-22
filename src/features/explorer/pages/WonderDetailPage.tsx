import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Paper,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@app/hooks/app.hooks';
import {
  selectWonder,
  visitWonder,
  toggleFavorite,
  unlockNextWonder,
} from '../redux/slices/explorer.slice';

export const WonderDetailPage = () => {
  const { wonderId } = useParams<{ wonderId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedWonder } = useAppSelector((state) => state.explorer);

  useEffect(() => {
    if (wonderId) {
      dispatch(selectWonder(wonderId));
    }
  }, [wonderId, dispatch]);

  const handleStampPassport = () => {
    if (wonderId) {
      dispatch(visitWonder(wonderId));
      dispatch(unlockNextWonder());
      // Navigate to achievement screen
      navigate('/student/explorer/achievement');
    }
  };

  const handleToggleFavorite = () => {
    if (wonderId) {
      dispatch(toggleFavorite(wonderId));
    }
  };

  if (!selectedWonder) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  const getCategoryIcon = () => {
    if (selectedWonder.category === 'natural') return '🌿';
    return '🏛️';
  };

  const getCategoryLabel = () => {
    if (selectedWonder.category === 'natural') return 'Natural Wonder';
    return 'Built by People';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #87CEEB 0%, #98D8E8 50%, #90EE90 100%)',
        position: 'relative',
        py: 4,
      }}
    >
      {/* Clouds decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          left: '10%',
          fontSize: '3rem',
          opacity: 0.7,
        }}
      >
        ☁️
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: 40,
          right: '15%',
          fontSize: '2.5rem',
          opacity: 0.7,
        }}
      >
        ☁️
      </Box>

      <Container maxWidth='md'>
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

        {/* Main Card */}
        <Paper
          elevation={8}
          sx={{
            background: 'linear-gradient(135deg, #FFF9E6 0%, #FFFACD 100%)',
            border: '4px solid #8B4513',
            borderRadius: 4,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Header with Title */}
          <Box
            sx={{
              bgcolor: '#4CAF50',
              px: 3,
              py: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '3px solid #2E7D32',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography
                variant='h4'
                sx={{
                  color: '#FFF',
                  fontWeight: 'bold',
                  fontFamily: '"Comic Sans MS", cursive',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                {selectedWonder.name}
              </Typography>
              {selectedWonder.isNew && (
                <Chip
                  label='New'
                  sx={{
                    bgcolor: '#FF5722',
                    color: '#FFF',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                  }}
                />
              )}
            </Box>

            <IconButton
              onClick={handleToggleFavorite}
              sx={{
                color: '#FFF',
              }}
            >
              {selectedWonder.isFavorite ? (
                <StarIcon sx={{ fontSize: '2rem' }} />
              ) : (
                <StarBorderIcon sx={{ fontSize: '2rem' }} />
              )}
            </IconButton>
          </Box>

          {/* Country Subtitle */}
          <Box
            sx={{
              bgcolor: '#66BB6A',
              px: 3,
              py: 1,
              borderBottom: '2px solid #2E7D32',
            }}
          >
            <Typography
              variant='h6'
              sx={{
                color: '#FFF',
                fontFamily: '"Comic Sans MS", cursive',
              }}
            >
              {selectedWonder.country}
            </Typography>
          </Box>

          {/* Wonder Image */}
          <Box
            sx={{
              height: 300,
              backgroundImage: selectedWonder.imageUrl
                ? `url(${selectedWonder.imageUrl})`
                : 'linear-gradient(135deg, #FFE0B2 0%, #FFCC80 100%)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderBottom: '3px solid #8B4513',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {!selectedWonder.imageUrl && (
              <Box
                sx={{
                  fontSize: '8rem',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                }}
              >
                {getCategoryIcon()}
              </Box>
            )}
          </Box>

          {/* Tags */}
          <Box
            sx={{
              px: 3,
              py: 2,
              display: 'flex',
              gap: 1,
              flexWrap: 'wrap',
              bgcolor: 'rgba(255,255,255,0.5)',
            }}
          >
            <Chip
              label='⏳ Ancient Wonder'
              sx={{
                bgcolor: '#FF9800',
                color: '#FFF',
                fontWeight: 'bold',
                fontSize: '0.9rem',
              }}
            />
            <Chip
              label={`${getCategoryIcon()} ${getCategoryLabel()}`}
              sx={{
                bgcolor: '#E91E63',
                color: '#FFF',
                fontWeight: 'bold',
                fontSize: '0.9rem',
              }}
            />
            <Chip
              label={`🌍 ${selectedWonder.continent}`}
              sx={{
                bgcolor: '#2196F3',
                color: '#FFF',
                fontWeight: 'bold',
                fontSize: '0.9rem',
              }}
            />
          </Box>

          {/* Description */}
          <Box sx={{ px: 3, py: 3 }}>
            <Typography
              variant='h6'
              sx={{
                color: '#333',
                fontFamily: '"Comic Sans MS", cursive',
                lineHeight: 1.6,
                fontSize: '1.2rem',
              }}
            >
              {selectedWonder.description}
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              px: 3,
              py: 3,
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              bgcolor: 'rgba(255,255,255,0.3)',
            }}
          >
            <Button
              variant='contained'
              size='large'
              onClick={handleStampPassport}
              disabled={selectedWonder.isVisited}
              startIcon={<Box sx={{ fontSize: '1.5rem' }}>✅</Box>}
              sx={{
                bgcolor: '#4CAF50',
                color: '#FFF',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                px: 4,
                py: 1.5,
                borderRadius: 3,
                textTransform: 'none',
                fontFamily: '"Comic Sans MS", cursive',
                border: '3px solid #2E7D32',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                '&:hover': {
                  bgcolor: '#45a049',
                  transform: 'scale(1.05)',
                },
                '&:disabled': {
                  bgcolor: '#999',
                  color: '#FFF',
                },
              }}
            >
              {selectedWonder.isVisited ? 'Already Stamped!' : 'Stamp My Passport!'}
            </Button>

            <Button
              variant='contained'
              size='large'
              onClick={handleToggleFavorite}
              startIcon={
                <Box sx={{ fontSize: '1.5rem' }}>
                  {selectedWonder.isFavorite ? '⭐' : '🤍'}
                </Box>
              }
              sx={{
                bgcolor: '#FFB300',
                color: '#FFF',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                px: 4,
                py: 1.5,
                borderRadius: 3,
                textTransform: 'none',
                fontFamily: '"Comic Sans MS", cursive',
                border: '3px solid #F57C00',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                '&:hover': {
                  bgcolor: '#FFA000',
                  transform: 'scale(1.05)',
                },
              }}
            >
              {selectedWonder.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </Button>
          </Box>

          {/* Owl Mascot */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 20,
              right: 20,
              fontSize: '3.5rem',
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
