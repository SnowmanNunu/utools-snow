import React from 'react'
import { Box, Paper, Typography, Stack, Slider, ToggleButtonGroup, ToggleButton } from '@mui/material'
import { alpha } from '@mui/material/styles'
import SpeedIcon from '@mui/icons-material/Speed'
import AirIcon from '@mui/icons-material/Air'
import WindPowerIcon from '@mui/icons-material/WindPower'

const INTENSITY_MAP = {
  light: { density: 80, opacityMin: 0.16, opacityMax: 0.56 },
  normal: { density: 150, opacityMin: 0.3, opacityMax: 0.9 },
  heavy: { density: 280, opacityMin: 0.5, opacityMax: 1 }
}

function getIntensityByDensity (density) {
  if (density <= 100) return 'light'
  if (density >= 220) return 'heavy'
  return 'normal'
}

export default function EnvironmentPanel ({
  density,
  wind,
  intensity,
  onDensityChange,
  onWindChange,
  onIntensityChange
}) {
  const derivedIntensity = intensity || getIntensityByDensity(density)

  return (
    <Stack spacing={0.65} sx={{ height: '100%' }}>
      <Stack direction='row' alignItems='center' spacing={0.75}>
        <SpeedIcon sx={{ fontSize: 18, color: 'primary.main' }} />
        <Typography variant='body2' color='text.secondary' fontWeight={700}>
          环境
        </Typography>
      </Stack>

      <Paper
        elevation={0}
        sx={function (theme) {
          return {
            flex: 1,
            p: 1.25,
            borderRadius: 2.5,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            bgcolor: alpha(theme.palette.background.paper, 0.35),
            border: '1px solid',
            borderColor: alpha(theme.palette.divider, 0.08),
            boxSizing: 'border-box'
          }
        }}
      >
        <Box>
          <Stack direction='row' justifyContent='space-between' alignItems='center' mb={0.5}>
            <Typography variant='body2' fontWeight={600} color='text.primary'>
              密度
            </Typography>
            <Typography variant='body2' fontWeight={800} color='primary.main'>
              {density} 片
            </Typography>
          </Stack>
          <ToggleButtonGroup
            value={derivedIntensity}
            exclusive
            onChange={function (e, value) { if (value) onIntensityChange(value) }}
            size='small'
            fullWidth
            sx={{
              mb: 0.75,
              '& .MuiToggleButtonGroup-grouped': {
                border: '1px solid',
                borderColor: 'divider',
                color: 'text.secondary',
                textTransform: 'none',
                fontWeight: 600,
                py: 0.3,
                '&.Mui-selected': {
                  bgcolor: 'action.selected',
                  color: 'primary.main',
                  borderColor: 'primary.main'
                },
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }
            }}
          >
            <ToggleButton value='light'>小雪</ToggleButton>
            <ToggleButton value='normal'>中雪</ToggleButton>
            <ToggleButton value='heavy'>大雪</ToggleButton>
          </ToggleButtonGroup>
          <Slider
            value={density}
            onChange={onDensityChange}
            min={30}
            max={380}
            step={10}
            size='small'
            sx={function (theme) {
              return {
                color: 'primary.main',
                '& .MuiSlider-thumb': {
                  width: 12,
                  height: 12,
                  boxShadow: `0 0 8px ${alpha(theme.palette.primary.main, 0.5)}`
                }
              }
            }}
          />
        </Box>

        <Box>
          <Stack direction='row' justifyContent='space-between' alignItems='center' mb={0.5}>
            <Typography variant='body2' fontWeight={600} color='text.primary'>
              风力
            </Typography>
            <Typography variant='body2' fontWeight={800} color='primary.main'>
              {wind.toFixed(1)}
            </Typography>
          </Stack>
          <Stack direction='row' spacing={1} alignItems='center'>
            <AirIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
            <Slider
              value={wind}
              onChange={onWindChange}
              min={0}
              max={3}
              step={0.1}
              size='small'
              sx={function (theme) {
                return {
                  color: 'primary.main',
                  '& .MuiSlider-thumb': {
                    width: 12,
                    height: 12,
                    boxShadow: `0 0 8px ${alpha(theme.palette.primary.main, 0.5)}`
                  }
                }
              }}
            />
            <WindPowerIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
          </Stack>
        </Box>
      </Paper>
    </Stack>
  )
}
