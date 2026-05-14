import { Note, ScaleType, ModeType } from '../../types/music'
import { getScaleNotes, getScaleDegreeInfo, getScaleIntervalFormula, SCALE_LABELS, getModeNotes, MODE_LABELS, MODE_PATTERNS, SCALE_PATTERNS, getNoteDisplay } from '../../utils/music'
import styles from './ScaleReference.module.css'

interface ScaleReferenceProps {
  rootNote: Note
  scaleType: ScaleType
  modeType: ModeType
}

// Interval names from root (in semitones) for modes
const SEMITONE_TO_INTERVAL: Record<number, string> = {
  0: 'R',
  1: 'b2',
  2: '2',
  3: 'b3',
  4: '3',
  5: '4',
  6: 'b5',
  7: '5',
  8: '#5',
  9: '6',
  10: 'b7',
  11: '7',
}

export function ScaleReference({ rootNote, scaleType, modeType }: ScaleReferenceProps) {
  // Don't render if no scale or mode is selected
  if (scaleType === 'none' && modeType === 'none') {
    return null
  }

  const isScale = scaleType !== 'none'
  const label = isScale ? SCALE_LABELS[scaleType] : MODE_LABELS[modeType as Exclude<ModeType, 'none'>]
  const notes = isScale ? getScaleNotes(rootNote, scaleType) : getModeNotes(rootNote, modeType as Exclude<ModeType, 'none'>)
  const pattern = isScale ? SCALE_PATTERNS[scaleType] : MODE_PATTERNS[modeType as Exclude<ModeType, 'none'>]

  // Get degree info
  const degreeInfo = isScale
    ? getScaleDegreeInfo(rootNote, scaleType)
    : notes.map((note, index) => ({
        degree: index + 1,
        note,
        intervalName: SEMITONE_TO_INTERVAL[pattern[index]],
        isChordTone: index % 2 === 0,
      }))

  // Get interval formula
  const formula = isScale
    ? getScaleIntervalFormula(scaleType)
    : (() => {
        const intervals: string[] = []
        for (let i = 0; i < pattern.length - 1; i++) {
          const diff = pattern[i + 1] - pattern[i]
          if (diff === 1) intervals.push('H')
          else if (diff === 2) intervals.push('W')
          else if (diff === 3) intervals.push('W+H')
          else intervals.push(`${diff}`)
        }
        const lastInterval = 12 - pattern[pattern.length - 1]
        if (lastInterval === 1) intervals.push('H')
        else if (lastInterval === 2) intervals.push('W')
        else if (lastInterval === 3) intervals.push('W+H')
        return intervals.join('-')
      })()

  return (
    <div className={styles.scaleReference}>
      <div className={styles.header}>
        <span className={styles.title}>{getNoteDisplay(rootNote)} {label}</span>
        <span className={styles.formula}>{formula}</span>
      </div>

      <div className={styles.notesContainer}>
        {degreeInfo.map((info, index) => (
          <div
            key={index}
            className={`${styles.noteColumn} ${info.isChordTone ? styles.chordTone : ''}`}
          >
            <span className={styles.degree}>{info.degree}</span>
            <span className={styles.noteName}>{getNoteDisplay(info.note)}</span>
            <span className={styles.interval}>{info.intervalName}</span>
          </div>
        ))}
      </div>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.chordToneIndicator}></span>
          Chord tones (R, 3, 5, 7)
        </span>
      </div>
    </div>
  )
}
