import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CardMedia, Typography } from '@mui/material';

import welcome_plaque from '../../../assets/dashboard/dashboard_plaque.png';
import loginBg from '../../../assets/dashboard/dasboardBg.png';
import read_story from '../../../assets/dashboard/readStory.png';
import achievement from '../../../assets/dashboard/archievement.png';
import quest from '../../../assets/dashboard/quest.png';
import board1 from '../../../assets/dashboard/board1.png';
import level from '../../../assets/dashboard/level.png';
import slate from '../../../assets/dashboard/slate.png';
import { useAppDispatch, useAppSelector } from '@app/hooks/app.hooks';
import { logout } from '@features/auth/redux/slices/auth.slice';
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
  WebkitTextStroke: '0.6px rgba(255,255,255,0.35)', // helps on textured boards
  textShadow: `
    0 2px 0 rgba(255,255,255,0.25),
    0 3px 6px rgba(0,0,0,0.25)
  `,
  pointerEvents: 'none',
  userSelect: 'none',
  whiteSpace: 'nowrap',
};

const boardTextSx = {
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
  fontFamily: '"Comic Sans MS", cursive',
  fontWeight: 900,
  fontSize: { xs: '1.5rem', sm: '2rem' },
  lineHeight: 1.3,
  color: ' #EEDBA1',
  textAlign: 'center',
  WebkitTextStroke: '0.6px rgba(255,255,255,0.35)',
  textShadow: `0 2px 0 rgba(255,255,255,0.25),0 3px 6px rgba(0,0,0,0.25)`,
  pointerEvents: 'none',
  userSelect: 'none',
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

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

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
        <Box sx={{ position: 'relative' }}>
          {/* welcome back plaque */}
          <CardMedia
            component='img'
            image={welcome_plaque}
            alt='welcome plaque'
            sx={{
              height: '100%',
              width: '100%',
              maxWidth: 800,
              margin: { xs: 'auto', sm: 'auto' },
            }}
          />
          <Typography
            sx={{
              ...boardTextSx,
              top: '40%',
              left: '45%',
            }}
          >
            Hi {user?.firstName}! Welcome
            <br />
            <Box component='span'>back to Reading Forest</Box>
          </Typography>
        </Box>

        {/* LEVEL */}
        {progress && (
          <Box sx={{ mt: 35, position: 'relative' }}>
            <CardMedia
              component='img'
              image={level}
              alt='welcome plaque'
              sx={{
                height: '100%',
                width: '100%',
                maxWidth: 700,
              }}
            />
            <Typography
              sx={{
                ...boardTextSx,
                top: '30%',
                left: 220,
              }}
            >
              {progress.currentLevel} Sapling
            </Typography>

            <Box>
              <Typography
                sx={{
                  ...woodTextSx,
                  top: '75%',
                  left: 230,
                }}
              >
                Exercise Complete{' '}
                {`${progress.exercisesCompleted}/${progress.totalExercises}`}
              </Typography>
              {/* Average Scoe */}
              <Typography
                sx={{
                  ...woodTextSx,
                  top: '75%',
                  left: 530,
                  whiteSpace: 'nowrap',
                }}
              >
                {progress.averageScore} stars earned
              </Typography>
            </Box>
          </Box>
        )}

        {/* QUEST ACCOMPLISHMENTS */}
        <Box
          sx={{
            mt: 5,
            ml: 15,
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <CardMedia
              component='img'
              image={quest}
              alt='welcome plaque'
              sx={{
                height: '100%',
                width: '100%',
                maxWidth: 1000,
                // margin: { xs: 'auto', sm: 'auto' },
              }}
            />
            <Typography
              sx={{
                ...boardTextSx,
                top: '10%',
                left: 240,
              }}
            >
              Today's Forest Quest
            </Typography>
          </Box>
          <Box
            sx={{
              mt: -21,
              ml: 5,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            {goals.length > 0 && (
              <>
                {goals.map((goal) => {
                  const progressPercentage = Math.round(
                  (goal.currentValue / goal.targetValue) * 100
                );
                const isOverdue = new Date(goal.deadline) < new Date() && !goal.isCompleted;
                const daysLeft = Math.ceil(
                  (new Date(goal.deadline).getTime() - new Date().getTime()) /
                    (1000 * 60 * 60 * 24)
                );
                  return(
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component='img'
                      image={board1}
                      alt='welcome plaque'
                      sx={{
                        height: '100%',
                        width: 400,
                        maxWidth: 700,
                        // margin: { xs: 'auto', sm: 'auto' },
                      }}
                    />
                    <Typography
                      sx={{
                        ...woodTextSx,
                        top: '25%',
                        left: 170,
                        whiteSpace: 'wrap',
                      }}
                    >
                      {goal.title}
                    </Typography>
                    <Typography
                      sx={{
                        ...woodTextSx,
                        top: '63%',
                        left: 170,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {progressPercentage}% finished
                    </Typography>
                    <Typography
                      sx={{
                        ...woodTextSx,
                        top: '80%',
                        left: 170,
                        whiteSpace: 'nowrap',
                        fontSize: '0.9rem',
                      }}
                    >
                      {goal.isCompleted
                        ? 'Goal achieved! '
                        : isOverdue
                        ? 'Deadline passed'
                        : daysLeft === 0
                        ? 'Due today'
                        : daysLeft === 1
                        ? 'Due tomorrow'
                        : `${daysLeft} days left`}
                    </Typography>
                  </Box>
                )})}
                {/* <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component='img'
                    image={board1}
                    alt='welcome plaque'
                    sx={{
                      height: '100%',
                      width: 400,
                      maxWidth: 700,
                      // margin: { xs: 'auto', sm: 'auto' },
                    }}
                  />
                  <Typography
                    sx={{
                      ...woodTextSx,
                      top: '25%',
                      left: 170,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Read 5 Stories
                  </Typography>
                  <Typography
                    sx={{
                      ...woodTextSx,
                      top: '63%',
                      left: 170,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    1/5 finished
                  </Typography>
                  <Typography
                    sx={{
                      ...woodTextSx,
                      top: '80%',
                      left: 170,
                      whiteSpace: 'nowrap',
                      fontSize: '0.9rem',
                    }}
                  >
                    7 days left
                  </Typography>
                </Box>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component='img'
                    image={board1}
                    alt='welcome plaque'
                    sx={{
                      height: '100%',
                      width: 400,
                      maxWidth: 700,
                      // margin: { xs: 'auto', sm: 'auto' },
                    }}
                  />
                  <Typography
                    sx={{
                      ...woodTextSx,
                      top: '25%',
                      left: 170,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Earn 90 Stars
                  </Typography>
                  <Typography
                    sx={{
                      ...woodTextSx,
                      top: '63%',
                      left: 170,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    85/90
                  </Typography>
                  <Typography
                    sx={{
                      ...woodTextSx,
                      top: '80%',
                      left: 170,
                      whiteSpace: 'nowrap',
                      fontSize: '0.9rem',
                    }}
                  >
                    30 days left
                  </Typography>
                </Box> */}
              </>
            )}
          </Box>
        </Box>

        {/* ACTIONs */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 5,
            mt: 5,
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
            onClick={() => navigate('/student/exercises')}
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
