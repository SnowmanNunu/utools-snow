import React from 'react'
import { SvgIcon } from '@mui/material'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import FavoriteIcon from '@mui/icons-material/Favorite'
import LocalFloristIcon from '@mui/icons-material/LocalFlorist'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import FlareIcon from '@mui/icons-material/Flare'

function BubbleIcon (props) {
  return (
    <SvgIcon {...props} viewBox='0 0 24 24'>
      <circle cx='12' cy='12' r='9' fill='currentColor' opacity='0.35' />
      <circle cx='12' cy='12' r='9' fill='none' stroke='currentColor' strokeWidth='1.2' />
      <circle cx='9' cy='9' r='2.5' fill='#fff' opacity='0.7' />
    </SvgIcon>
  )
}

function MapleIcon (props) {
  return (
    <SvgIcon {...props} viewBox='0 0 24 24'>
      <path
        d='M12 2l1.8 4.2h4.2l-3 3.2 1.4 4.6-4.4-2.4-4.4 2.4 1.4-4.6-3-3.2h4.2z'
        fill='currentColor'
      />
      <path d='M12 13.6v7' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' />
    </SvgIcon>
  )
}

function PacketIcon (props) {
  return (
    <SvgIcon {...props} viewBox='0 0 24 24'>
      <rect x='3' y='6' width='18' height='12' rx='2' fill='currentColor' />
      <circle cx='12' cy='12' r='3' fill='#ffd700' />
      <path d='M3 10l9-4 9 4' fill='none' stroke='rgba(0,0,0,0.15)' strokeWidth='1' />
    </SvgIcon>
  )
}

function ButterflyIcon (props) {
  return (
    <SvgIcon {...props} viewBox='0 0 24 24'>
      <path
        d='M12 4c-1.5 0-3 1.5-3 3.5 0 .5.1 1 .3 1.4-1.8-.8-4.3-.2-4.3 2.1 0 1.8 1.5 3 3 3.5-1.2.8-2 2-2 3.5 0 2.5 2.5 3.5 4 2.5.8 1.5 2.5 2 4 1 .5 1.2 1.8 2 3 2 2 0 3.5-1.5 3.5-3.5 0-1.5-.8-2.7-2-3.5 1.5-.5 3-1.7 3-3.5 0-2.3-2.5-2.9-4.3-2.1.2-.4.3-.9.3-1.4 0-2-1.5-3.5-3-3.5z'
        fill='currentColor'
      />
      <path d='M12 7v10' stroke='rgba(0,0,0,0.25)' strokeWidth='1.2' strokeLinecap='round' />
    </SvgIcon>
  )
}

function FuIcon (props) {
  return (
    <SvgIcon {...props} viewBox='0 0 24 24'>
      <text
        x='12'
        y='17.5'
        textAnchor='middle'
        fontSize='16'
        fontWeight='bold'
        fill='currentColor'
        fontFamily='system-ui, sans-serif'
      >
        福
      </text>
    </SvgIcon>
  )
}

function PumpkinIcon (props) {
  return (
    <SvgIcon {...props} viewBox='0 0 24 24'>
      <ellipse cx='12' cy='14' rx='8' ry='8' fill='currentColor' />
      <ellipse cx='8.5' cy='14' rx='4' ry='7.5' fill='currentColor' />
      <ellipse cx='15.5' cy='14' rx='4' ry='7.5' fill='currentColor' />
      <path d='M12 6.5v-3' stroke='#5a8a3a' strokeWidth='2.2' strokeLinecap='round' />
      <polygon points='9.5,10.5 10.8,12.5 8.2,12.5' fill='rgba(60,25,0,0.9)' />
      <polygon points='14.5,10.5 15.8,12.5 13.2,12.5' fill='rgba(60,25,0,0.9)' />
      <path d='M8 15.5l1.5 1.5 1.5-1.5 1.5 1.5 1.5-1.5 1.5 1.5V17c0 .5-.5 1-1 1H9c-.5 0-1-.5-1-1v-1.5z' fill='rgba(60,25,0,0.9)' />
      <ellipse cx='9.5' cy='11' rx='1.2' ry='0.8' fill='rgba(255,255,200,0.5)' />
    </SvgIcon>
  )
}

function LanternIcon (props) {
  return (
    <SvgIcon {...props} viewBox='0 0 24 24'>
      <rect x='8' y='5' width='8' height='12' rx='3' fill='currentColor' />
      <rect x='7' y='4' width='10' height='2' rx='1' fill='currentColor' />
      <rect x='7' y='16' width='10' height='2' rx='1' fill='currentColor' />
      <path d='M12 18v4M10 22h4' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
      <circle cx='12' cy='11' r='2.5' fill='#ffd700' opacity='0.9' />
    </SvgIcon>
  )
}

function DandelionIcon (props) {
  return (
    <SvgIcon {...props} viewBox='0 0 24 24'>
      <circle cx='12' cy='17' r='2' fill='currentColor' />
      <g stroke='currentColor' strokeWidth='0.9' strokeLinecap='round' opacity='0.85'>
        <path d='M12 17l-5-9' />
        <path d='M12 17l-3-10' />
        <path d='M12 17l0-11' />
        <path d='M12 17l3-10' />
        <path d='M12 17l5-9' />
        <path d='M12 17l-6-6' />
        <path d='M12 17l6-6' />
      </g>
      <circle cx='12' cy='6.5' r='1.2' fill='currentColor' opacity='0.5' />
    </SvgIcon>
  )
}

const ICON_MAP = {
  snow: AcUnitIcon,
  star: AutoAwesomeIcon,
  heart: FavoriteIcon,
  petal: LocalFloristIcon,
  bubble: BubbleIcon,
  maple: MapleIcon,
  note: MusicNoteIcon,
  packet: PacketIcon,
  butterfly: ButterflyIcon,
  text: FuIcon,
  rain: WaterDropIcon,
  pumpkin: PumpkinIcon,
  firefly: FlareIcon,
  lantern: LanternIcon,
  dandelion: DandelionIcon
}

export default function PatternIcon ({ pattern, ...props }) {
  const Icon = ICON_MAP[pattern] || AcUnitIcon
  return <Icon {...props} />
}
