import React from 'react'
import { Button } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import StopIcon from '@mui/icons-material/Stop'

export default function FloatingActionButton ({ snowRunning, onStart, onStop }) {
  return (
    <Button
      variant='contained'
      size='large'
      startIcon={snowRunning ? <StopIcon /> : <PlayArrowIcon />}
      onClick={snowRunning ? onStop : onStart}
      sx={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        minWidth: 180,
        height: 48,
        borderRadius: 6,
        fontWeight: 800,
        fontSize: '0.95rem',
        textTransform: 'none',
        boxShadow: snowRunning
          ? '0 8px 32px rgba(239, 68, 68, 0.35)'
          : '0 8px 32px rgba(59, 130, 246, 0.4)',
        bgcolor: snowRunning
          ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
          : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        '&:hover': {
          bgcolor: snowRunning
            ? 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)'
            : 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)'
        }
      }}
    >
      {snowRunning ? '停止飘落' : '开始飘落'}
    </Button>
  )
}
