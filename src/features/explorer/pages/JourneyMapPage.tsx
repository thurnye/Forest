import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, IconButton, Paper } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useAppSelector } from '@app/hooks/app.hooks';

interface Station {
  id: number;
  title: string;
  emoji: string;
  position: { top: string; left: string };
  isUnlocked: boolean;
  isCompleted: boolean;
  wonderCount: number;
}

export const JourneyMapPage = () => {
  const navigate = useNavigate();
  const { studentProgress } = useAppSelector((state) => state.explorer);

  const wondersVisited = studentProgress?.wondersVisited || 0;

  // Define stations based on progress
  const stations: Station[] = [
    {
      id: 1,
      title: 'THE FIRST STATION',
      emoji: '🏰',
      position: { top: '15%', left: '15%' },
      isUnlocked: true,
      isCompleted: wondersVisited >= 10,
      wonderCount: Math.min(wondersVisited, 10),
    },
    {
      id: 2,
      title: 'MOUNTAIN VALLEY',
      emoji: '⛰️',
      position: { top: '25%', left: '45%' },
      isUnlocked: wondersVisited >= 10,
      isCompleted: wondersVisited >= 30,
      wonderCount: Math.min(Math.max(wondersVisited - 10, 0), 20),
    },
    {
      id: 3,
      title: 'DESERT OASIS',
      emoji: '🏜️',
      position: { top: '45%', left: '30%' },
      isUnlocked: wondersVisited >= 30,
      isCompleted: wondersVisited >= 60,
      wonderCount: Math.min(Math.max(wondersVisited - 30, 0), 30),
    },
    {
      id: 4,
      title: 'OCEAN SHORES',
      emoji: '🌊',
      position: { top: '50%', left: '65%' },
      isUnlocked: wondersVisited >= 60,
      isCompleted: wondersVisited >= 100,
      wonderCount: Math.min(Math.max(wondersVisited - 60, 0), 40),
    },
    {
      id: 5,
      title: 'FOREST KINGDOM',
      emoji: '🌲',
      position: { top: '70%', left: '40%' },
      isUnlocked: wondersVisited >= 100,
      isCompleted: wondersVisited >= 150,
      wonderCount: Math.min(Math.max(wondersVisited - 100, 0), 50),
    },
    {
      id: 6,
      title: 'THE FINAL WONDER',
      emoji: '🏆',
      position: { top: '80%', left: '70%' },
      isUnlocked: wondersVisited >= 150,
      isCompleted: wondersVisited >= 196,
      wonderCount: Math.min(Math.max(wondersVisited - 150, 0), 46),
    },
  ];

  const handleStationClick = (station: Station) => {
    if (station.isUnlocked) {
      navigate('/student/explorer');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #87CEEB 0%, #98D8E8 100%)',
        py: 3,
      }}
    >
      <Container maxWidth="lg">
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

        {/* Main Journey Map */}
        <Paper
          elevation={12}
          sx={{
            background: 'linear-gradient(135deg, #F4E4C1 0%, #E8D4A0 100%)',
            border: '6px solid #8B4513',
            borderRadius: 4,
            overflow: 'hidden',
            position: 'relative',
            minHeight: '700px',
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.1) 1px, transparent 1px),
              radial-gradient(circle at 80% 70%, rgba(139, 69, 19, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        >
          {/* Header Banner */}
          <Box
            sx={{
              bgcolor: '#8B4513',
              borderBottom: '4px solid #654321',
              py: 2,
              px: 3,
              textAlign: 'center',
              boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.3)',
            }}
          >
            <Typography
              variant="h3"
              sx={{
                color: '#FFF9E6',
                fontWeight: 'bold',
                fontFamily: '"Comic Sans MS", cursive',
                textShadow: '3px 3px 6px rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
              }}
            >
              <Box sx={{ fontSize: '2.5rem' }}>🗺️</Box>
              YOUR JOURNEY MAP
              <Box sx={{ fontSize: '2.5rem' }}>🗺️</Box>
            </Typography>
          </Box>

          {/* Progress Info */}
          <Box
            sx={{
              bgcolor: '#4CAF50',
              borderBottom: '3px solid #2E7D32',
              py: 1.5,
              px: 3,
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: '#FFF',
                fontWeight: 'bold',
                fontFamily: '"Comic Sans MS", cursive',
              }}
            >
              🌟 {wondersVisited} Wonders Discovered! Keep Going! 🌟
            </Typography>
          </Box>

          {/* Journey Map Content */}
          <Box
            sx={{
              position: 'relative',
              minHeight: '600px',
              p: 3,
            }}
          >
            {/* Path connections */}
            {stations.slice(0, -1).map((station, index) => {
              const nextStation = stations[index + 1];
              return (
                <Box
                  key={`path-${station.id}`}
                  sx={{
                    position: 'absolute',
                    top: station.position.top,
                    left: station.position.left,
                    width: `calc(${nextStation.position.left} - ${station.position.left})`,
                    height: `calc(${nextStation.position.top} - ${station.position.top})`,
                    borderBottom: station.isCompleted
                      ? '4px dashed #FFD700'
                      : station.isUnlocked
                      ? '4px dashed #999'
                      : '4px dashed #CCC',
                    opacity: 0.6,
                    pointerEvents: 'none',
                  }}
                />
              );
            })}

            {/* Station markers */}
            {stations.map((station) => (
              <Box
                key={station.id}
                onClick={() => handleStationClick(station)}
                sx={{
                  position: 'absolute',
                  top: station.position.top,
                  left: station.position.left,
                  transform: 'translate(-50%, -50%)',
                  cursor: station.isUnlocked ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: station.isUnlocked
                      ? 'translate(-50%, -50%) scale(1.1)'
                      : 'translate(-50%, -50%)',
                  },
                }}
              >
                {/* Station Circle */}
                <Box
                  sx={{
                    width: { xs: 100, md: 140 },
                    height: { xs: 100, md: 140 },
                    borderRadius: '50%',
                    bgcolor: station.isCompleted
                      ? '#FFD700'
                      : station.isUnlocked
                      ? '#4CAF50'
                      : '#999',
                    border: station.isCompleted
                      ? '5px solid #FFA000'
                      : station.isUnlocked
                      ? '5px solid #2E7D32'
                      : '5px solid #666',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: station.isCompleted
                      ? '0 0 30px rgba(255, 215, 0, 0.8), 0 8px 16px rgba(0,0,0,0.3)'
                      : '0 6px 12px rgba(0,0,0,0.3)',
                    position: 'relative',
                    animation: station.isUnlocked ? 'pulse 2s ease-in-out infinite' : 'none',
                    '@keyframes pulse': {
                      '0%, 100%': {
                        boxShadow: station.isCompleted
                          ? '0 0 20px rgba(255, 215, 0, 0.6), 0 8px 16px rgba(0,0,0,0.3)'
                          : '0 6px 12px rgba(0,0,0,0.3)',
                      },
                      '50%': {
                        boxShadow: station.isCompleted
                          ? '0 0 40px rgba(255, 215, 0, 1), 0 8px 16px rgba(0,0,0,0.3)'
                          : '0 8px 16px rgba(0,0,0,0.4)',
                      },
                    },
                  }}
                >
                  {/* Station Emoji */}
                  <Box sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, mb: 0.5 }}>
                    {station.isUnlocked ? station.emoji : '🔒'}
                  </Box>

                  {/* Wonder Count */}
                  {station.isUnlocked && (
                    <Typography
                      sx={{
                        color: station.isCompleted ? '#8B4513' : '#FFF',
                        fontWeight: 'bold',
                        fontSize: { xs: '0.9rem', md: '1.1rem' },
                        fontFamily: '"Comic Sans MS", cursive',
                      }}
                    >
                      {station.wonderCount}
                    </Typography>
                  )}

                  {/* Completion Star */}
                  {station.isCompleted && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -15,
                        right: -15,
                        fontSize: '2rem',
                        animation: 'spin 3s linear infinite',
                        '@keyframes spin': {
                          '0%': { transform: 'rotate(0deg)' },
                          '100%': { transform: 'rotate(360deg)' },
                        },
                      }}
                    >
                      ⭐
                    </Box>
                  )}
                </Box>

                {/* Station Title */}
                <Box
                  sx={{
                    mt: 1,
                    bgcolor: 'rgba(255, 255, 255, 0.95)',
                    border: '3px solid #8B4513',
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    minWidth: { xs: 120, md: 160 },
                  }}
                >
                  <Typography
                    sx={{
                      color: '#8B4513',
                      fontWeight: 'bold',
                      fontSize: { xs: '0.8rem', md: '1rem' },
                      fontFamily: '"Comic Sans MS", cursive',
                      textAlign: 'center',
                    }}
                  >
                    {station.title}
                  </Typography>
                </Box>
              </Box>
            ))}

            {/* Decorative elements */}
            <Box
              sx={{
                position: 'absolute',
                top: '10%',
                right: '10%',
                fontSize: '3rem',
                opacity: 0.3,
              }}
            >
              🦅
            </Box>
            <Box
              sx={{
                position: 'absolute',
                bottom: '15%',
                left: '8%',
                fontSize: '2.5rem',
                opacity: 0.3,
              }}
            >
              🐚
            </Box>
            <Box
              sx={{
                position: 'absolute',
                top: '40%',
                right: '5%',
                fontSize: '2rem',
                opacity: 0.3,
              }}
            >
              ☁️
            </Box>
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

        {/* Legend */}
        <Paper
          elevation={4}
          sx={{
            mt: 3,
            p: 3,
            background: 'linear-gradient(135deg, #FFF9E6 0%, #FFFACD 100%)',
            border: '3px solid #8B4513',
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: '#8B4513',
              fontWeight: 'bold',
              fontFamily: '"Comic Sans MS", cursive',
              mb: 2,
              textAlign: 'center',
            }}
          >
            🗺️ Map Legend 🗺️
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              justifyContent: 'center',
            }}
          >
            {/* Locked Station */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: '#999',
                  border: '3px solid #666',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                🔒
              </Box>
              <Typography
                sx={{
                  color: '#666',
                  fontFamily: '"Comic Sans MS", cursive',
                  fontWeight: 'bold',
                }}
              >
                Locked
              </Typography>
            </Box>

            {/* Unlocked Station */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: '#4CAF50',
                  border: '3px solid #2E7D32',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✨
              </Box>
              <Typography
                sx={{
                  color: '#4CAF50',
                  fontFamily: '"Comic Sans MS", cursive',
                  fontWeight: 'bold',
                }}
              >
                In Progress
              </Typography>
            </Box>

            {/* Completed Station */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: '#FFD700',
                  border: '3px solid #FFA000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ⭐
              </Box>
              <Typography
                sx={{
                  color: '#FFD700',
                  fontFamily: '"Comic Sans MS", cursive',
                  fontWeight: 'bold',
                }}
              >
                Completed!
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
