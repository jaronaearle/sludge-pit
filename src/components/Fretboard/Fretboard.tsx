import { Note, IntervalDisplayMode, ScaleType, TriadType, SeventhChordType, ExtendedChordType, ModeType, InversionType, Interval } from '../../types/music'
import { FRET_COUNT, getNoteAtFret, getInterval, INTERVAL_COLORS, isNoteInScale, getScaleDegree, isNoteInTriad, getTriadDegree, isNoteInSeventhChord, getSeventhChordDegree, isNoteInExtendedChord, getExtendedChordDegree, isNoteInMode, getModeDegree, getInversionBassIndex, getTriadNotes, getSeventhChordNotes, getExtendedChordNotes } from '../../utils/music'
import styles from './Fretboard.module.css'

interface FretboardProps {
  rootNote: Note
  showAllNotes: boolean
  intervalDisplayMode: IntervalDisplayMode
  scaleType: ScaleType
  triadType: TriadType
  seventhChordType: SeventhChordType
  extendedChordType: ExtendedChordType
  modeType: ModeType
  inversionType: InversionType
  tuning: Note[]
  label?: string
  compact?: boolean
}

const FRET_MARKERS = [3, 5, 7, 9, 12]

// Colors for scale degrees (1-7)
const SCALE_DEGREE_COLORS: Record<number, string> = {
  1: '#ef4444', // Root - red
  2: '#fb923c', // 2nd - orange
  3: '#facc15', // 3rd - yellow
  4: '#22c55e', // 4th - green
  5: '#3b82f6', // 5th - blue
  6: '#818cf8', // 6th - indigo
  7: '#c084fc', // 7th - purple
}

// Colors for triad degrees (Root, 3rd, 5th)
const TRIAD_DEGREE_COLORS: Record<number, string> = {
  1: '#ef4444', // Root - red
  2: '#facc15', // 3rd - yellow
  3: '#3b82f6', // 5th - blue
}

// Colors for 7th chord degrees (Root, 3rd, 5th, 7th)
const SEVENTH_CHORD_DEGREE_COLORS: Record<number, string> = {
  1: '#ef4444', // Root - red
  2: '#facc15', // 3rd - yellow
  3: '#3b82f6', // 5th - blue
  4: '#c084fc', // 7th - purple
}

// Colors for extended chord degrees (Root, 3rd, 5th, 7th, 9th, 11th, 13th)
const EXTENDED_CHORD_DEGREE_COLORS: Record<number, string> = {
  1: '#ef4444', // Root - red
  2: '#facc15', // 3rd - yellow
  3: '#3b82f6', // 5th - blue
  4: '#c084fc', // 7th - purple
  5: '#fb923c', // 9th - orange
  6: '#22c55e', // 11th - green
  7: '#818cf8', // 13th - indigo
}

