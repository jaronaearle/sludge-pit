import { Note, SelectedIntervals, ScaleType, DyadType, TriadType, SeventhChordType, ExtendedChordType, ModeType, InversionType, Interval, FretCount, CAGEDShape, ScalePosition, StringNumber } from '../../types/music'
import { getNoteAtFret, getInterval, INTERVAL_COLORS, isNoteInScale, getScaleDegree, isNoteInDyad, getDyadDegree, isNoteInTriad, getTriadDegree, isNoteInSeventhChord, getSeventhChordDegree, isNoteInExtendedChord, getExtendedChordDegree, isNoteInMode, getModeDegree, getInversionBassIndex, getTriadNotes, getSeventhChordNotes, getExtendedChordNotes, CAGED_SHAPES, CAGED_SHAPE_ORDER, getCAGEDShapeFretRange, isFretInScalePosition, getNoteDisplay } from '../../utils/music'
import styles from './Fretboard.module.css'

interface FretboardProps {
  rootNote: Note
  chordRoot?: Note  // Separate root for chord display (defaults to rootNote)
  showAllNotes: boolean
  showDegrees: boolean
  selectedIntervals: SelectedIntervals
  scaleType: ScaleType
  dyadType: DyadType
  triadType: TriadType
  seventhChordType: SeventhChordType
  extendedChordType: ExtendedChordType
  modeType: ModeType
  inversionType: InversionType
  tuning: Note[]
  fretCount: FretCount
  showCAGED?: boolean
  cagedShape?: CAGEDShape | 'all'
  scalePosition?: ScalePosition
  singleStringMode?: boolean
  selectedString?: StringNumber
  label?: string
  compact?: boolean
  detectionMode?: boolean
  detectionFrets?: { string: StringNumber; fret: number }[]
  onDetectionFretToggle?: (string: StringNumber, fret: number, note: Note) => void
}

// Standard fret markers (single dots and double dots at 12, 24)
const FRET_MARKERS = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24]
const DOUBLE_DOT_FRETS = [12, 24]

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

