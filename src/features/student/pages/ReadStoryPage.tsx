import { Box } from '@mui/material';
import loginBg from '../../../assets/practiceExercise/practiveEx-background.png';
import board from '../../../assets/practiceExercise/cleanBoard.png';
import { HeaderPlaque } from '../components/HeaderPlaque';
import greenBtn from '../../../assets/practiceExercise/green-btn.png';
import yellowBtn from '../../../assets/practiceExercise/yellow-btn.png';
import brownBtn from '../../../assets/practiceExercise/brown-btn.png';
import squareBtn from '../../../assets/practiceExercise/green-sq-btn.png';
import PillBtn from '../../../assets/practiceExercise/pill-Button.png';
import { useNavigate } from 'react-router-dom';


// fix the back button in HeaderPlaque
export default function ReadStoryPage() {
  const navigate = useNavigate();

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
        <HeaderPlaque title='Practice Quest' backTo='/student'/>

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
          <svg
            viewBox='0 0 1100 900'
            preserveAspectRatio='xMidYMid meet'
            style={{
              width: '100%',
              height: 'auto',
            }}
          >
            <style>
              {`
                .hover-btn {
                  cursor: pointer;
                  transition: transform 0.2s ease, filter 0.2s ease;
                  transform-origin: center;
                  transform-box: fill-box;
                }
                .hover-btn:hover {
                  transform: translateY(-8px);
                  filter: brightness(1.1);
                }
                .hover-btn:active {
                  transform: translateY(2px);
                }
              `}
            </style>
            {/* Board background image */}
            <image
              href={board}
              width='1100'
              height='900'
              preserveAspectRatio='xMidYMid meet'
            />

            {/* Today's Quest text */}
            <text
              x='54%'
              y='11%'
              dominantBaseline='middle'
              textAnchor='middle'
              fill='#5a3a22'
              fontFamily='Comic Sans MS, cursive'
              fontSize='43'
              fontWeight='700'
              style={{
                filter: 'drop-shadow(1px 1px 2px rgba(255,215,0,0.2))',
              }}
            >
              Today's Quest
            </text>

            {/* Daily Streak */}
            <g>
              <text
                x='54%'
                y='18%'
                dominantBaseline='middle'
                textAnchor='middle'
                fill='#5a3a22'
                fontFamily='Comic Sans MS, cursive'
                fontSize='20'
                fontWeight='700'
                style={{
                  filter: 'drop-shadow(1px 1px 2px rgba(255,215,0,0.2))',
                }}
              >
                Daily Streak: 3 Days 🔥
              </text>

              {/* Progress bar background */}
              <rect
                x='370'
                y='175'
                width='360'
                height='15'
                rx='12'
                ry='12'
                fill='#d4c4a8'
              />
              {/* Progress bar fill (2 of 5 = 40%) */}
              <rect
                x='370'
                y='175'
                width='144'
                height='15'
                rx='12'
                ry='12'
                fill='#cfb42f'
              />

              {/* Quest progress text */}
              <text
                x='54%'
                y='23.2%'
                dominantBaseline='middle'
                textAnchor='middle'
                fill='#5a3a22'
                fontFamily='Comic Sans MS, cursive'
                fontSize='20'
                fontWeight='700'
                style={{
                  filter: 'drop-shadow(1px 1px 2px rgba(255,215,0,0.2))',
                }}
              >
                2 of 5 quests done
              </text>
            </g>

            {/* Recommended Quest */}
            <g>
              <g>
                <image
                  href={PillBtn}
                  x='70%'
                  y='29%'
                  width='200'
                  height='120'
                  preserveAspectRatio='xMidYMid meet'
                />
                <text
                  x='78%'
                  y='35.7%'
                  dominantBaseline='middle'
                  textAnchor='middle'
                  fill='#f5eece'
                  fontFamily='Comic Sans MS, cursive'
                  fontSize='15'
                  fontWeight='700'
                  style={{ pointerEvents: 'none' }}
                >
                  Leaf Level
                </text>
              </g>
              <text
                x='45%'
                y='40%'
                dominantBaseline='middle'
                textAnchor='middle'
                fill='#5a3a22'
                fontFamily='Comic Sans MS, cursive'
                fontSize='38'
                fontWeight='700'
                style={{
                  filter: 'drop-shadow(1px 1px 2px rgba(255,215,0,0.2))',
                }}
              >
                <tspan x='52%' dy='0'>
                  Reading Comprehension:
                </tspan>
                <tspan x='52%' dy='50'>
                  The Lost Treasure
                </tspan>
              </text>
              <text
                x='48%'
                y='51%'
                dominantBaseline='middle'
                textAnchor='middle'
                fill='#5a3a22'
                fontFamily='Comic Sans MS, cursive'
                fontSize='25'
                fontWeight='700'
                style={{
                  filter: 'drop-shadow(1px 1px 2px rgba(255,215,0,0.2))',
                }}
              >
                Quick Story + 3 questions
              </text>
              <g
                className='hover-btn'
                onClick={() => navigate('/student/read-story/exercise-1')}
              >
                <image
                  href={squareBtn}
                  x='34%'
                  y='49%'
                  width='300'
                  height='120'
                  preserveAspectRatio='xMidYMid meet'
                />
                <text
                  x='48%'
                  y='55.5%'
                  dominantBaseline='middle'
                  textAnchor='middle'
                  fill='#f5eece'
                  fontFamily='Comic Sans MS, cursive'
                  fontSize='25'
                  fontWeight='700'
                  style={{ pointerEvents: 'none' }}
                >
                  READ & ANSWER
                </text>
              </g>
            </g>

            {/* Phonics Practice: Letter Sounds */}
            <g>
              <g>
                <image
                  href={PillBtn}
                  x='17%'
                  y='59%'
                  width='200'
                  height='120'
                  preserveAspectRatio='xMidYMid meet'
                />
                <text
                  x='25%'
                  y='66%'
                  dominantBaseline='middle'
                  textAnchor='middle'
                  fill='#f5eece'
                  fontFamily='Comic Sans MS, cursive'
                  fontSize='15'
                  fontWeight='700'
                  style={{ pointerEvents: 'none' }}
                >
                  Sprout
                </text>
              </g>
              <text
                x='34%'
                y='72%'
                dominantBaseline='middle'
                textAnchor='middle'
                fill='#5a3a22'
                fontFamily='Comic Sans MS, cursive'
                fontSize='35'
                fontWeight='700'
                style={{
                  filter: 'drop-shadow(1px 1px 2px rgba(255,215,0,0.2))',
                }}
              >
                <tspan x='32%' dy='0'>
                  Phonics Practice:
                </tspan>
                <tspan x='28%' dy='40' fontSize='28'>
                  Letter Sounds
                </tspan>
              </text>
              <g
                className='hover-btn'
                onClick={() => navigate('/student/read-story/exercise-2')}
              >
                <image
                  href={squareBtn}
                  x='18%'
                  y='77%'
                  width='250'
                  height='120'
                  preserveAspectRatio='xMidYMid meet'
                />
                <text
                  x='29%'
                  y='84%'
                  dominantBaseline='middle'
                  textAnchor='middle'
                  fill='#f5eece'
                  fontFamily='Comic Sans MS, cursive'
                  fontSize='23'
                  fontWeight='700'
                  style={{ pointerEvents: 'none' }}
                >
                  SOUND GAME
                </text>
              </g>
            </g>

            {/* Story Sequencing  */}
            <g>
              <g>
                <image
                  href={PillBtn}
                  x='56%'
                  y='59%'
                  width='200'
                  height='120'
                  preserveAspectRatio='xMidYMid meet'
                />
                <text
                  x='64%'
                  y='66%'
                  dominantBaseline='middle'
                  textAnchor='middle'
                  fill='#f5eece'
                  fontFamily='Comic Sans MS, cursive'
                  fontSize='15'
                  fontWeight='700'
                  style={{ pointerEvents: 'none' }}
                >
                  Leaf Level
                </text>
              </g>
              <text
                x='68%'
                y='72%'
                dominantBaseline='middle'
                textAnchor='middle'
                fill='#5a3a22'
                fontFamily='Comic Sans MS, cursive'
                fontSize='35'
                fontWeight='700'
                style={{
                  filter: 'drop-shadow(1px 1px 2px rgba(255,215,0,0.2))',
                }}
              >
                <tspan x='72%' dy='0'>
                  Story Sequencing:
                </tspan>
                <tspan x='67%' dy='40' fontSize='28'>
                  Letter Sounds
                </tspan>
              </text>
              <g
                className='hover-btn'
                onClick={() => navigate('/student/read-story/exercise-3')}
              >
                <image
                  href={squareBtn}
                  x='58%'
                  y='77%'
                  width='250'
                  height='120'
                  preserveAspectRatio='xMidYMid meet'
                />
                <text
                  x='70%'
                  y='84%'
                  dominantBaseline='middle'
                  textAnchor='middle'
                  fill='#f5eece'
                  fontFamily='Comic Sans MS, cursive'
                  fontSize='23'
                  fontWeight='700'
                  style={{ pointerEvents: 'none' }}
                >
                  SEE RESULT
                </text>
              </g>
            </g>

            {/* Buttons - bottom row */}
            <g>
              {/* Green button - All */}
              <g
                className='hover-btn'
                onClick={() => console.log('All clicked')}
              >
                <image
                  href={greenBtn}
                  x='300'
                  y='795'
                  width='170'
                  height='90'
                  preserveAspectRatio='xMidYMid meet'
                />
                <text
                  x='384'
                  y='845'
                  dominantBaseline='middle'
                  textAnchor='middle'
                  fill='#f5eece'
                  fontFamily='Comic Sans MS, cursive'
                  fontSize='30'
                  fontWeight='700'
                  style={{ pointerEvents: 'none' }}
                >
                  All
                </text>
              </g>

              {/* Yellow button - To Do */}
              <g
                className='hover-btn'
                onClick={() => console.log('To Do clicked')}
              >
                <image
                  href={yellowBtn}
                  x='491'
                  y='795'
                  width='190'
                  height='90'
                  preserveAspectRatio='xMidYMid meet'
                />
                <text
                  x='590'
                  y='845'
                  dominantBaseline='middle'
                  textAnchor='middle'
                  fill='#5a3a22'
                  fontFamily='Comic Sans MS, cursive'
                  fontSize='30'
                  fontWeight='700'
                  style={{ pointerEvents: 'none' }}
                >
                  To Do
                </text>
              </g>

              {/* Brown button - Done */}
              <g
                className='hover-btn'
                onClick={() => console.log('Done clicked')}
              >
                <image
                  href={brownBtn}
                  x='700'
                  y='795'
                  width='170'
                  height='90'
                  preserveAspectRatio='xMidYMid meet'
                />
                <text
                  x='785'
                  y='843'
                  dominantBaseline='middle'
                  textAnchor='middle'
                  fill='#5a3a22'
                  fontFamily='Comic Sans MS, cursive'
                  fontSize='30'
                  fontWeight='700'
                  style={{ pointerEvents: 'none' }}
                >
                  Done
                </text>
              </g>
            </g>
          </svg>
        </Box>
      </Box>
    </>
  );
}
