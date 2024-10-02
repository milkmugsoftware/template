import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const BackgroundElement = ({ size, initialPosition, type, gradient }: { size: number, initialPosition: { x: number, y: number }, type: string, gradient: string }) => {
  let shape;
  switch(type) {
    case 'circle':
      shape = 'rounded-full';
      break;
    case 'fluid':
      shape = `rounded-[${Math.floor(Math.random() * 50)}%_${Math.floor(Math.random() * 50)}%_${Math.floor(Math.random() * 50)}%_${Math.floor(Math.random() * 50)}]`;
      break;
    default:
      shape = 'rounded-full';
  }
  const gradients = [
    'linear-gradient(to bottom right, #FF6B6B, #4ECDC4)',
    'linear-gradient(to bottom right, #A3A1FF, #3A3897)',
    'linear-gradient(to bottom right, #FFD93D, #FF6B6B)',
    'linear-gradient(to bottom right, #6DD5FA, #2980B9)',
    'linear-gradient(to bottom right, #FF9A8B, #FF6A88)',
  ];
  const BackgroundElement = styled(motion.div)(({ theme }) => ({
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(40px)',
    opacity: 0.2,
  }));
  return (
    <>
    {[...Array(100)].map((_, i) => (
        <BackgroundElement
          key={`element-${i}`}
          style={{
            width: `calc(${Math.random() * 200 + 50}px + 10vw)`,
            height: `calc(${Math.random() * 200 + 50}px + 10vw)`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            background: gradients[Math.floor(Math.random() * gradients.length)],
          }}
          animate={{
            x: [0, Math.random() * 200 - 100, Math.random() * 200 - 100, 0],
            y: [0, Math.random() * 200 - 100, Math.random() * 200 - 100, 0],
            rotate: [0, 360],
          }}
          transition={{
            repeat: Infinity,
            duration: Math.random() * 10 + 5,
            ease: "linear",
          }}
        />
      ))}
    </>
  );
};

const GradientBackground = () => {
  const gradients = [
    'from-pink-300 to-purple-300',
    'from-blue-300 to-green-300',
    'from-yellow-300 to-red-300',
    'from-indigo-300 to-teal-300',
    'from-orange-300 to-pink-300',
  ];

  const backgroundElements = useMemo(() => {
    return (
      <>
        {[...Array(1)].map((_, i) => (
          <BackgroundElement 
            key={`element-${i}`} 
            size={Math.random() * 200 + 50}
            initialPosition={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
            type={['circle', 'fluid'][Math.floor(Math.random() * 2)]}
            gradient={gradients[Math.floor(Math.random() * gradients.length)]}
          />
        ))}
      </>
    );
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        overflow: 'hidden',
      }}
    >
      {backgroundElements}
    </Box>
  );
};

export default GradientBackground;
