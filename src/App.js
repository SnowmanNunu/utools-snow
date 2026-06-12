import React, { useEffect, useState, useCallback, useRef } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import {
  Box, Typography, Button, Slider, Stack, Paper,
  ToggleButtonGroup, ToggleButton, Switch, FormControlLabel
} from '@mui/material'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import FavoriteIcon from '@mui/icons-material/Favorite'
import LocalFloristIcon from '@mui/icons-material/LocalFlorist'
import BubbleChartIcon from '@mui/icons-material/BubbleChart'
import ParkIcon from '@mui/icons-material/Park'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import SpaIcon from '@mui/icons-material/Spa'
import PaletteIcon from '@mui/icons-material/Palette'
import TextFieldsIcon from '@mui/icons-material/TextFields'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import FlareIcon from '@mui/icons-material/Flare'
import WbIncandescentIcon from '@mui/icons-material/WbIncandescent'
import WindPowerIcon from '@mui/icons-material/WindPower'
import AirIcon from '@mui/icons-material/Air'
import SpeedIcon from '@mui/icons-material/Speed'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import StopIcon from '@mui/icons-material/Stop'
import MouseIcon from '@mui/icons-material/Mouse'

const THEME_DIC = {
  light: createTheme({
    palette: {
      mode: 'light',
      primary: { main: '#2f5f8f' },
      secondary: { main: '#e989b6' },
      background: { default: '#f6fbff' }
    },
    shape: { borderRadius: 8 },
    typography: { fontFamily: 'system-ui' }
  }),
  dark: createTheme({
    palette: {
      mode: 'dark',
      primary: { main: '#9bd7ff' },
      secondary: { main: '#ffb1d1' },
      background: { default: '#20252b' }
    },
    shape: { borderRadius: 8 },
    typography: { fontFamily: 'system-ui' }
  })
}

const DEFAULT_CONFIG = {
  density: 150,
  wind: 0.5,
  pattern: 'snow',
  minSize: 2,
  maxSize: 6,
  minSpeed: 0.3,
  maxSpeed: 1.8,
  swayAmount: 0.8,
  opacityMin: 0.3,
  opacityMax: 0.9,
  burstOnClick: true,
  interaction: true,
  snowAccumulation: true,
  mouseVortex: true
}

const INTENSITY_MAP = {
  light: { density: 80, opacityMin: 0.16, opacityMax: 0.56 },
  normal: { density: 150, opacityMin: 0.3, opacityMax: 0.9 },
  heavy: { density: 280, opacityMin: 0.5, opacityMax: 1 }
}

const PATTERN_OPTIONS = [
  { value: 'snow', label: '雪花', icon: <AcUnitIcon fontSize='small' /> },
  { value: 'star', label: '星星', icon: <AutoAwesomeIcon fontSize='small' /> },
  { value: 'heart', label: '爱心', icon: <FavoriteIcon fontSize='small' /> },
  { value: 'petal', label: '花瓣', icon: <LocalFloristIcon fontSize='small' /> },
  { value: 'bubble', label: '泡泡', icon: <BubbleChartIcon fontSize='small' /> },
  { value: 'maple', label: '枫叶', icon: <ParkIcon fontSize='small' /> },
  { value: 'note', label: '音符', icon: <MusicNoteIcon fontSize='small' /> },
  { value: 'packet', label: '红包', icon: <CardGiftcardIcon fontSize='small' /> },
  { value: 'butterfly', label: '蝴蝶', icon: <PaletteIcon fontSize='small' /> },
  { value: 'text', label: '福字', icon: <TextFieldsIcon fontSize='small' /> },
  { value: 'rain', label: '雨滴', icon: <WaterDropIcon fontSize='small' /> },
  { value: 'gold', label: '金元宝', icon: <MonetizationOnIcon fontSize='small' /> },
  { value: 'firefly', label: '萤火虫', icon: <FlareIcon fontSize='small' /> },
  { value: 'lantern', label: '灯笼', icon: <WbIncandescentIcon fontSize='small' /> },
  { value: 'dandelion', label: '蒲公英', icon: <SpaIcon fontSize='small' /> }
]

