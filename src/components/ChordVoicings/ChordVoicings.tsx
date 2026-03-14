import { Note, TriadType, SeventhChordType } from '../../types/music'
import { getChordVoicings, ChordVoicing, CAGED_SHAPES } from '../../utils/music'
import styles from './ChordVoicings.module.css'

interface ChordVoicingsProps {
  rootNote: Note
  triadType: TriadType
  seventhChordType: SeventhChordType
}

function ChordDiagram({ voicing, rootNote }: { voicing: ChordVoicing, rootNote: Note }) {
  const numFrets = 4
  const startFret = voicing.baseFret

  // Normalize frets relative to baseFret for display
  const displayFrets = voicing.frets.map(f => {
    if (f === -1) return -1 // muted
    if (f === 0) return 0 // open (only valid when baseFret is 1)
    return f - startFret + 1 // relative to diagram start
  })

  return (
    <div className={styles.diagram}>
      <div className={styles.chordName}>
        {rootNote} - {voicing.name}
        {voicing.cagedShape && (
          <span
            className={styles.cagedBadge}
            style={{ backgroundColor: CAGED_SHAPES[voicing.cagedShape].color }}
          >
            {voicing.cagedShape}
          </span>
        )}
      </div>

      <div className={styles.grid}>
        {/* Fret position indicator */}
        {startFret > 1 && (
          <div className={styles.fretIndicator}>{startFret}fr</div>
        )}

        {/* Nut or continuation line */}
        <div className={`${styles.nut} ${startFret > 1 ? styles.noNut : ''}`} />

        {/* String indicators (muted/open) - low E on left, high E on right */}
        <div className={styles.stringIndicators}>
          {displayFrets.map((fret, i) => (
            <div key={i} className={styles.stringIndicator}>
              {fret === -1 ? '×' : fret === 0 ? '○' : ''}
            </div>
          ))}
        </div>

        {/* Fretboard grid */}
        <div className={styles.fretboard}>
          {Array.from({ length: numFrets }, (_, fretIdx) => (
            <div key={fretIdx} className={styles.fretRow}>
              {displayFrets.map((fret, stringIdx) => (
                <div key={stringIdx} className={styles.fretCell}>
                  <div className={styles.stringLine} />
                  {fret === fretIdx + 1 && (
                    <div className={styles.finger} />
                  )}
                </div>
              ))}
              <div className={styles.fretWire} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ChordVoicings({ rootNote, triadType, seventhChordType }: ChordVoicingsProps) {
  // Determine which chord type to show voicings for
  const chordType = seventhChordType !== 'none' ? seventhChordType : triadType

  if (chordType === 'none') {
    return null
  }

  const voicings = getChordVoicings(rootNote, chordType)

  if (voicings.length === 0) {
    return null
  }

  const chordLabel = seventhChordType !== 'none'
    ? `${rootNote} ${seventhChordType.replace('7', ' 7th').replace('_', ' ')}`
    : `${rootNote} ${triadType}`

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Chord Voicings</h3>
        <span className={styles.chordLabel}>{chordLabel}</span>
      </div>
      <div className={styles.voicingsGrid}>
        {voicings.map((voicing, idx) => (
          <ChordDiagram key={idx} voicing={voicing} rootNote={rootNote} />
        ))}
      </div>
    </div>
  )
}
