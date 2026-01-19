import { Box } from '@mui/material';
import questImg from '../../../assets/dashboard/quest.png';
import board1 from '../../../assets/dashboard/board1.png';

interface Goal {
  id: string;
  title: string;
  currentValue: number;
  targetValue: number;
  deadline: string;
  isCompleted: boolean;
}

interface QuestAccomplishmentsProps {
  goals: Goal[];
  width?: number | string;
}

export const QuestAccomplishments = ({
  goals,
  width = '100%',
}: QuestAccomplishmentsProps) => {
  // Calculate viewBox height based on number of goals
  const cardWidth = 350;
  const cardHeight = 200;
  const cardSpacing = 20;
  const bannerHeight = 150;
  const totalWidth = Math.max(900, goals.length * (cardWidth + cardSpacing));
  const totalHeight = 270;

  return (
    <Box
      sx={{
        width: width,
        maxWidth: 1200,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <svg
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        preserveAspectRatio='xMidYMid meet'
        style={{
          width: '100%',
          height: 'auto',
        }}
      >
        {/* Quest banner image */}
        <image
          href={questImg}
          x='0'
          y='0'
          width='700'
          height='200'
          preserveAspectRatio='xMidYMid meet'
        />

        {/* Forest Quest title */}
        <text
          x='175'
          y='45'
          dominantBaseline='middle'
          textAnchor='middle'
          fill='#EEDBA1'
          fontFamily='Comic Sans MS, cursive'
          fontSize='28'
          fontWeight='900'
          style={{
            filter:
              'drop-shadow(0 2px 0 rgba(255,255,255,0.25)) drop-shadow(0 3px 6px rgba(0,0,0,0.25))',
          }}
        >
          Forest Quest
        </text>

        {/* Goal cards - mapped inside SVG */}
        {goals.map((goal, index) => {
          const progressPercentage = Math.round(
            (goal.currentValue / goal.targetValue) * 100,
          );
          const isOverdue =
            new Date(goal.deadline) < new Date() && !goal.isCompleted;
          const daysLeft = Math.ceil(
            (new Date(goal.deadline).getTime() - new Date().getTime()) /
              (1000 * 60 * 60 * 24),
          );

          const deadlineText = goal.isCompleted
            ? 'Goal achieved!'
            : isOverdue
              ? 'Deadline passed'
              : daysLeft === 0
                ? 'Due today'
                : daysLeft === 1
                  ? 'Due tomorrow'
                  : `${daysLeft} days left`;

          // Position each card horizontally
          const xOffset = index * (cardWidth + cardSpacing) + 20;
          const yOffset = bannerHeight - 100;

          return (
            <g key={goal.id} transform={`translate(${xOffset}, ${yOffset})`}>
              {/* Board background */}
              <image
                href={board1}
                width={cardWidth}
                height={cardHeight}
                preserveAspectRatio='xMidYMid meet'
              />

              {/* Goal title */}
              <text
                x={cardWidth / 2.35}
                y={cardHeight * 0.22}
                dominantBaseline='middle'
                textAnchor='middle'
                fill='#5a3a22'
                fontFamily='Comic Sans MS, cursive'
                fontSize='15'
                fontWeight='800'
                style={{
                  filter:
                    'drop-shadow(0 2px 0 rgba(255,255,255,0.25)) drop-shadow(0 3px 6px rgba(0,0,0,0.25))',
                }}
              >
                {goal.title}
              </text>

              {/* Progress percentage */}
              <text
                x={cardWidth / 2.35}
                y={cardHeight * 0.48}
                dominantBaseline='middle'
                textAnchor='middle'
                fill='#5a3a22'
                fontFamily='Comic Sans MS, cursive'
                fontSize='18'
                fontWeight='800'
                style={{
                  filter:
                    'drop-shadow(0 2px 0 rgba(255,255,255,0.25)) drop-shadow(0 3px 6px rgba(0,0,0,0.25))',
                }}
              >
                {progressPercentage}% finished
              </text>

              {/* Deadline text */}
              <text
                x={cardWidth / 2.35}
                y={cardHeight * 0.85}
                dominantBaseline='middle'
                textAnchor='middle'
                fill='#5a3a22'
                fontFamily='Comic Sans MS, cursive'
                fontSize='14'
                fontWeight='800'
                style={{
                  filter:
                    'drop-shadow(0 2px 0 rgba(255,255,255,0.25)) drop-shadow(0 3px 6px rgba(0,0,0,0.25))',
                }}
              >
                {deadlineText}
              </text>
            </g>
          );
        })}
      </svg>
    </Box>
  );
};
