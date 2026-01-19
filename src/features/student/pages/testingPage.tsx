import { Box } from '@mui/material';
import loginBg from '../../../assets/practiceExercise/practiveEx-background.png';
import { HeaderPlaque } from '../components/HeaderPlaque';
// import { useNavigate } from 'react-router-dom';

export default function TestingPage() {
  // const navigate = useNavigate();

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
        <HeaderPlaque title='My Adventure' backTo='/student'/>

        <Box
          sx={{
            width: { xs: '95%', sm: '90%', md: '85%', lg: '80%' },
            maxWidth: 1100,
            margin: 'auto',
            marginTop: '-75px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
        
        </Box>
      </Box>
    </>
  );
}
