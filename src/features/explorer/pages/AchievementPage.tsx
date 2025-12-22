import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@app/hooks/app.hooks';
import { hideAchievement } from '../redux/slices/explorer.slice';
import { BadgeType } from '../types/explorer.types';

const badgeIcons: Record<BadgeType, string> = {
  [BadgeType.OCEAN_FINDER]: '🌊',
  [BadgeType.HISTORY_HERO]: '📜',
  [BadgeType.MOUNTAIN_MASTER]: '⛰️',
  [BadgeType.NATURE_EXPLORER]: '🌿',
  [BadgeType.ANCIENT_WONDER]: '⏳',
  [BadgeType.MODERN_MARVEL]: '🏙️',
  [BadgeType.DESERT_DISCOVERER]: '🏜️',
  [BadgeType.FOREST_FRIEND]: '🌲',
};

const badgeColors: Record<BadgeType, string> = {
  [BadgeType.OCEAN_FINDER]: 'linear-gradient(135deg, #4FC3F7 0%, #29B6F6 100%)',
  [BadgeType.HISTORY_HERO]: 'linear-gradient(135deg, #FFD54F 0%, #FFC107 100%)',
  [BadgeType.MOUNTAIN_MASTER]: 'linear-gradient(135deg, #A1887F 0%, #8D6E63 100%)',
  [BadgeType.NATURE_EXPLORER]: 'linear-gradient(135deg, #81C784 0%, #66BB6A 100%)',
  [BadgeType.ANCIENT_WONDER]: 'linear-gradient(135deg, #FF8A65 0%, #FF7043 100%)',
  [BadgeType.MODERN_MARVEL]: 'linear-gradient(135deg, #9575CD 0%, #7E57C2 100%)',
  [BadgeType.DESERT_DISCOVERER]: 'linear-gradient(135deg, #FFB74D 0%, #FFA726 100%)',
  [BadgeType.FOREST_FRIEND]: 'linear-gradient(135deg, #4DB6AC 0%, #26A69A 100%)',
};

export const AchievementPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { latestBadge, selectedWonder } = useAppSelector((state) => state.explorer);

  useEffect(() => {
    // Auto-hide after 5 seconds if user doesn't click
    const timer = setTimeout(() => {
      handleContinue();
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    dispatch(hideAchievement());
    navigate('/student/explorer');
  };

  const getCategoryMessage = () => {
    if (selectedWonder?.category === 'natural') {
      return 'You found a Natural Wonder!';
    }
    return 'You discovered a Man-Made Marvel!';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 50%, #FFA07A 100%)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Animated confetti decorations */}
      {[...Array(20)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            fontSize: '2rem',
            animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            '@keyframes float': {
              '0%, 100%': {
                transform: 'translateY(0) rotate(0deg)',
              },
              '50%': {
                transform: 'translateY(-20px) rotate(180deg)',
              },
            },
          }}
        >
          {['⭐', '🎉', '🎊', '✨', '🌟'][Math.floor(Math.random() * 5)]}
        </Box>
      ))}

      <Container maxWidth='sm'>
        <Paper
          elevation={12}
          sx={{
            background: 'linear-gradient(135deg, #FFF9E6 0%, #FFFACD 100%)',
            border: '5px solid #FFD700',
            borderRadius: 4,
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              bgcolor: '#4CAF50',
              px: 3,
              py: 3,
              textAlign: 'center',
              borderBottom: '4px solid #2E7D32',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Trophy */}
            <Box
              sx={{
                fontSize: '4rem',
                mb: 1,
                animation: 'bounce 1s ease-in-out infinite',
                '@keyframes bounce': {
                  '0%, 100%': {
                    transform: 'translateY(0)',
                  },
                  '50%': {
                    transform: 'translateY(-10px)',
                  },
                },
              }}
            >
              🏆
            </Box>

            <Typography
              variant='h3'
              sx={{
                color: '#FFF',
                fontWeight: 'bold',
                fontFamily: '"Comic Sans MS", cursive',
                textShadow: '3px 3px 6px rgba(0,0,0,0.3)',
                mb: 1,
              }}
            >
              You Did It!
            </Typography>

            <Typography
              variant='h5'
              sx={{
                color: '#FFF',
                fontWeight: 'bold',
                fontFamily: '"Comic Sans MS", cursive',
              }}
            >
              {getCategoryMessage()}
            </Typography>
          </Box>

          {/* Wonder Image/Icon */}
          {selectedWonder && (
            <Box
              sx={{
                p: 3,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  backgroundImage: selectedWonder.imageUrl
                    ? `url(${selectedWonder.imageUrl})`
                    : 'linear-gradient(135deg, #81C784 0%, #66BB6A 100%)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: '5px solid #FFD700',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {!selectedWonder.imageUrl && (
                  <Box sx={{ fontSize: '5rem' }}>
                    {selectedWonder.category === 'natural' ? '🏞️' : '🏛️'}
                  </Box>
                )}
              </Box>
            </Box>
          )}

          {/* Badge Display */}
          {latestBadge && (
            <Box sx={{ px: 3, pb: 3 }}>
              <Box
                sx={{
                  textAlign: 'center',
                  mb: 2,
                }}
              >
                {/* New Badge Label */}
                <Box
                  sx={{
                    display: 'inline-block',
                    bgcolor: '#FF5722',
                    color: '#FFF',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    mb: 2,
                    border: '3px solid #FFF',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                    animation: 'pulse 1.5s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%, 100%': {
                        transform: 'scale(1)',
                      },
                      '50%': {
                        transform: 'scale(1.05)',
                      },
                    },
                  }}
                >
                  ⭐ New Badge Unlocked! ⭐
                </Box>

                {/* Badge */}
                <Box
                  sx={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: badgeColors[latestBadge],
                    p: 3,
                    borderRadius: 3,
                    border: '4px solid #FFD700',
                    boxShadow: '0 0 30px rgba(255, 215, 0, 0.8), 0 8px 16px rgba(0,0,0,0.3)',
                    animation: 'glow 2s ease-in-out infinite',
                    '@keyframes glow': {
                      '0%, 100%': {
                        boxShadow:
                          '0 0 20px rgba(255, 215, 0, 0.6), 0 8px 16px rgba(0,0,0,0.3)',
                      },
                      '50%': {
                        boxShadow:
                          '0 0 40px rgba(255, 215, 0, 1), 0 8px 16px rgba(0,0,0,0.3)',
                      },
                    },
                  }}
                >
                  <Box sx={{ fontSize: '5rem', mb: 1 }}>{badgeIcons[latestBadge]}</Box>
                  <Typography
                    variant='h5'
                    sx={{
                      color: '#FFF',
                      fontWeight: 'bold',
                      fontFamily: '"Comic Sans MS", cursive',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    }}
                  >
                    {latestBadge}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          {/* Next Challenge Button */}
          <Box sx={{ px: 3, pb: 4, textAlign: 'center' }}>
            <Button
              variant='contained'
              size='large'
              onClick={handleContinue}
              sx={{
                bgcolor: '#4CAF50',
                color: '#FFF',
                fontWeight: 'bold',
                fontSize: '1.5rem',
                px: 6,
                py: 2,
                borderRadius: 3,
                textTransform: 'none',
                fontFamily: '"Comic Sans MS", cursive',
                border: '4px solid #2E7D32',
                boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
                '&:hover': {
                  bgcolor: '#45a049',
                  transform: 'scale(1.05)',
                },
              }}
            >
              Next Challenge! 🚀
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
