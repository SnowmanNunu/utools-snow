import React from 'react'
import { Box, Paper, Typography, Stack } from '@mui/material'
import { alpha } from '@mui/material/styles'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import FavoriteIcon from '@mui/icons-material/Favorite'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'
import NightlightIcon from '@mui/icons-material/Nightlight'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'
import CelebrationIcon from '@mui/icons-material/Celebration'

const THEME_OPTIONS = [
  { value: 'spring', label: '春节', icon: CardGiftcardIcon, color: '#ff4444', bg: 'linear-gradient(135deg, #ff4444 0%, #ff6b6b 100%)' },
  { value: 'christmas', label: '圣诞', icon: AcUnitIcon, color: '#4ade80', bg: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)' },
  { value: 'valentine', label: '情人节', icon: FavoriteIcon, color: '#f472b6', bg: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)' },
  { value: 'midAutumn', label: '中秋', icon: NightlightIcon, color: '#f5a623', bg: 'linear-gradient(135deg, #f5a623 0%, #ffd93d 100%)' },
  { value: 'halloween', label: '万圣节', icon: EmojiEmotionsIcon, color: '#ff7f00', bg: 'linear-gradient(135deg, #ff7f00 0%, #9c27b0 100%)' },
  { value: 'newYear', label: '元旦', icon: CelebrationIcon, color: '#e63946', bg: 'linear-gradient(135deg, #e63946 0%, #ffb703 100%)' }
]

export default function ThemePanel ({ festivalTheme, onThemeChange }) {
  return (
    <Stack spacing={0.65}>
      <Stack direction='row' alignItems='center' spacing={0.75}>
        <FavoriteIcon sx={{ fontSize: 18, color: 'error.main' }} />
        <Typography variant='body2' color='text.secondary' fontWeight={700}>
          节日主题
        </Typography>
      </Stack>

      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 0.65
      }}
      >
        {THEME_OPTIONS.map(function (item) {
          const Icon = item.icon
          const isActive = festivalTheme === item.value
          return (
            <Paper
              key={item.value}
              elevation={0}
              onClick={function () { onThemeChange(item.value) }}
              sx={function (theme) {
                return {
                  flex: '1 1 calc(33.333% - 0.45rem)',
                  minWidth: 80,
                  p: 0.65,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.65,
                  cursor: 'pointer',
                  position: 'relative',
                  boxSizing: 'border-box',
                  bgcolor: isActive
                    ? alpha(theme.palette.background.paper, 0.85)
                    : alpha(theme.palette.background.paper, 0.35),
                  border: '1.5px solid',
                  borderColor: isActive ? item.color : alpha(theme.palette.divider, 0.08),
                  boxShadow: isActive ? `0 0 12px ${item.color}40` : 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.background.paper, 0.6),
                    borderColor: item.color,
                    boxShadow: `0 3px 12px ${item.color}25`
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
                    color: item.color
                  }}
                />
              )}
              <Box
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: item.bg,
                  color: '#fff',
                  boxShadow: `0 2px 6px ${item.color}40`
                }}
              >
                <Icon sx={{ fontSize: 13 }} />
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