const THEME_OPTIONS = [
  { value: 'spring', label: '春节', icon: <CardGiftcardIcon fontSize='small' /> },
  { value: 'christmas', label: '圣诞', icon: <AcUnitIcon fontSize='small' /> },
  { value: 'valentine', label: '情人节', icon: <FavoriteIcon fontSize='small' /> }
]

const THEME_MAP = {
  spring: { pattern: 'lantern', density: 180, wind: 0.4 },
  christmas: { pattern: 'snow', density: 160, wind: 0.7 },
  valentine: { pattern: 'heart', density: 150, wind: 0.3 }
}

export default function App () {
  const [theme, setTheme] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  )
  const [snowRunning, setSnowRunning] = useState(false)
  const [density, setDensity] = useState(DEFAULT_CONFIG.density)
  const [wind, setWind] = useState(DEFAULT_CONFIG.wind)
  const [pattern, setPattern] = useState(DEFAULT_CONFIG.pattern)
  const [intensity, setIntensity] = useState('normal')
  const [interaction, setInteraction] = useState(DEFAULT_CONFIG.interaction)
  const [burstOnClick, setBurstOnClick] = useState(DEFAULT_CONFIG.burstOnClick)
  const [festivalTheme, setFestivalTheme] = useState(null)
  const [snowAccumulation, setSnowAccumulation] = useState(DEFAULT_CONFIG.snowAccumulation)
  const [mouseVortex, setMouseVortex] = useState(DEFAULT_CONFIG.mouseVortex)

  const configRef = useRef({ ...DEFAULT_CONFIG })
  const runningRef = useRef(false)

  const updateConfig = useCallback(function (updates) {
    configRef.current = { ...configRef.current, ...updates }
    if (window.services) {
      window.services.updateSnowConfig(updates)
    }
  }, [])

  const startSnow = useCallback(function () {
    if (window.services) {
      window.services.createSnowWindow(configRef.current)
      runningRef.current = true
      setSnowRunning(true)
    }
  }, [])

  const stopSnow = useCallback(function () {
    if (window.services) {
      window.services.closeSnowWindow()
      runningRef.current = false
      setSnowRunning(false)
    }
  }, [])

  function handleIntensityChange (event, newIntensity) {
    if (newIntensity === null) return
    setIntensity(newIntensity)
    const cfg = INTENSITY_MAP[newIntensity]
    setDensity(cfg.density)
    updateConfig(cfg)
  }

  function handleDensityChange (event, value) {
    setDensity(value)
    updateConfig({ density: value })
  }

  function handleWindChange (event, value) {
    setWind(value)
    updateConfig({ wind: value })
  }

  function handlePatternChange (event, newPattern) {
    if (newPattern === null || newPattern === undefined) return
    setPattern(newPattern)
    if (festivalTheme) {
      setFestivalTheme(null)
      updateConfig({ pattern: newPattern, theme: null })
    } else {
      updateConfig({ pattern: newPattern })
    }
  }

  function handleInteractionChange (event) {
    const checked = event.target.checked
    setInteraction(checked)
    updateConfig({ interaction: checked })
  }

  function handleBurstChange (event) {
    const checked = event.target.checked
    setBurstOnClick(checked)
    updateConfig({ burstOnClick: checked })
  }

  function handleFestivalThemeChange (event, newTheme) {
    if (!newTheme || newTheme === festivalTheme) {
      setFestivalTheme(null)
      updateConfig({ theme: null })
      return
    }
    const cfg = THEME_MAP[newTheme]
    if (!cfg) return
    setFestivalTheme(newTheme)
    setPattern(cfg.pattern)
    setDensity(cfg.density)
    setWind(cfg.wind)
    updateConfig({ theme: newTheme, pattern: cfg.pattern, density: cfg.density, wind: cfg.wind })
  }

  function handleSnowAccumulationChange (event) {
    const checked = event.target.checked
    setSnowAccumulation(checked)
    updateConfig({ snowAccumulation: checked })
  }

  function handleMouseVortexChange (event) {
    const checked = event.target.checked
    setMouseVortex(checked)
    updateConfig({ mouseVortex: checked })
  }

  useEffect(function () {
    if (window.utools) {
      window.utools.onPluginEnter(function () {
        if (!runningRef.current) {
          if (window.services && window.services.isSnowRunning) {
            const running = window.services.isSnowRunning()
            if (!running) window.services.createSnowWindow(configRef.current)
            runningRef.current = true
            setSnowRunning(true)
          }
        }
      })

      window.utools.onPluginOut(function (isKill) {
        if (isKill && window.services) {
          window.services.closeSnowWindow()
          runningRef.current = false
          setSnowRunning(false)
        }
      })
    }

    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleThemeChange = function (e) {
      setTheme(e.matches ? 'dark' : 'light')
    }
    darkModeQuery.addEventListener('change', handleThemeChange)
    return function () {
      darkModeQuery.removeEventListener('change', handleThemeChange)
    }
  }, [])

  return (
    <ThemeProvider theme={THEME_DIC[theme]}>
      <Box sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        p: 2,
        gap: 1.5,
        bgcolor: 'background.default'
      }}>
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: 3,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider'
          }}
        >
          <Stack direction='row' alignItems='center' spacing={1.25}>
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'primary.main',
              color: '#fff'
            }}>
              <AcUnitIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant='h6' fontWeight={800} lineHeight={1.1}>
                满屏飘落
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                唯美治愈桌面粒子
              </Typography>
            </Box>
          </Stack>
          <Button
            variant={snowRunning ? 'outlined' : 'contained'}
            color={snowRunning ? 'error' : 'primary'}
            size='small'
            startIcon={snowRunning ? <StopIcon /> : <PlayArrowIcon />}
            onClick={snowRunning ? stopSnow : startSnow}
            sx={{
              minWidth: 110,
              fontWeight: 700,
              borderRadius: 2,
              px: 1.5
            }}
          >
            {snowRunning ? '停止' : '开始'}
          </Button>
        </Paper>

        {/* 图案选择 */}
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            borderRadius: 3,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider'
          }}
        >
          <Stack direction='row' alignItems='center' spacing={1} mb={1}>
            <AutoAwesomeIcon fontSize='small' color='primary' />
            <Typography variant='body2' color='text.secondary' fontWeight={700}>
              飘落图案
            </Typography>
          </Stack>
          <ToggleButtonGroup
            value={pattern}
            exclusive
            onChange={handlePatternChange}
            size='small'
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: 0.6,
              '& .MuiToggleButtonGroup-grouped': {
                border: 1,
                borderColor: 'divider',
                borderRadius: 2,
                mx: '0 !important',
                py: 0.6,
                flexDirection: 'column',
                gap: 0.25
              }
            }}
          >
            {PATTERN_OPTIONS.map(function (item) {
              return (
                <ToggleButton
                  key={item.value}
                  value={item.value}
                  sx={{
                    fontSize: '0.7rem',
                    lineHeight: 1.1,
                    '& .MuiSvgIcon-root': { fontSize: '1.1rem' }
                  }}
                >
                  {item.icon}
                  {item.label}
                </ToggleButton>
              )
            })}
          </ToggleButtonGroup>
        </Paper>

        {/* 节日主题 */}
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            borderRadius: 3,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider'
          }}
        >
          <Stack direction='row' alignItems='center' spacing={1} mb={1}>
            <FavoriteIcon fontSize='small' color='error' />
            <Typography variant='body2' color='text.secondary' fontWeight={700}>
              节日主题
            </Typography>
          </Stack>
          <ToggleButtonGroup
            value={festivalTheme}
            exclusive
            onChange={handleFestivalThemeChange}
            size='small'
            fullWidth
            sx={{
              '& .MuiToggleButtonGroup-grouped': {
                border: 1,
                borderColor: 'divider',
                borderRadius: 2,
                mx: '0 !important'
              }
            }}
          >
            {THEME_OPTIONS.map(function (item) {
              return (
                <ToggleButton key={item.value} value={item.value} sx={{ gap: 0.5 }}>
                  {item.icon}
                  {item.label}
                </ToggleButton>
              )
            })}
          </ToggleButtonGroup>
        </Paper>

        {/* 环境设置 */}
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            borderRadius: 3,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider'
          }}
        >
          <Stack direction='row' alignItems='center' spacing={1} mb={1}>
            <SpeedIcon fontSize='small' color='success' />
            <Typography variant='body2' color='text.secondary' fontWeight={700}>
              环境
            </Typography>
          </Stack>

          <Stack spacing={1.25}>
            <Box>
              <Stack direction='row' justifyContent='space-between' alignItems='center' mb={0.5}>
                <Typography variant='caption' color='text.secondary' fontWeight={600}>
                  密度
                </Typography>
                <Typography variant='caption' color='primary' fontWeight={700}>
                  {density} 片
                </Typography>
              </Stack>
              <ToggleButtonGroup
                value={intensity}
                exclusive
                onChange={handleIntensityChange}
                size='small'
                fullWidth
                sx={{ mb: 0.75 }}
              >
                <ToggleButton value='light'>小雪</ToggleButton>
                <ToggleButton value='normal'>中雪</ToggleButton>
                <ToggleButton value='heavy'>大雪</ToggleButton>
              </ToggleButtonGroup>
              <Slider
                value={density}
                onChange={handleDensityChange}
                min={30}
                max={380}
                step={10}
                size='small'
              />
            </Box>

            <Box>
              <Stack direction='row' justifyContent='space-between' alignItems='center' mb={0.5}>
                <Typography variant='caption' color='text.secondary' fontWeight={600}>
                  风力
                </Typography>
                <Typography variant='caption' color='primary' fontWeight={700}>
                  {wind.toFixed(1)}
                </Typography>
              </Stack>
              <Stack direction='row' spacing={1} alignItems='center'>
                <AirIcon fontSize='small' color='disabled' />
                <Slider
                  value={wind}
                  onChange={handleWindChange}
                  min={0}
                  max={3}
                  step={0.1}
                  size='small'
                />
                <WindPowerIcon fontSize='small' color='disabled' />
              </Stack>
            </Box>
          </Stack>
        </Paper>

        {/* 交互开关 */}
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            borderRadius: 3,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider'
          }}
        >
          <Stack direction='row' alignItems='center' spacing={1} mb={1}>
            <MouseIcon fontSize='small' color='secondary' />
            <Typography variant='body2' color='text.secondary' fontWeight={700}>
              交互
            </Typography>
          </Stack>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 0.5
          }}
          >
            <FormControlLabel
              control={<Switch
                checked={interaction}
                onChange={handleInteractionChange}
                size='small'
              />}
              label={<Typography variant='caption'>鼠标推开</Typography>}
            />
            <FormControlLabel
              control={<Switch
                checked={burstOnClick}
                onChange={handleBurstChange}
                size='small'
              />}
              label={<Typography variant='caption'>点击绽放</Typography>}
            />
            <FormControlLabel
              control={<Switch
                checked={snowAccumulation}
                onChange={handleSnowAccumulationChange}
                size='small'
              />}
              label={<Typography variant='caption'>积雪融化</Typography>}
            />
            <FormControlLabel
              control={<Switch
                checked={mouseVortex}
                onChange={handleMouseVortexChange}
                size='small'
              />}
              label={<Typography variant='caption'>鼠标漩涡</Typography>}
            />
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  )
}
