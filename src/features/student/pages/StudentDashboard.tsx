import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CardMedia, Typography } from '@mui/material';

import loginBg from '../../../assets/dashboard/dasboardBg.png';
import read_story from '../../../assets/dashboard/readStory.png';
import { WelcomePlaque } from '../components/WelcomePlaque';
import { LevelPlaque } from '../components/LevelPlaque';
import { QuestAccomplishments } from '../components/QuestAccomplishments';
import achievement from '../../../assets/dashboard/archievement.png';
import slate from '../../../assets/dashboard/slate.png';
import { useAppDispatch, useAppSelector } from '@app/hooks/app.hooks';
// import { logout } from '@features/auth/redux/slices/auth.slice';
import {
  fetchProgress,
  fetchGoals,
} from '@features/student/redux/slices/student.slice';
import { Student, UserRole } from '@shared/types/api.types';

const woodTextSx = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  fontFamily: '"Comic Sans MS", cursive',
  fontWeight: 800,
  fontSize: { xs: '1.15rem', sm: '1.55rem' },
  lineHeight: 1,
  letterSpacing: '0.3px',
  color: '#5a3a22',
  textAlign: 'center',
  textTransform: 'none',
  WebkitTextStroke: '0.6px rgba(255,255,255,0.35)',
  textShadow: `
    0 2px 0 rgba(255,255,255,0.25),
    0 3px 6px rgba(0,0,0,0.25)
  `,
  pointerEvents: 'none',
  userSelect: 'none',
  whiteSpace: 'nowrap',
};

export default function StudentDashboard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const student = user?.role === UserRole.STUDENT ? (user as Student) : null;
  const { progress, goals } = useAppSelector((state) => state.student);

  useEffect(() => {
    // Check if student needs to take diagnostic
    if (
      student &&
      student.diagnosticEnabled &&
      !student.hasCompletedDiagnostic
    ) {
      navigate('/student/diagnostic/warmup');
      return;
    }

    dispatch(fetchProgress());
    dispatch(fetchGoals());
  }, [dispatch, student, navigate]);

  // const handleLogout = () => {
  //   dispatch(logout());
  //   navigate('/');
  // };

  console.log('Student Dashboard rendered', { progress, goals });

  return (
    <>
      <Box
        sx={{
          minHeight: '100vh',
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: `url(${loginBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
         <Box
            onClick={() => navigate('/student/explorer/testingPage')}
            sx={{
              position: 'absolute',
              top: 20,
              right: 20,
              cursor: 'pointer',
              padding: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              borderRadius: 2,
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              transition: 'background-color 0.2s',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
               zIndex: 9999
            }}
          >
            <Typography >Testing Page</Typography>
          </Box>

          {/* welcome back plaque */}
        <WelcomePlaque firstName={user?.firstName} />

        

        {/* LEVEL */}
        {progress && (
          <Box sx={{ mt: 5 }}>
            <LevelPlaque
              currentLevel={progress.currentLevel}
              exercisesCompleted={progress.exercisesCompleted}
              totalExercises={progress.totalExercises}
              averageScore={progress.averageScore}
            />
          </Box>
        )}

        {/* QUEST ACCOMPLISHMENTS */}
        {goals.length > 0 && (
          <Box sx={{ ml: 15 }}>
            <QuestAccomplishments goals={goals} />
          </Box>
        )}

        {/* ACTIONs */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 5,
          }}
        >
          {/* Start Adventure Button */}
          <Box
            onClick={() => navigate('/student/assessment')}
            sx={{
              position: 'relative',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-8px)',
              },
              '&:active': {
                transform: 'translateY(2px)',
              },
            }}
          >
            <CardMedia
              component='img'
              image={slate}
              alt='Start Adventure'
              sx={{
                height: '100%',
                width: '100%',
                maxWidth: 400,
              }}
            />
            <Typography sx={woodTextSx}>Start Adventure</Typography>
          </Box>

          {/* Read Story Button */}
          <Box
            onClick={() => navigate('/student/read-story')}
            sx={{
              position: 'relative',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-8px)',
              },
              '&:active': {
                transform: 'translateY(2px)',
              },
            }}
          >
            <CardMedia
              component='img'
              image={read_story}
              alt='Read Story'
              sx={{
                height: '100%',
                width: '100%',
                maxWidth: 400,
              }}
            />
            <Typography sx={woodTextSx}>Read Story</Typography>
          </Box>

          {/* Achievements Button */}
          <Box
            onClick={() => navigate('/student/progress')}
            sx={{
              position: 'relative',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-8px)',
              },
              '&:active': {
                transform: 'translateY(2px)',
              },
            }}
          >
            <CardMedia
              component='img'
              image={achievement}
              alt='Achievements'
              sx={{
                height: '100%',
                width: '100%',
                maxWidth: 400,
              }}
            />
            <Typography sx={woodTextSx}>Achievements</Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
}