export function Fretboard({ rootNote, chordRoot, showAllNotes, showDegrees, selectedIntervals, scaleType, dyadType, triadType, seventhChordType, extendedChordType, modeType, inversionType, tuning, fretCount, showCAGED = false, cagedShape = 'all', scalePosition = 'all', singleStringMode = false, selectedString = 6, label, compact = false, detectionMode = false, detectionFrets = [], onDetectionFretToggle }: FretboardProps) {
  // Use chordRoot for chord display, rootNote for scales/intervals
  const effectiveChordRoot = chordRoot ?? rootNote
  const getIntervalForNote = (note: Note): Interval => {
    return getInterval(rootNote, note)
  }

  type NoteDisplayResult = {
    show: boolean
    isInterval: boolean
    matchedInterval: Interval | null
    isRoot: boolean
    isScale: boolean
    scaleDegree: number | null
    isDyad: boolean
    dyadDegree: number | null
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
      const notes = getExtendedChordNotes(effectiveChordRoot, extendedChordType)
      return bassIndex < notes.length ? notes[bassIndex] : null
    }
    if (seventhChordType !== 'none') {
      const notes = getSeventhChordNotes(effectiveChordRoot, seventhChordType)
      return bassIndex < notes.length ? notes[bassIndex] : null
    }
    if (triadType !== 'none') {
      const notes = getTriadNotes(effectiveChordRoot, triadType)
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
      matchedInterval: null as Interval | null,
      isRoot: false,
      isScale: false,
      scaleDegree: null as number | null,
      isDyad: false,
      dyadDegree: null as number | null,
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

    // Check extended chord display (use effectiveChordRoot for chords)
    if (extendedChordType !== 'none') {
      if (isNoteInExtendedChord(note, effectiveChordRoot, extendedChordType)) {
        const degree = getExtendedChordDegree(note, effectiveChordRoot, extendedChordType)
        return { ...baseResult, show: true, isRoot: degree === 1, isExtendedChord: true, extendedChordDegree: degree, isBassNote: isBass }
      }
    }

    // Check 7th chord display
    if (seventhChordType !== 'none') {
      if (isNoteInSeventhChord(note, effectiveChordRoot, seventhChordType)) {
        const degree = getSeventhChordDegree(note, effectiveChordRoot, seventhChordType)
        return { ...baseResult, show: true, isRoot: degree === 1, isSeventhChord: true, seventhChordDegree: degree, isBassNote: isBass }
      }
    }

    // Check triad display
    if (triadType !== 'none') {
      if (isNoteInTriad(note, effectiveChordRoot, triadType)) {
        const degree = getTriadDegree(note, effectiveChordRoot, triadType)
        return { ...baseResult, show: true, isRoot: degree === 1, isTriad: true, triadDegree: degree, isBassNote: isBass }
      }
    }

    // Check dyad display
    if (dyadType !== 'none') {
      if (isNoteInDyad(note, effectiveChordRoot, dyadType)) {
        const degree = getDyadDegree(note, effectiveChordRoot, dyadType)
        return { ...baseResult, show: true, isRoot: degree === 1, isDyad: true, dyadDegree: degree }
      }
    }

    // Check interval display - show selected intervals AND the root notes
    if (selectedIntervals.length > 0) {
      const interval = getIntervalForNote(note)
      if (selectedIntervals.includes(interval)) {
        return { ...baseResult, show: true, isInterval: true, matchedInterval: interval }
      }
      // Also show root notes when intervals are selected
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
    if (display.isDyad && display.dyadDegree !== null) {
      // Dyads: root is red, second note is blue (like 5th in power chord)
      return display.dyadDegree === 1 ? '#ef4444' : '#3b82f6'
    }
    if (display.isRoot) {
      return INTERVAL_COLORS.unison
    }
    if (display.isInterval && display.matchedInterval) {
      return INTERVAL_COLORS[display.matchedInterval]
    }
    if (showAllNotes) {
      return '#ffffff'
    }
    return INTERVAL_COLORS.unison
  }

  // Check if a scale/mode degree is a chord tone (1, 3, 5, 7)
  const isChordTone = (degree: number | null): boolean => {
    return degree === 1 || degree === 3 || degree === 5 || degree === 7
  }

  // Get the note class based on note type
  const getNoteClass = (display: NoteDisplayResult): string => {
    const classes = [styles.note]

    // Root notes get square shape
    if (display.isRoot) {
      classes.push(styles.rootNote)
    }

    // Chord tones get glow effect
    if (display.isScale && isChordTone(display.scaleDegree)) {
      classes.push(styles.chordTone)
    }
    if (display.isMode && isChordTone(display.modeDegree)) {
      classes.push(styles.chordTone)
    }
    // All dyad/triad/7th/extended chord notes are chord tones
    if (display.isDyad || display.isTriad || display.isSeventhChord || display.isExtendedChord) {
      classes.push(styles.chordTone)
    }

    // Bass note indicator for inversions
    if (display.isBassNote && inversionType !== 'root') {
      classes.push(styles.bassNote)
    }

    return classes.join(' ')
  }

  // Get display text for a note (note name or degree)
  const getNoteDisplayText = (note: Note, display: NoteDisplayResult): string => {
    if (!showDegrees) {
      return getNoteDisplay(note)
    }

    // Show degree based on what's being displayed
    if (display.isScale && display.scaleDegree !== null) {
      return display.scaleDegree === 1 ? 'R' : String(display.scaleDegree)
    }
    if (display.isMode && display.modeDegree !== null) {
      return display.modeDegree === 1 ? 'R' : String(display.modeDegree)
    }
    if (display.isDyad && display.dyadDegree !== null) {
      if (display.dyadDegree === 1) return 'R'
      // Map the second note based on dyad type
      const dyadSecondNoteLabels: Record<string, string> = {
        minor_2nd: 'b2',
        major_2nd: '2',
        minor_3rd: 'b3',
        major_3rd: '3',
        perfect_4th: '4',
        tritone: 'b5',
        perfect_5th: '5',
        minor_6th: 'b6',
        major_6th: '6',
        minor_7th: 'b7',
        major_7th: '7',
        octave: '8',
      }
      return dyadSecondNoteLabels[dyadType] || '?'
    }
    if (display.isTriad && display.triadDegree !== null) {
      // Triad degrees: 1=R, 2=3rd, 3=5th
      const triadDegreeLabels = ['R', '3', '5']
      return triadDegreeLabels[display.triadDegree - 1] || String(display.triadDegree)
    }
    if (display.isSeventhChord && display.seventhChordDegree !== null) {
      // 7th chord degrees: 1=R, 2=3rd, 3=5th, 4=7th
      const seventhDegreeLabels = ['R', '3', '5', '7']
      return seventhDegreeLabels[display.seventhChordDegree - 1] || String(display.seventhChordDegree)
    }
    if (display.isExtendedChord && display.extendedChordDegree !== null) {
      // Extended chord degrees: 1=R, 2=3rd, 3=5th, 4=7th, 5=9th, 6=11th, 7=13th
      const extendedDegreeLabels = ['R', '3', '5', '7', '9', '11', '13']
      return extendedDegreeLabels[display.extendedChordDegree - 1] || String(display.extendedChordDegree)
    }
    if (display.isRoot) {
      return 'R'
    }

    // Fallback to note name
    return getNoteDisplay(note)
  }

  // Get CAGED shape info for a fret position
  const getCAGEDOverlay = (fretNumber: number): { color: string, shape: CAGEDShape } | null => {
    if (!showCAGED) return null

    const shapesToCheck = cagedShape === 'all' ? CAGED_SHAPE_ORDER : [cagedShape]

    for (const shape of shapesToCheck) {
      const range = getCAGEDShapeFretRange(rootNote, shape, tuning)
      if (fretNumber >= range.start && fretNumber <= range.end) {
        return { color: CAGED_SHAPES[shape].color, shape }
      }
      // Also check if shape wraps around (e.g., starts at fret 10 and goes to fret 13, but we only show 12 frets)
      // Handle octave repetition
      const range12 = { start: range.start + 12, end: range.end + 12 }
      if (fretNumber >= range12.start && fretNumber <= range12.end && fretNumber <= fretCount) {
        return { color: CAGED_SHAPES[shape].color, shape }
      }
    }
    return null
  }

  const fretboardClass = [
    styles.fretboard,
    compact ? styles.compact : '',
    detectionMode ? styles.detectionMode : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={fretboardClass}>
      {label && <div className={styles.label}>{label}</div>}
      {/* Fret markers */}
      <div className={styles.fretMarkers}>
        <div className={styles.markerSpacer} /> {/* Space for nut */}
        {Array.from({ length: fretCount }, (_, fret) => (
          <div key={fret} className={styles.markerCell}>
            {FRET_MARKERS.includes(fret + 1) && (
              <div className={`${styles.marker} ${DOUBLE_DOT_FRETS.includes(fret + 1) ? styles.doubleMarker : ''}`}>
                {DOUBLE_DOT_FRETS.includes(fret + 1) ? (
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
        // Convert stringIndex to actual string number (1-6)
        // stringIndex 0 = high E (string 1), stringIndex 5 = low E (string 6)
        const actualStringNumber = (stringIndex + 1) as StringNumber

        const isDimmed = singleStringMode && actualStringNumber !== selectedString

        const openNoteDisplay = shouldShowNote(openNote)

        // Check if open string note should be shown based on position filtering
        // Open string (fret 0) - check position if scale/mode active
        const activeScaleType = scaleType !== 'none' ? scaleType : (modeType !== 'none' ? 'major' : null)
        const isOpenInPosition = activeScaleType
          ? isFretInScalePosition(0, rootNote, activeScaleType, scalePosition, tuning)
          : true

        const isOpenDetected = detectionFrets.some(f => f.string === actualStringNumber && f.fret === 0)

        return (
          <div key={stringIndex} className={`${styles.string} ${isDimmed ? styles.dimmedString : ''}`}>
            {/* Nut / Open string */}
            <div
              className={styles.nut}
              onClick={detectionMode ? () => onDetectionFretToggle?.(actualStringNumber, 0, openNote) : undefined}
              data-note={detectionMode && !isOpenDetected ? getNoteDisplay(openNote) : undefined}
            >
              {detectionMode ? (
                isOpenDetected
                  ? <span className={styles.detectionNote}>{getNoteDisplay(openNote)}</span>
                  : <span className={styles.openNote}>{getNoteDisplay(openNote)}</span>
              ) : openNoteDisplay.show && isOpenInPosition ? (
                <span
                  className={getNoteClass(openNoteDisplay)}
                  style={{ backgroundColor: getNoteColor(openNoteDisplay) }}
                >
                  {getNoteDisplayText(openNote, openNoteDisplay)}
                </span>
              ) : (
                <span className={styles.openNote}>{getNoteDisplay(openNote)}</span>
              )}
            </div>

            {/* Frets */}
            {Array.from({ length: fretCount }, (_, fret) => {
              const note = getNoteAtFret(openNote, fret + 1)
              const noteDisplay = shouldShowNote(note)
              const cagedOverlay = getCAGEDOverlay(fret + 1)
              const isDetected = detectionFrets.some(f => f.string === actualStringNumber && f.fret === fret + 1)

              // Check if fret is in the current scale position
              const isInPosition = activeScaleType
                ? isFretInScalePosition(fret + 1, rootNote, activeScaleType, scalePosition, tuning)
                : true

              return (
                <div
                  key={fret}
                  className={styles.fret}
                  style={cagedOverlay && !detectionMode ? { backgroundColor: `${cagedOverlay.color}20` } : undefined}
                  data-note={detectionMode && !isDetected ? getNoteDisplay(note) : undefined}
                  onClick={detectionMode ? () => onDetectionFretToggle?.(actualStringNumber, fret + 1, note) : undefined}
                >
                  <div className={styles.fretWire} />
                  {detectionMode ? (
                    isDetected && <span className={styles.detectionNote}>{getNoteDisplay(note)}</span>
                  ) : (
                    noteDisplay.show && isInPosition && (
                      <span
                        className={getNoteClass(noteDisplay)}
                        style={{ backgroundColor: getNoteColor(noteDisplay) }}
                      >
                        {getNoteDisplayText(note, noteDisplay)}
                      </span>
                    )
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
        {Array.from({ length: fretCount }, (_, fret) => (
          <div key={fret} className={styles.fretNumber}>
            {fret + 1}
          </div>
        ))}
      </div>
    </div>
  )
}
