import React from 'react'
import { Stack, Box, Tooltip } from '@mui/material'
import { alpha } from '@mui/material/styles'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import SpeedIcon from '@mui/icons-material/Speed'
import FavoriteIcon from '@mui/icons-material/Favorite'
import MouseIcon from '@mui/icons-material/Mouse'

const NAV_ITEMS = [
  { key: 'pattern', label: '图案', icon: AutoAwesomeIcon },
  { key: 'environment', label: '环境', icon: SpeedIcon },
  { key: 'theme', label: '主题', icon: FavoriteIcon },
  { key: 'interaction', label: '交互', icon: MouseIcon }
]

export default function Sidebar ({ activeTab, onTabChange }) {
  return (
    <Stack
      spacing={1}
      sx={function (theme) {
        return {
          width: 64,
          p: 1,
          borderRadius: 3,
          bgcolor: alpha(theme.palette.background.paper, 0.4),
          border: '1px solid',
          borderColor: alpha(theme.palette.divider, 0.08)
        }
      }}
    >
      {NAV_ITEMS.map(function (item) {
        const Icon = item.icon
        const isActive = activeTab === item.key
        return (
          <Tooltip key={item.key} title={item.label} placement='right' arrow>
            <Box
              onClick={function () { onTabChange(item.key) }}
              sx={function (theme) {
                return {
                  width: 48,
                  height: 48,
                  borderRadius: 2.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  color: isActive ? 'primary.main' : 'text.secondary',
                  bgcolor: isActive ? alpha(theme.palette.primary.main, 0.15) : 'transparent',
                  border: '1px solid',
                  borderColor: isActive ? alpha(theme.palette.primary.main, 0.35) : 'transparent',
                  '&:hover': {
                    bgcolor: isActive ? alpha(theme.palette.primary.main, 0.2) : alpha(theme.palette.action.hover, 0.5),
                    color: isActive ? 'primary.main' : 'text.primary'
                  }
                }
              }}
            >
              <Icon sx={{ fontSize: 22 }} />
            </Box>
          </Tooltip>
        )
      })}
    </Stack>
  )
}
