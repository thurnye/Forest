import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  TextField,
  InputAdornment,
  Chip,
  Typography,
  Paper,
  Grid,
  Tabs,
  Tab,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  Nature as NatureIcon,
  LocationCity as LocationCityIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@app/hooks/app.hooks';
import {
  setSearchQuery,
  setFilterCategory,
  setFilterContinent,
  selectWonder,
  setMode,
  initializeProgress,
} from '../redux/slices/explorer.slice';
import { WonderCategory, WonderContinent } from '../types/explorer.types';

export const ExplorerMapPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { wonders, studentProgress, filterCategory, filterContinent, searchQuery } =
    useAppSelector((state) => state.explorer);
  const { user } = useAppSelector((state) => state.auth);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    // Initialize student progress if not already initialized
    if (user && !studentProgress) {
      dispatch(initializeProgress(user.id));
    }
  }, [user, studentProgress, dispatch]);

  const handleWonderClick = (wonderId: string) => {
    dispatch(selectWonder(wonderId));
    navigate(`/student/explorer/wonder/${wonderId}`);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    dispatch(setMode(newValue === 0 ? 'explorer' : 'quiz'));
    if (newValue === 1) {
      navigate('/student/explorer/quiz');
    }
  };

  const handleCategoryFilter = (category: WonderCategory | null) => {
    dispatch(setFilterCategory(filterCategory === category ? null : category));
  };

  const handleContinentFilter = (continent: WonderContinent | null) => {
    dispatch(setFilterContinent(filterContinent === continent ? null : continent));
  };

  const filteredWonders = wonders.filter((wonder) => {
    const matchesCategory = !filterCategory || wonder.category === filterCategory;
    const matchesContinent = !filterContinent || wonder.continent === filterContinent;
    const matchesSearch =
      !searchQuery ||
      wonder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wonder.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesContinent && matchesSearch;
  });

  const wondersVisited = studentProgress?.wondersVisited || 0;
  const totalWonders = studentProgress?.totalWonders || 196;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #87CEEB 0%, #98D8E8 100%)',
        position: 'relative',
        pb: 4,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
          borderBottom: '4px solid #654321',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          position: 'relative',
        }}
      >
        <Container maxWidth='lg'>
          <Box sx={{ display: 'flex', alignItems: 'center', py: 2, gap: 2 }}>
            {/* Tree decoration left */}
            <Box sx={{ fontSize: '2rem' }}>🌳</Box>

            <Typography
              variant='h4'
              sx={{
                color: '#FFF',
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                fontFamily: '"Comic Sans MS", cursive',
              }}
            >
              Reading Forest
            </Typography>

            {/* Tree decoration right */}
            <Box sx={{ fontSize: '2rem' }}>🌲</Box>

            {/* Coins/decorations */}
            <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
              <Box sx={{ fontSize: '1.5rem' }}>⭐</Box>
              <Box sx={{ fontSize: '1.5rem' }}>🍃</Box>
            </Box>
          </Box>

          {/* Tabs */}
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                color: '#FFF',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                textTransform: 'none',
                fontFamily: '"Comic Sans MS", cursive',
              },
              '& .Mui-selected': {
                color: '#FFD700 !important',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#FFD700',
                height: 3,
              },
            }}
          >
            <Tab label='Explorer Mode' />
            <Tab label='Quiz Mode' />
          </Tabs>
        </Container>
      </Box>

      <Container maxWidth='lg' sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          {/* Left Panel - Filters and Passport */}
          <Grid item xs={12} md={3}>
            <Paper
              elevation={4}
              sx={{
                p: 2,
                background: 'linear-gradient(135deg, #D2691E 0%, #CD853F 100%)',
                border: '3px solid #8B4513',
                borderRadius: 3,
              }}
            >
              {/* Search */}
              <TextField
                fullWidth
                placeholder='Search a wonder...'
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  sx: {
                    bgcolor: 'white',
                    borderRadius: 2,
                    '& fieldset': { border: 'none' },
                  },
                }}
                sx={{ mb: 2 }}
              />

              {/* Category Filters */}
              <Box sx={{ mb: 2 }}>
                <Chip
                  icon={<NatureIcon />}
                  label='Natural'
                  onClick={() => handleCategoryFilter(WonderCategory.NATURAL)}
                  sx={{
                    bgcolor: filterCategory === WonderCategory.NATURAL ? '#4CAF50' : '#FFF',
                    color: filterCategory === WonderCategory.NATURAL ? '#FFF' : '#333',
                    fontWeight: 'bold',
                    mr: 1,
                    mb: 1,
                    '&:hover': {
                      bgcolor: filterCategory === WonderCategory.NATURAL ? '#45a049' : '#f0f0f0',
                    },
                  }}
                />
                <Chip
                  icon={<LocationCityIcon />}
                  label='Man-Made'
                  onClick={() => handleCategoryFilter(WonderCategory.MAN_MADE)}
                  sx={{
                    bgcolor: filterCategory === WonderCategory.MAN_MADE ? '#2196F3' : '#FFF',
                    color: filterCategory === WonderCategory.MAN_MADE ? '#FFF' : '#333',
                    fontWeight: 'bold',
                    mb: 1,
                    '&:hover': {
                      bgcolor: filterCategory === WonderCategory.MAN_MADE ? '#1976d2' : '#f0f0f0',
                    },
                  }}
                />
              </Box>

              {/* Continent Filters */}
              <Box sx={{ mb: 3 }}>
                {[
                  WonderContinent.AFRICA,
                  WonderContinent.ASIA,
                  WonderContinent.EUROPE,
                  WonderContinent.AMERICAS,
                ].map((continent) => (
                  <Chip
                    key={continent}
                    label={continent}
                    onClick={() => handleContinentFilter(continent)}
                    sx={{
                      bgcolor: filterContinent === continent ? '#FF9800' : '#FFF',
                      color: filterContinent === continent ? '#FFF' : '#333',
                      fontWeight: 'bold',
                      mr: 1,
                      mb: 1,
                      '&:hover': {
                        bgcolor: filterContinent === continent ? '#f57c00' : '#f0f0f0',
                      },
                    }}
                  />
                ))}
              </Box>

              {/* My Passport Section */}
              <Box
                sx={{
                  bgcolor: '#FFF9E6',
                  borderRadius: 2,
                  p: 2,
                  border: '2px solid #FFD700',
                }}
              >
                <Typography
                  variant='h6'
                  sx={{
                    fontWeight: 'bold',
                    color: '#8B4513',
                    mb: 1,
                    fontFamily: '"Comic Sans MS", cursive',
                  }}
                >
                  My Passport
                </Typography>

                <Typography
                  variant='body2'
                  sx={{
                    color: '#666',
                    mb: 2,
                    fontWeight: 'bold',
                  }}
                >
                  Wonders Found: {wondersVisited} / {totalWonders}
                </Typography>

                {/* Badge Preview */}
                <Grid container spacing={1} sx={{ mb: 2 }}>
                  {studentProgress?.badges.slice(0, 8).map((badge, index) => (
                    <Grid item xs={3} key={index}>
                      <Box
                        sx={{
                          width: '100%',
                          aspectRatio: '1',
                          borderRadius: '50%',
                          bgcolor: badge.isNew ? '#FFD700' : '#4CAF50',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.2rem',
                          border: '2px solid #FFF',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        }}
                      >
                        🏆
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                {/* Journey Map Button */}
                <Button
                  fullWidth
                  variant='contained'
                  onClick={() => navigate('/student/explorer/journey')}
                  sx={{
                    bgcolor: '#4CAF50',
                    color: '#FFF',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    py: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontFamily: '"Comic Sans MS", cursive',
                    border: '2px solid #2E7D32',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    '&:hover': {
                      bgcolor: '#45a049',
                    },
                  }}
                >
                  🗺️ View Journey Map
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Right Panel - Map */}
          <Grid item xs={12} md={9}>
            <Paper
              elevation={4}
              sx={{
                p: 2,
                background: '#FFF',
                border: '3px solid #8B4513',
                borderRadius: 3,
                minHeight: '600px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Map Container */}
              <Box
                sx={{
                  width: '100%',
                  height: '600px',
                  backgroundImage: 'url(/world-map.svg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                  borderRadius: 2,
                }}
              >
                {/* Render Wonder Pins */}
                {filteredWonders.slice(0, 20).map((wonder, index) => {
                  // Calculate position based on lat/long (simplified)
                  const x = ((wonder.longitude + 180) / 360) * 100;
                  const y = ((90 - wonder.latitude) / 180) * 100;

                  return (
                    <Box
                      key={wonder.id}
                      onClick={() => handleWonderClick(wonder.id)}
                      sx={{
                        position: 'absolute',
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: 'translate(-50%, -50%)',
                        cursor: wonder.isUnlocked ? 'pointer' : 'not-allowed',
                        opacity: wonder.isUnlocked ? 1 : 0.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          bgcolor: wonder.isVisited
                            ? '#FFD700'
                            : wonder.isUnlocked
                            ? '#4CAF50'
                            : '#999',
                          border: '3px solid #FFF',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          color: '#FFF',
                          fontSize: '0.9rem',
                          transition: 'all 0.3s',
                          '&:hover': {
                            transform: wonder.isUnlocked ? 'scale(1.2)' : 'none',
                            zIndex: 10,
                          },
                        }}
                      >
                        {index + 1}
                      </Box>
                    </Box>
                  );
                })}

                {/* Instruction */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 20,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bgcolor: '#FFF',
                    px: 3,
                    py: 1,
                    borderRadius: 20,
                    border: '2px solid #4CAF50',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 'bold',
                      color: '#4CAF50',
                      fontFamily: '"Comic Sans MS", cursive',
                    }}
                  >
                    📍 Tap a pin to learn!
                  </Typography>
                </Box>
              </Box>

              {/* Owl Mascot */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 20,
                  right: 20,
                  fontSize: '4rem',
                }}
              >
                🦉
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
