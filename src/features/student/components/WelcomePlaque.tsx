import { Box } from '@mui/material';
import welcome_plaque from '../../../assets/dashboard/dashboard_plaque.png';
import homeIcon from '../../../assets/icons/home.png';
import backpack from '../../../assets/icons/backpack.png';
import starIcon from '../../../assets/icons/star.png';
import flaskIcon from '../../../assets/icons/flask.png';

interface WelcomePlaqueProps {
  firstName?: string;
  width?: number | string;
  onLogout?: () => void;
}

export const WelcomePlaque = ({
  firstName,
  width = '100%',
  onLogout,
}: WelcomePlaqueProps) => {
  return (
    <Box
      sx={{
        width: width,
        maxWidth: 800,
        margin: 'auto',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <svg
        viewBox='0 0 800 300'
        preserveAspectRatio='xMidYMid meet'
        style={{
          width: '100%',
          height: 'auto',
        }}
      >
        <style>
          {`
            .icon-btn {
              cursor: pointer;
              transition: transform 0.2s ease;
              transform-origin: center;
              transform-box: fill-box;
            }
            .icon-btn:hover {
              animation: bounce 0.5s ease;
            }
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              25% { transform: translateY(-8px); }
              50% { transform: translateY(0); }
              75% { transform: translateY(-4px); }
            }
          `}
        </style>
        {/* Background plaque image */}
        <image
          href={welcome_plaque}
          width='800'
          height='300'
          preserveAspectRatio='xMidYMid meet'
        />

        {/* Welcome text */}
        <text
          x='50%'
          y='40%'
          dominantBaseline='middle'
          textAnchor='middle'
          fill='#EEDBA1'
          fontFamily='Comic Sans MS, cursive'
          fontSize='32'
          fontWeight='900'
          style={{
            filter:
              'drop-shadow(0 2px 0 rgba(255,255,255,0.25)) drop-shadow(0 3px 6px rgba(0,0,0,0.25))',
          }}
        >
          <tspan x='42%' dy='0'>
            Hi {firstName}! Welcome
          </tspan>
          <tspan x='43%' dy='40'>
            back to Reading Forest
          </tspan>
        </text>

        <g>
          <g
            className='icon-btn'
            onClick={() => console.log('/student/read-story/exercise-2')}
          >
            <image
              href={homeIcon}
              x='72%'
              y='30%'
              width='50'
              height='120'
              preserveAspectRatio='xMidYMid meet'
            />
          </g>
          <g
            className='icon-btn'
            onClick={() => console.log('/student/read-story/exercise-2')}
          >
            <image
              href={backpack}
              x='79%'
              y='32%'
              width='50'
              height='120'
              preserveAspectRatio='xMidYMid meet'
            />
          </g>
          <g
            className='icon-btn'
            onClick={() => console.log('/student/read-story/exercise-2')}
          >
            <image
              href={starIcon}
              x='85.5%'
              y='32%'
              width='50'
              height='120'
              preserveAspectRatio='xMidYMid meet'
            />
            {/* Background rect for the number */}
            <rect
              x='693'
              y='177'
              width='30'
              height='24'
              rx='10'
              ry='10'
              fill='#472f0d92'
            />
            <text
              x='88.5%'
              y='63%'
              dominantBaseline='middle'
              textAnchor='middle'
              fill='#f5eece'
              fontFamily='Comic Sans MS, cursive'
              fontSize='18'
              fontWeight='700'
              style={{ pointerEvents: 'none' }}
            >
              85
            </text>
          </g>
          <g
            className='icon-btn'
            onClick={onLogout}
          >
            <image
              href={flaskIcon}
              x='92%'
              y='32%'
              width='40'
              height='120'
              preserveAspectRatio='xMidYMid meet'
            />
          </g>
        </g>
      </svg>
    </Box>
  );
};
