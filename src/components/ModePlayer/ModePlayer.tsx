import { useRef, useState, useEffect } from 'react'
import { ModeType } from '../../types/music'
import { MODE_TRACK_ROOTS, getNoteDisplay } from '../../utils/music'
import styles from './ModePlayer.module.css'

const MODE_TRACKS: Record<Exclude<ModeType, 'none'>, string> = {
  ionian: '/modes/Ionian.m4a',
  dorian: '/modes/Dorian.m4a',
  phrygian: '/modes/Phrygian.m4a',
  lydian: '/modes/Lydian.m4a',
  mixolydian: '/modes/Mixolydian.m4a',
  aeolian: '/modes/Aeolian.m4a',
  locrian: '/modes/Locrian.m4a',
}

interface ModePlayerProps {
  modeType: Exclude<ModeType, 'none'>
}

export function ModePlayer({ modeType }: ModePlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
  }, [modeType])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = () => {
    if (!audioRef.current) return
    setCurrentTime(audioRef.current.currentTime)
  }

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return
    setDuration(audioRef.current.duration)
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    audioRef.current.currentTime = pct * duration
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    return `${m}:${Math.floor(s % 60).toString().padStart(2, '0')}`
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const rootNote = MODE_TRACK_ROOTS[modeType]

  return (
    <div className={styles.player}>
      <span className={styles.key}>Key: {getNoteDisplay(rootNote)}</span>
      <audio
        key={modeType}
        ref={audioRef}
        src={MODE_TRACKS[modeType]}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        loop
      />
      <button className={styles.playButton} onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
        {isPlaying ? '⏸' : '▶'}
      </button>
      <div className={styles.progressTrack} onClick={handleProgressClick}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>
      <span className={styles.time}>
        {formatTime(currentTime)}{duration > 0 && ` / ${formatTime(duration)}`}
      </span>
    </div>
  )
}
