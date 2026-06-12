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
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'
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
  interaction: true
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
  const [audioReactive, setAudioReactive] = useState(false)

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

  function handleAudioReactiveChange (event) {
    const checked = event.target.checked
    setAudioReactive(checked)
    updateConfig({ audioReactive: checked })
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
        p: 2.25,
        gap: 1.75,
        bgcolor: 'background.default'
      }}>
        <Stack direction='row' alignItems='center' spacing={1.25}>
          <AcUnitIcon sx={{ fontSize: 30, color: 'primary.main' }} />
          <Box>
            <Typography variant='h6' fontWeight={800} lineHeight={1.1}>
              满屏飘落
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              唯美治愈桌面粒子
            </Typography>
          </Box>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 1,
            borderColor: 'divider',
            bgcolor: snowRunning ? 'action.hover' : 'primary.main'
          }}
        >
          <Button
            variant={snowRunning ? 'outlined' : 'contained'}
            color={snowRunning ? 'error' : 'inherit'}
            size='large'
            startIcon={snowRunning ? <StopIcon /> : <PlayArrowIcon />}
            onClick={snowRunning ? stopSnow : startSnow}
            sx={{
              minWidth: 180,
              fontSize: 15,
              fontWeight: 700,
              py: 0.9,
              ...(snowRunning ? {} : { color: '#fff', bgcolor: 'primary.dark' })
            }}
          >
            {snowRunning ? '停止飘落' : '开始飘落'}
          </Button>
        </Paper>

        <Box>
          <Stack direction='row' alignItems='center' spacing={1} mb={0.75}>
            <AutoAwesomeIcon fontSize='small' color='action' />
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
              gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
              gap: 0.75,
              '& .MuiToggleButtonGroup-grouped': {
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                mx: '0 !important'
              }
            }}
          >
            {PATTERN_OPTIONS.map(function (item) {
              return (
                <ToggleButton key={item.value} value={item.value} sx={{ gap: 0.5, px: 0.75 }}>
                  {item.icon}
                  {item.label}
                </ToggleButton>
              )
            })}
          </ToggleButtonGroup>
        </Box>

        <Box>
          <Stack direction='row' alignItems='center' spacing={1} mb={0.75}>
            <AutoAwesomeIcon fontSize='small' color='action' />
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
          >
            {THEME_OPTIONS.map(function (item) {
              return (
                <ToggleButton key={item.value} value={item.value} sx={{ gap: 0.5, px: 0.75 }}>
                  {item.icon}
                  {item.label}
                </ToggleButton>
              )
            })}
          </ToggleButtonGroup>
        </Box>

        <Box>
          <Stack direction='row' alignItems='center' spacing={1} mb={0.5}>
            <SpeedIcon fontSize='small' color='action' />
            <Typography variant='body2' color='text.secondary' fontWeight={700}>
              密度
            </Typography>
          </Stack>
          <ToggleButtonGroup
            value={intensity}
            exclusive
            onChange={handleIntensityChange}
            size='small'
            fullWidth
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
            sx={{ mt: 1 }}
          />
          <Typography variant='caption' color='text.secondary'>
            {density} 片
          </Typography>
        </Box>

        <Box>
          <Stack direction='row' alignItems='center' spacing={1} mb={0.5}>
            <WindPowerIcon fontSize='small' color='action' />
            <Typography variant='body2' color='text.secondary' fontWeight={700}>
              风力
            </Typography>
          </Stack>
          <Stack direction='row' spacing={1.5} alignItems='center'>
            <AirIcon fontSize='small' color='disabled' />
            <Slider
              value={wind}
              onChange={handleWindChange}
              min={0}
              max={3}
              step={0.1}
              size='small'
            />
            <Typography variant='body2' color='text.secondary' sx={{ minWidth: 32 }}>
              {wind.toFixed(1)}
            </Typography>
          </Stack>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 1.25,
            border: 1,
            borderColor: 'divider',
            bgcolor: 'action.hover'
          }}
        >
          <Stack spacing={0.25}>
            <FormControlLabel
              control={<Switch checked={interaction} onChange={handleInteractionChange} size='small' />}
              label={
                <Stack direction='row' spacing={0.75} alignItems='center'>
                  <MouseIcon fontSize='small' />
                  <Typography variant='body2'>鼠标推开</Typography>
                </Stack>
              }
            />
            <FormControlLabel
              control={<Switch checked={burstOnClick} onChange={handleBurstChange} size='small' />}
              label={
                <Stack direction='row' spacing={0.75} alignItems='center'>
                  <AutoAwesomeIcon fontSize='small' />
                  <Typography variant='body2'>点击绽放</Typography>
                </Stack>
              }
            />
            <FormControlLabel
              control={<Switch checked={audioReactive} onChange={handleAudioReactiveChange} size='small' />}
              label={
                <Stack direction='row' spacing={0.75} alignItems='center'>
                  {audioReactive ? <VolumeUpIcon fontSize='small' /> : <VolumeOffIcon fontSize='small' />}
                  <Typography variant='body2'>音效联动</Typography>
                </Stack>
              }
            />
          </Stack>
        </Paper>
      </Box>
    </ThemeProvider>
  )
}
