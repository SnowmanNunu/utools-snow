import React from 'react'
import { Box, Paper, Typography, Button, Stack } from '@mui/material'
import { alpha } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'

export const STEPS = [
  { title: '选择图案', desc: '在「图案」区切换雪花、星星、灯笼等 15 种粒子' },
  { title: '调整效果', desc: '在「环境」里调节密度和风力，找到你喜欢的氛围' },
  { title: '点击开始', desc: '按右上角开始按钮让粒子铺满桌面' }
]

export default function OnboardingTooltip ({ step, onNext, onClose }) {
  if (step >= STEPS.length) return null
  const item = STEPS[step]

  return (
    <Paper
      elevation={0}
      className='onboarding-pulse'
      sx={function (theme) {
        return {
          position: 'fixed',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1300,
          minWidth: 280,
          p: 2,
          borderRadius: 3,
          bgcolor: alpha(theme.palette.background.paper, 0.95),
          border: '1px solid',
          borderColor: alpha(theme.palette.primary.main, 0.35),
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)'
        }
      }}
    >
      <Stack spacing={1}>
        <Stack direction='row' justifyContent='space-between' alignItems='center'>
          <Typography variant='subtitle2' fontWeight={800} color='primary.main'>
            步骤 {step + 1}/{STEPS.length}：{item.title}
          </Typography>
          <Box onClick={onClose} sx={{ cursor: 'pointer', color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
            <CloseIcon sx={{ fontSize: 18 }} />
          </Box>
        </Stack>
        <Typography variant='body2' color='text.secondary'>
          {item.desc}
        </Typography>
        <Stack direction='row' justifyContent='flex-end' spacing={1} mt={0.5}>
          <Button size='small' onClick={onClose} sx={{ color: 'text.secondary', textTransform: 'none' }}>
            跳过
          </Button>
          <Button
            size='small'
            variant='contained'
            endIcon={<NavigateNextIcon />}
            onClick={onNext}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            {step < STEPS.length - 1 ? '下一步' : '知道了'}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  )
}
