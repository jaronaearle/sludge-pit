import { Note, StringNumber } from '../../types/music'
import { identifyChord, getNoteDisplay } from '../../utils/music'
import styles from './ChordDetector.module.css'

interface DetectionFret {
  string: StringNumber
  fret: number
  note: Note
}

interface ChordDetectorProps {
  detectionFrets: DetectionFret[]
  onClear: () => void
}

export function ChordDetector({ detectionFrets, onClear }: ChordDetectorProps) {
  const uniqueNotes = [...new Set(detectionFrets.map(f => f.note))] as Note[]
  const matches = identifyChord(uniqueNotes)
  const exactMatches = matches.filter(m => !m.partial)
  const partialMatches = matches.filter(m => m.partial)

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.title}>Chord Detect</span>
        {detectionFrets.length > 0 && (
          <button className={styles.clearButton} onClick={onClear}>Clear</button>
        )}
      </div>

      {detectionFrets.length === 0 ? (
        <p className={styles.hint}>Click any frets on the neck to identify a chord</p>
      ) : (
        <>
          <div className={styles.notes}>
            {uniqueNotes.map(n => (
              <span key={n} className={styles.noteChip}>{getNoteDisplay(n)}</span>
            ))}
          </div>

          {uniqueNotes.length === 1 ? (
            <p className={styles.hint}>Select more notes to identify a chord</p>
          ) : exactMatches.length === 0 && partialMatches.length === 0 ? (
            <p className={styles.noMatch}>No match — try adjusting your selection</p>
          ) : (
            <div className={styles.results}>
              {exactMatches.map(m => (
                <span key={m.name} className={styles.match}>{m.name}</span>
              ))}
              {partialMatches.map(m => (
                <span key={m.name} className={styles.partialMatch}>{m.name} <em>(no 5th)</em></span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
