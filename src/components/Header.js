import React from 'react'
import { Box, Typography, Stack, Paper, Button } from '@mui/material'
import { alpha } from '@mui/material/styles'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import StopIcon from '@mui/icons-material/Stop'

export default function Header ({ snowRunning, onStart, onStop }) {
  return (
    <Paper
      elevation={0}
      sx={function (theme) {
        return {
          p: 1.25,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: 2.5,
          bgcolor: alpha(theme.palette.background.paper, 0.5),
          border: '1px solid',
          borderColor: alpha(theme.palette.divider, 0.08),
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)'
        }
      }}
    >
      <Stack direction='row' alignItems='center' spacing={1.25}>
        <Box sx={function (theme) {
          return {
            width: 36,
            height: 36,
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'primary.main',
            color: '#fff',
            boxShadow: `0 0 12px ${alpha(theme.palette.primary.main, 0.35)}`
          }
        }}
        >
          <AcUnitIcon sx={{ fontSize: 20 }} />
        </Box>
        <Box>
          <Typography variant='subtitle1' fontWeight={800} lineHeight={1.1} color='text.primary'>
            满屏飘落
          </Typography>
          <Typography variant='caption' color='text.secondary'>
            唯美治愈桌面粒子
          </Typography>
        </Box>
      </Stack>

      <Button
        variant='contained'
        size='small'
        startIcon={snowRunning ? <StopIcon sx={{ fontSize: 18 }} /> : <PlayArrowIcon sx={{ fontSize: 18 }} />}
        onClick={snowRunning ? onStop : onStart}
        color={snowRunning ? 'error' : 'primary'}
        sx={{
          minWidth: 90,
          fontWeight: 700,
          borderRadius: 2,
          px: 1.5,
          py: 0.65,
          fontSize: '0.85rem',
          boxShadow: 'none'
        }}
      >
        {snowRunning ? '停止' : '开始'}
      </Button>
    </Paper>
  )
}
