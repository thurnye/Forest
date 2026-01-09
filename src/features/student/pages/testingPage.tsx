import { Box, Typography } from '@mui/material';
import loginBg from '../../../assets/student-login-bg.png';
import board from '../../../assets/practiceExercise/cleanBoard.png';
import { HeaderPlaque } from '../components/HeaderPlaque';

export default function TestingPage() {
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
        {/* title header */}
        <HeaderPlaque title="Practice Quest" />

        {/* <Box
          sx={{
            maxWidth: 1000,
            margin: 'auto',
            mt: -12,
            mb: 5,
            px: 4,
            py: 2,
            background: 'rgba(245, 222, 179, 0.9)',
            position: 'relative',
            maskImage: `
              radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 80%)
            `,
            WebkitMaskImage: `
              radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 80%)
            `,
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Comic Sans MS", cursive',
              fontWeight: 700,
              fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' },
              color: '#5a3a22',
              textAlign: 'center',
              textShadow: '1px 1px 2px rgba(255,215,0,0.2)',
            }}
          >
            Choose a quest to help your reading power grow!
          </Typography>
        </Box> */}

        <Box
          sx={{
            height: { xs: 600, sm: 700, md: 800, lg: 900 },
            width: { xs: '95%', sm: '90%', md: '85%', lg: '80%' },
            maxWidth: 1100,
            margin: 'auto',
            position: 'relative',
            backgroundImage: `url(${board})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            marginTop: '-75px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Interactive elements can be added here */}
          <Box>
            <Typography
            sx={{
              position: 'absolute',
              top: '10%',
              left: '55%',
              transform: 'translate(-50%, -50%)',
              fontFamily: '"Comic Sans MS", cursive',
              fontWeight: 700,
              fontSize: 43,
              color: '#5a3a22',
              textAlign: 'center',
              textShadow: '1px 1px 2px rgba(255,215,0,0.2)',
              whiteSpace: 'nowrap',
            }}
          >
            Today's Quest
          </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
}