export function Fretboard({ rootNote, showAllNotes, intervalDisplayMode, scaleType, triadType, seventhChordType, extendedChordType, modeType, inversionType, tuning, label, compact = false }: FretboardProps) {
  const getIntervalForNote = (note: Note): Interval => {
    return getInterval(rootNote, note)
  }

  type NoteDisplayResult = {
    show: boolean
    isInterval: boolean
    isRoot: boolean
    isScale: boolean
    scaleDegree: number | null
    isTriad: boolean
    triadDegree: number | null
    isSeventhChord: boolean
    seventhChordDegree: number | null
    isExtendedChord: boolean
    extendedChordDegree: number | null
    isMode: boolean
    modeDegree: number | null
    isBassNote: boolean
  }

  // Get the bass note for current chord + inversion
  const getBassNote = (): Note | null => {
    const bassIndex = getInversionBassIndex(inversionType)

    if (extendedChordType !== 'none') {
      const notes = getExtendedChordNotes(rootNote, extendedChordType)
      return bassIndex < notes.length ? notes[bassIndex] : null
    }
    if (seventhChordType !== 'none') {
      const notes = getSeventhChordNotes(rootNote, seventhChordType)
      return bassIndex < notes.length ? notes[bassIndex] : null
    }
    if (triadType !== 'none') {
      const notes = getTriadNotes(rootNote, triadType)
      return bassIndex < notes.length ? notes[bassIndex] : null
    }
    return null
  }

  const bassNote = getBassNote()

  const shouldShowNote = (note: Note): NoteDisplayResult => {
    const isBass = bassNote !== null && note === bassNote
    const baseResult = {
      show: false,
      isInterval: false,
      isRoot: false,
      isScale: false,
      scaleDegree: null as number | null,
      isTriad: false,
      triadDegree: null as number | null,
      isSeventhChord: false,
      seventhChordDegree: null as number | null,
      isExtendedChord: false,
      extendedChordDegree: null as number | null,
      isMode: false,
      modeDegree: null as number | null,
      isBassNote: false,
    }

    // Check scale display first
    if (scaleType !== 'none') {
      if (isNoteInScale(note, rootNote, scaleType)) {
        const degree = getScaleDegree(note, rootNote, scaleType)
        return { ...baseResult, show: true, isRoot: degree === 1, isScale: true, scaleDegree: degree }
      }
    }

    // Check mode display (similar to scales)
    if (modeType !== 'none') {
      if (isNoteInMode(note, rootNote, modeType)) {
        const degree = getModeDegree(note, rootNote, modeType)
        return { ...baseResult, show: true, isRoot: degree === 1, isMode: true, modeDegree: degree }
      }
    }

    // Check extended chord display
    if (extendedChordType !== 'none') {
      if (isNoteInExtendedChord(note, rootNote, extendedChordType)) {
        const degree = getExtendedChordDegree(note, rootNote, extendedChordType)
        return { ...baseResult, show: true, isRoot: degree === 1, isExtendedChord: true, extendedChordDegree: degree, isBassNote: isBass }
      }
    }

    // Check 7th chord display
    if (seventhChordType !== 'none') {
      if (isNoteInSeventhChord(note, rootNote, seventhChordType)) {
        const degree = getSeventhChordDegree(note, rootNote, seventhChordType)
        return { ...baseResult, show: true, isRoot: degree === 1, isSeventhChord: true, seventhChordDegree: degree, isBassNote: isBass }
      }
    }

    // Check triad display
    if (triadType !== 'none') {
      if (isNoteInTriad(note, rootNote, triadType)) {
        const degree = getTriadDegree(note, rootNote, triadType)
        return { ...baseResult, show: true, isRoot: degree === 1, isTriad: true, triadDegree: degree, isBassNote: isBass }
      }
    }

    // Check interval display - show both the interval AND the root notes
    if (intervalDisplayMode !== 'none') {
      const interval = getIntervalForNote(note)
      if (interval === intervalDisplayMode) {
        return { ...baseResult, show: true, isInterval: true }
      }
      // Also show root notes when an interval is selected
      if (note === rootNote) {
        return { ...baseResult, show: true, isRoot: true }
      }
    }

    // Show all notes if checkbox is checked
    if (showAllNotes) return { ...baseResult, show: true }

    // Default: show the root note
    if (note === rootNote) return { ...baseResult, show: true, isRoot: true }

    return baseResult
  }

  const getNoteColor = (display: NoteDisplayResult): string => {
    if (display.isScale && display.scaleDegree !== null) {
      return SCALE_DEGREE_COLORS[display.scaleDegree]
    }
    if (display.isMode && display.modeDegree !== null) {
      return SCALE_DEGREE_COLORS[display.modeDegree] // Modes use same colors as scales (7 degrees)
    }
    if (display.isExtendedChord && display.extendedChordDegree !== null) {
      return EXTENDED_CHORD_DEGREE_COLORS[display.extendedChordDegree]
    }
    if (display.isSeventhChord && display.seventhChordDegree !== null) {
      return SEVENTH_CHORD_DEGREE_COLORS[display.seventhChordDegree]
    }
    if (display.isTriad && display.triadDegree !== null) {
      return TRIAD_DEGREE_COLORS[display.triadDegree]
    }
    if (display.isRoot) {
      return INTERVAL_COLORS.unison
    }
    if (display.isInterval && intervalDisplayMode !== 'none') {
      return INTERVAL_COLORS[intervalDisplayMode]
    }
    if (showAllNotes) {
      return '#ffffff'
    }
    return INTERVAL_COLORS.unison
  }

  // Get the note class, adding bass indicator if needed
  const getNoteClass = (display: NoteDisplayResult): string => {
    if (display.isBassNote && inversionType !== 'root') {
      return `${styles.note} ${styles.bassNote}`
    }
    return styles.note
  }

  const fretboardClass = compact
    ? `${styles.fretboard} ${styles.compact}`
    : styles.fretboard

  return (
    <div className={fretboardClass}>
      {label && <div className={styles.label}>{label}</div>}
      {/* Fret markers */}
      <div className={styles.fretMarkers}>
        <div className={styles.markerSpacer} /> {/* Space for nut */}
        {Array.from({ length: FRET_COUNT }, (_, fret) => (
          <div key={fret} className={styles.markerCell}>
            {FRET_MARKERS.includes(fret + 1) && (
              <div className={`${styles.marker} ${fret + 1 === 12 ? styles.doubleMarker : ''}`}>
                {fret + 1 === 12 ? (
                  <>
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                  </>
                ) : (
                  <span className={styles.dot} />
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Strings - reversed so high E is at top */}
      {[...tuning].reverse().map((openNote, stringIndex) => {
        const openNoteDisplay = shouldShowNote(openNote)
        return (
          <div key={stringIndex} className={styles.string}>
            {/* Nut / Open string */}
            <div className={styles.nut}>
              {openNoteDisplay.show ? (
                <span
                  className={getNoteClass(openNoteDisplay)}
                  style={{ backgroundColor: getNoteColor(openNoteDisplay) }}
                >
                  {openNote}
                </span>
              ) : (
                <span className={styles.openNote}>{openNote}</span>
              )}
            </div>

            {/* Frets */}
            {Array.from({ length: FRET_COUNT }, (_, fret) => {
              const note = getNoteAtFret(openNote, fret + 1)
              const noteDisplay = shouldShowNote(note)

              return (
                <div key={fret} className={styles.fret}>
                  <div className={styles.fretWire} />
                  {noteDisplay.show && (
                    <span
                      className={getNoteClass(noteDisplay)}
                      style={{ backgroundColor: getNoteColor(noteDisplay) }}
                    >
                      {note}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        )
      })}

      {/* Fret numbers */}
      <div className={styles.fretNumbers}>
        <div className={styles.numberSpacer} />
        {Array.from({ length: FRET_COUNT }, (_, fret) => (
          <div key={fret} className={styles.fretNumber}>
            {fret + 1}
          </div>
        ))}
      </div>
    </div>
  )
}
