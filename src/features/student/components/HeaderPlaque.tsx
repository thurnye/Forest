import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import headerPlaque from '../../../assets/practiceExercise/clean-header.png';
import BackArrow from '../../../assets/icons/backArrow.png';

interface HeaderPlaqueProps {
  title: string;
  width?: number | string;
  backTo: string;
}

export const HeaderPlaque = ({ title, width = '100%', backTo }: HeaderPlaqueProps) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: width,
        maxWidth: 1000,
        margin: 'auto',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <svg
        viewBox='0 0 1000 300'
        preserveAspectRatio='xMidYMid meet'
        style={{
          width: '100%',
          height: 'auto',
        }}
      >
        <style>
          {`
            .back-arrow {
              cursor: pointer;
              transform-origin: center;
              transform-box: fill-box;
            }
            .back-arrow:hover {
              animation: shake 0.4s ease;
            }
            @keyframes shake {
              0%, 100% { transform: translateX(0); }
              20% { transform: translateX(-5px); }
              40% { transform: translateX(5px); }
              60% { transform: translateX(-5px); }
              80% { transform: translateX(5px); }
            }
          `}
        </style>
        {/* Background image */}
        <image
          href={headerPlaque}
          width='1000'
          height='300'
          preserveAspectRatio='xMidYMid meet'
        />

        {/* back arrow */}
        <g
          className='back-arrow'
          onClick={() => navigate(backTo)}
        >
          <image
            x='3%'
            y='10%'
            href={BackArrow}
            width='70'
            height='300'
            preserveAspectRatio='xMidYMid meet'
          />
        </g>

        {/* Text overlay */}
        <text
          x='50%'
          y='50%'
          dominantBaseline='middle'
          textAnchor='middle'
          fill='#5a3a22'
          fontFamily='Comic Sans MS, cursive'
          fontSize='43'
          fontWeight='700'
          style={{
            textShadow: '1px 1px 2px rgba(255,215,0,0.2)',
            filter: 'drop-shadow(1px 1px 2px rgba(255,215,0,0.2))',
          }}
        >
          {title}
        </text>
      </svg>
    </Box>
  );
};
