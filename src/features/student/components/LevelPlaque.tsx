import { Box } from '@mui/material';
import levelImg from '../../../assets/dashboard/level.png';

interface LevelPlaqueProps {
  currentLevel: string;
  exercisesCompleted: number;
  totalExercises: number;
  averageScore: number;
  width?: number | string;
}

export const LevelPlaque = ({
  currentLevel,
  exercisesCompleted,
  totalExercises,
  averageScore,
  width = '100%',
}: LevelPlaqueProps) => {
  return (
    <Box
      sx={{
        width: width,
        maxWidth: 700,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <svg
        viewBox='0 0 700 200'
        preserveAspectRatio='xMidYMid meet'
        style={{
          width: '100%',
          height: 'auto',
        }}
      >
        {/* Background level image */}
        <image
          href={levelImg}
          width='700'
          height='250'
          preserveAspectRatio='xMidYMid meet'
        />

        {/* Level title */}
        <text
          x='32%'
          y='50%'
          dominantBaseline='middle'
          textAnchor='middle'
          fill='#EEDBA1'
          fontFamily='Comic Sans MS, cursive'
          fontSize='28'
          fontWeight='900'
          style={{
            filter: 'drop-shadow(0 2px 0 rgba(255,255,255,0.25)) drop-shadow(0 3px 6px rgba(0,0,0,0.25))',
          }}
        >
          {currentLevel} Sapling
        </text>

        {/* Exercise Complete */}
        <text
          x='32%'
          y='80%'
          dominantBaseline='middle'
          textAnchor='middle'
          fill='#5a3a22'
          fontFamily='Comic Sans MS, cursive'
          fontSize='20'
          fontWeight='800'
          style={{
            filter: 'drop-shadow(0 2px 0 rgba(255,255,255,0.25)) drop-shadow(0 3px 6px rgba(0,0,0,0.25))',
          }}
        >
          Exercise Complete {exercisesCompleted}/{totalExercises}
        </text>

        {/* Stars earned */}
        <text
          x='75%'
          y='80%'
          dominantBaseline='middle'
          textAnchor='middle'
          fill='#5a3a22'
          fontFamily='Comic Sans MS, cursive'
          fontSize='20'
          fontWeight='800'
          style={{
            filter: 'drop-shadow(0 2px 0 rgba(255,255,255,0.25)) drop-shadow(0 3px 6px rgba(0,0,0,0.25))',
          }}
        >
          {averageScore} stars earned
        </text>
      </svg>
    </Box>
  );
};
