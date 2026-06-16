import React from 'react'
import { Box, Paper, Typography, Stack, Switch, FormControlLabel } from '@mui/material'
import { alpha } from '@mui/material/styles'
import MouseIcon from '@mui/icons-material/Mouse'

export default function InteractionPanel ({
  interaction,
  burstOnClick,
  snowAccumulation,
  mouseVortex,
  onInteractionChange,
  onBurstChange,
  onSnowAccumulationChange,
  onMouseVortexChange
}) {
  return (
    <Stack spacing={0.65} sx={{ height: '100%' }}>
      <Stack direction='row' alignItems='center' spacing={0.75}>
        <MouseIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
        <Typography variant='body2' color='text.secondary' fontWeight={700}>
          交互
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
            alignItems: 'center',
            bgcolor: alpha(theme.palette.background.paper, 0.35),
            border: '1px solid',
            borderColor: alpha(theme.palette.divider, 0.08),
            boxSizing: 'border-box'
          }
        }}
      >
        <Box sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: 0.25
        }}
        >
          <FormControlLabel
            control={<Switch
              checked={interaction}
              onChange={onInteractionChange}
              size='small'
            />}
            label={<Typography variant='caption'>鼠标推开</Typography>}
          />
          <FormControlLabel
            control={<Switch
              checked={burstOnClick}
              onChange={onBurstChange}
              size='small'
            />}
            label={<Typography variant='caption'>点击绽放</Typography>}
          />
          <FormControlLabel
            control={<Switch
              checked={snowAccumulation}
              onChange={onSnowAccumulationChange}
              size='small'
            />}
            label={<Typography variant='caption'>积雪融化</Typography>}
          />
          <FormControlLabel
            control={<Switch
              checked={mouseVortex}
              onChange={onMouseVortexChange}
              size='small'
            />}
            label={<Typography variant='caption'>鼠标漩涡</Typography>}
          />
        </Box>
      </Paper>
    </Stack>
  )
}
