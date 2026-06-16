import React, { useEffect, useState, useCallback, useRef } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Box, Stack } from '@mui/material'

import Header from './components/Header'
import PatternPanel from './components/PatternPanel'
import EnvironmentPanel from './components/EnvironmentPanel'
import ThemePanel from './components/ThemePanel'
import InteractionPanel from './components/InteractionPanel'
import OnboardingTooltip, { STEPS } from './components/OnboardingTooltip'

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

const THEME_MAP = {
  spring: { pattern: 'lantern', density: 180, wind: 0.4 },
  christmas: { pattern: 'snow', density: 160, wind: 0.7 },
  valentine: { pattern: 'heart', density: 150, wind: 0.3 },
  midAutumn: { pattern: 'star', density: 140, wind: 0.25 },
  halloween: { pattern: 'pumpkin', density: 160, wind: 0.6 },
  newYear: { pattern: 'packet', density: 170, wind: 0.5 }
}

const ONBOARDING_KEY = 'snow-onboarding-done'

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

  const [onboardingStep, setOnboardingStep] = useState(function () {
    try {
      return localStorage.getItem(ONBOARDING_KEY) ? STEPS.length : 0
    } catch (e) {
      return 0
    }
  })

  const configRef = useRef({ ...DEFAULT_CONFIG })
  const runningRef = useRef(false)

  const updateConfig = useCallback(function (updates) {
    configRef.current = { ...configRef.current, ...updates }
    if (window.services) {
      window.services.updateSnowConfig(updates)
    }
  }, [])

  function startSnow () {
    if (!window.services) return
    window.services.createSnowWindow(configRef.current)
    runningRef.current = true
    setSnowRunning(true)
  }

  function stopSnow () {
    if (!window.services) return
    window.services.closeSnowWindow()
    runningRef.current = false
    setSnowRunning(false)
  }

  function handleIntensityChange (newIntensity) {
    if (!newIntensity) return
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

  function handlePatternChange (newPattern) {
    if (!newPattern) return
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

  function handleFestivalThemeChange (newTheme) {
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
    updateConfig({ theme: newTheme, pattern: cfg.pattern, density: cfg.density, wind: cfg.wind, transition: true })
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

  function handleOnboardingNext () {
    const next = onboardingStep + 1
    if (next >= STEPS.length) {
      finishOnboarding()
    } else {
      setOnboardingStep(next)
    }
  }

  function handleOnboardingClose () {
    finishOnboarding()
  }

  function finishOnboarding () {
    try {
      localStorage.setItem(ONBOARDING_KEY, '1')
    } catch (e) {}
    setOnboardingStep(STEPS.length)
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
        p: 1.25,
        gap: 0.75,
        bgcolor: 'background.default'
      }}>
        <Header
          snowRunning={snowRunning}
          onStart={startSnow}
          onStop={stopSnow}
        />

        <Box sx={{
          flex: 1,
          overflow: 'hidden',
          minHeight: 0
        }}
        >
          <Stack spacing={0.75}>
            <PatternPanel
              pattern={pattern}
              festivalTheme={festivalTheme}
              onPatternChange={handlePatternChange}
            />
            <ThemePanel
              festivalTheme={festivalTheme}
              onThemeChange={handleFestivalThemeChange}
            />
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              alignItems: 'stretch',
              gap: 0.75
            }}
            >
              <EnvironmentPanel
                density={density}
                wind={wind}
                intensity={intensity}
                onDensityChange={handleDensityChange}
                onWindChange={handleWindChange}
                onIntensityChange={handleIntensityChange}
              />
              <InteractionPanel
                interaction={interaction}
                burstOnClick={burstOnClick}
                snowAccumulation={snowAccumulation}
                mouseVortex={mouseVortex}
                onInteractionChange={handleInteractionChange}
                onBurstChange={handleBurstChange}
                onSnowAccumulationChange={handleSnowAccumulationChange}
                onMouseVortexChange={handleMouseVortexChange}
              />
            </Box>
          </Stack>
        </Box>

        {onboardingStep < STEPS.length && (
          <OnboardingTooltip
            step={onboardingStep}
            onNext={handleOnboardingNext}
            onClose={handleOnboardingClose}
          />
        )}
      </Box>
    </ThemeProvider>
  )
}
