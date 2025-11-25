'use client'

import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';

type LightColor = 'red' | 'yellow' | 'green';

interface LightConfig {
  color: LightColor;
  duration: number;
}

const LIGHT_SEQUENCE: LightConfig[] = [
  { color: 'green', duration: 5000 },
  { color: 'yellow', duration: 1000 },
  { color: 'red', duration: 2000 }
];

// Calculate which light should be active based on elapsed time and sequence
function calculateCurrentState(sequence: LightConfig[], elapsedTime: number): { index: number; color: LightColor } {

  
  // Calculate position in the repeating cycle
  const cycleDuration = sequence.reduce((sum, light) => sum + light.duration, 0);
  const positionInCycle = elapsedTime % cycleDuration;
  
  // Find which light should be active based on accumulated durations
  let accumulatedTime = 0;
  for (let i = 0; i < sequence.length; i++) {
    accumulatedTime += sequence[i].duration;
    if (positionInCycle < accumulatedTime) {
      return { index: i, color: sequence[i].color };
    }
  }
  return { index: 0, color: sequence[0].color };
}

const getLightColors = (color: LightColor, isActive: boolean) => {
  const colors = {
    red: {
      active: 'red.500',
      inactive: 'red.900',
      shadow: '0 0 40px rgba(245, 101, 101, 0.8)'
    },
    yellow: {
      active: 'yellow.400',
      inactive: 'yellow.900',
      shadow: '0 0 40px rgba(250, 240, 137, 0.8)'
    },
    green: {
      active: 'green.500',
      inactive: 'green.900',
      shadow: '0 0 40px rgba(72, 187, 120, 0.8)'
    }
  };

  return {
    bg: isActive ? colors[color].active : colors[color].inactive,
    boxShadow: isActive ? colors[color].shadow : 'none'
  };
};

interface LightProps {
  color: LightColor;
  isActive: boolean;
  label: string;
}

function Light({ color, isActive, label }: LightProps) {
  return (
    <VStack>
      <Box
        w="96px"
        h="96px"
        borderRadius="full"
        borderWidth="4px"
        borderColor="gray.600"
        transition="all 0.3s"
        {...getLightColors(color, isActive)}
      />
      <Text color="gray.400" fontSize="sm" fontWeight="medium">
        {label}
      </Text>
    </VStack>
  );
}

export default function Stoplight({ 
}) {
  const mountTimeRef = useRef<number>(Date.now());
  const [currentState, setCurrentState] = useState(() => {
    return { index: 0, color: LIGHT_SEQUENCE[0].color };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - mountTimeRef.current;
      const newState = calculateCurrentState(LIGHT_SEQUENCE, elapsed);
      
      setCurrentState(newState);
    }, 50);

    return () => clearInterval(interval);
  });

  const displayOrder: LightColor[] = ['red', 'yellow', 'green'];

  return (
    <Flex direction="column" align="center" gap={0}>
      <Box
        bg="gray.800"
        borderRadius="3xl"
        p={8}
        boxShadow="2xl"
        borderWidth="4px"
        borderColor="gray.700"
        position="relative"
      >
        <VStack gap={4}>
          {displayOrder.map((color) => {
            const sequenceIndex = LIGHT_SEQUENCE.findIndex(l => l.color === color);
            const isActive = sequenceIndex !== -1 && currentState.index === sequenceIndex;
            
            return (
              <Light 
                key={color}
                color={color} 
                isActive={isActive} 
                label={color.charAt(0).toUpperCase() + color.slice(1)} 
              />
            );
          })}
        </VStack>
      </Box>
      
      {/* Base of the post */}
      <Box
        w="40px"
        h="200px"
        bg="gray.600"
        border="2px solid"
        borderColor="gray.700"
      />
      
      {/* Base */}
      <Box
        w="120px"
        h="40px"
        bg="gray.700"
        borderRadius="md"
        boxShadow="lg"
      />
    </Flex>
  );
}