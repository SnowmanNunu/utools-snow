import React from 'react'
import { Box, Paper, Typography, Stack } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import PatternIcon from './PatternIcon'

const PATTERN_OPTIONS = [
  { value: 'snow', label: '雪花' },
  { value: 'star', label: '星星' },
  { value: 'heart', label: '爱心' },
  { value: 'petal', label: '花瓣' },
  { value: 'bubble', label: '泡泡' },
  { value: 'maple', label: '枫叶' },
  { value: 'note', label: '音符' },
  { value: 'packet', label: '红包' },
  { value: 'butterfly', label: '蝴蝶' },
  { value: 'text', label: '福字' },
  { value: 'rain', label: '雨滴' },
  { value: 'gold', label: '金元宝' },
  { value: 'firefly', label: '萤火虫' },
  { value: 'lantern', label: '灯笼' },
  { value: 'dandelion', label: '蒲公英' }
]

const PATTERN_COLORS = {
  snow: '#ffffff',
  star: '#ffe98a',
  heart: '#ff7aa8',
  petal: '#ffc0d8',
  bubble: '#c8eaff',
  maple: '#ff7f50',
  note: '#ffd700',
  packet: '#ff4444',
  butterfly: '#ff9ff3',
  text: '#ffd700',
  rain: '#a0d2f5',
  gold: '#ffd700',
  firefly: '#ccff00',
  lantern: '#ff3333',
  dandelion: '#ffffff'
}

function resolvePatternColor (color, theme) {
  if (color.toLowerCase() === '#ffffff' && theme.palette.mode === 'light') {
    return theme.palette.text.primary
  }
  return color
}

export default function PatternPanel ({ pattern, festivalTheme, onPatternChange }) {
  const theme = useTheme()

  return (
    <Stack spacing={0.65}>
      <Stack direction='row' alignItems='center' spacing={0.75}>
        <AutoAwesomeIcon sx={{ fontSize: 18, color: 'primary.main' }} />
        <Typography variant='body2' color='text.secondary' fontWeight={700}>
          飘落图案
        </Typography>
      </Stack>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
        gap: 0.65
      }}
      >
        {PATTERN_OPTIONS.map(function (item) {
          const isActive = pattern === item.value && !festivalTheme
          const rawColor = PATTERN_COLORS[item.value]
          const color = resolvePatternColor(rawColor, theme)
          return (
            <Paper
              key={item.value}
              elevation={0}
              onClick={function () { onPatternChange(item.value) }}
              sx={function (t) {
                return {
                  p: 0.65,
                  borderRadius: 2,
                  textAlign: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  boxSizing: 'border-box',
                  bgcolor: isActive
                    ? alpha(t.palette.primary.main, 0.08)
                    : alpha(t.palette.background.paper, 0.35),
                  border: '1.5px solid',
                  borderColor: isActive ? 'primary.main' : alpha(t.palette.divider, 0.08),
                  boxShadow: isActive
                    ? `0 0 0 1px ${alpha(t.palette.primary.main, 0.45)}, 0 4px 14px ${alpha(t.palette.primary.main, 0.22)}`
                    : 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: isActive
                      ? alpha(t.palette.primary.main, 0.12)
                      : alpha(t.palette.background.paper, 0.6),
                    transform: 'translateY(-1px)',
                    borderColor: 'primary.main',
                    boxShadow: `0 3px 12px ${alpha(t.palette.primary.main, 0.2)}`
                  }
                }
              }}
            >
              {isActive && (
                <CheckCircleIcon
                  sx={{
                    position: 'absolute',
                    top: 3,
                    right: 3,
                    fontSize: 11,
                    color: 'primary.main'
                  }}
                />
              )}
              <Box
                className='particle-hint'
                sx={{
                  width: 26,
                  height: 26,
                  mx: 'auto',
                  mb: 0.2,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: alpha(color, isActive ? 0.22 : 0.15),
                  color: color
                }}
              >
                <PatternIcon pattern={item.value} sx={{ fontSize: 16 }} />
              </Box>
              <Typography variant='caption' fontWeight={isActive ? 700 : 500} color='text.primary'>
                {item.label}
              </Typography>
            </Paper>
          )
        })}
      </Box>
    </Stack>
  )
}
