import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useAppSelector } from '@app/hooks/app.hooks';
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

export const MyPassportPage = () => {
  const navigate = useNavigate();
  const { studentProgress } = useAppSelector((state) => state.explorer);

  const wondersVisited = studentProgress?.wondersVisited || 0;
  const totalWonders = studentProgress?.totalWonders || 196;
  const badges = studentProgress?.badges || [];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #87CEEB 0%, #98D8E8 100%)',
        py: 4,
      }}
    >
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

        {/* Main Passport Card */}
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
              bgcolor: '#4FC3F7',
              px: 3,
              py: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              borderBottom: '4px solid #0288D1',
              boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.2)',
            }}
          >
            <Box sx={{ fontSize: '2rem' }}>⭐</Box>
            <Typography
              variant='h3'
              sx={{
                color: '#FFF',
                fontWeight: 'bold',
                fontFamily: '"Comic Sans MS", cursive',
                textShadow: '3px 3px 6px rgba(0,0,0,0.3)',
              }}
            >
              My Passport
            </Typography>
            <Box sx={{ fontSize: '2rem' }}>⭐</Box>
          </Box>

          {/* Subtitle */}
          <Box
            sx={{
              bgcolor: '#81C784',
              px: 3,
              py: 1.5,
              borderBottom: '3px solid #66BB6A',
            }}
          >
            <Typography
              variant='h5'
              sx={{
                color: '#FFF',
                fontWeight: 'bold',
                textAlign: 'center',
                fontFamily: '"Comic Sans MS", cursive',
              }}
            >
              🌍 Wonders Explorer 🌍
            </Typography>
          </Box>

          {/* Content Area */}
          <Box
            sx={{
              bgcolor: '#FFF9E6',
              p: 4,
            }}
          >
            {/* Wonders Visited Counter */}
            <Paper
              elevation={4}
              sx={{
                bgcolor: '#FFD54F',
                border: '3px solid #FFA000',
                borderRadius: 3,
                p: 3,
                mb: 4,
                textAlign: 'center',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              }}
            >
              <Typography
                variant='h4'
                sx={{
                  color: '#8B4513',
                  fontWeight: 'bold',
                  fontFamily: '"Comic Sans MS", cursive',
                  mb: 1,
                }}
              >
                🎉 {wondersVisited} Wonders Visited! 🎉
              </Typography>
              <Typography
                variant='h6'
                sx={{
                  color: '#666',
                  fontFamily: '"Comic Sans MS", cursive',
                }}
              >
                Out of {totalWonders} in the world!
              </Typography>
            </Paper>

            {/* Badges Section */}
            <Typography
              variant='h5'
              sx={{
                color: '#8B4513',
                fontWeight: 'bold',
                fontFamily: '"Comic Sans MS", cursive',
                mb: 3,
                textAlign: 'center',
              }}
            >
              🏆 Your Badge Collection 🏆
            </Typography>

            <Grid container spacing={3}>
              {Object.values(BadgeType).map((badgeType) => {
                const earned = badges.find((b) => b.type === badgeType);
                const isEarned = !!earned;
                const isNew = earned?.isNew || false;

                return (
                  <Grid item xs={6} sm={4} md={3} key={badgeType}>
                    <Card
                      elevation={isEarned ? 6 : 2}
                      sx={{
                        position: 'relative',
                        transition: 'all 0.3s',
                        opacity: isEarned ? 1 : 0.4,
                        transform: isEarned ? 'scale(1)' : 'scale(0.95)',
                        '&:hover': {
                          transform: isEarned ? 'scale(1.05)' : 'scale(0.95)',
                        },
                      }}
                    >
                      <CardContent
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          background: isEarned
                            ? badgeColors[badgeType]
                            : 'linear-gradient(135deg, #E0E0E0 0%, #BDBDBD 100%)',
                          border: isNew ? '3px solid #FFD700' : 'none',
                          boxShadow: isNew
                            ? '0 0 20px rgba(255, 215, 0, 0.6)'
                            : 'none',
                        }}
                      >
                        {/* Badge Icon */}
                        <Box
                          sx={{
                            fontSize: '3rem',
                            mb: 1,
                            filter: isEarned
                              ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                              : 'grayscale(100%)',
                          }}
                        >
                          {isEarned ? badgeIcons[badgeType] : '🔒'}
                        </Box>

                        {/* Badge Name */}
                        <Typography
                          variant='body2'
                          sx={{
                            fontWeight: 'bold',
                            color: isEarned ? '#FFF' : '#666',
                            fontFamily: '"Comic Sans MS", cursive',
                            fontSize: '0.9rem',
                            textShadow: isEarned
                              ? '1px 1px 2px rgba(0,0,0,0.3)'
                              : 'none',
                          }}
                        >
                          {badgeType}
                        </Typography>

                        {/* New Badge Indicator */}
                        {isNew && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: -10,
                              right: -10,
                              bgcolor: '#FF5722',
                              color: '#FFF',
                              fontWeight: 'bold',
                              fontSize: '0.7rem',
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              border: '2px solid #FFF',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                            }}
                          >
                            NEW!
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            {/* Progress Message */}
            {badges.length > 0 && (
              <Box
                sx={{
                  mt: 4,
                  p: 3,
                  bgcolor: '#E3F2FD',
                  borderRadius: 3,
                  border: '2px solid #2196F3',
                  textAlign: 'center',
                }}
              >
                <Typography
                  variant='h6'
                  sx={{
                    color: '#1976D2',
                    fontFamily: '"Comic Sans MS", cursive',
                    fontWeight: 'bold',
                  }}
                >
                  🌟 You've earned {badges.length} badge{badges.length !== 1 ? 's' : ''}! Keep
                  exploring! 🌟
                </Typography>
              </Box>
            )}
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
