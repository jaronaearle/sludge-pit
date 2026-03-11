import { Note } from '../../types/music'
import { getChordsInMajorKey, getChordsInMinorKey, getChordSymbol, KeyChord } from '../../utils/music'
import styles from './KeyReference.module.css'

interface KeyReferenceProps {
  rootNote: Note
}

export function KeyReference({ rootNote }: KeyReferenceProps) {
  const majorChords = getChordsInMajorKey(rootNote)
  const minorChords = getChordsInMinorKey(rootNote)

  const renderChordRow = (chords: KeyChord[], keyType: 'major' | 'minor') => (
    <div className={styles.keyRow}>
      <div className={styles.keyLabel}>
        {rootNote} {keyType === 'major' ? 'Major' : 'Minor'}
      </div>
      <div className={styles.chordsContainer}>
        {chords.map((chord, index) => (
          <div key={index} className={styles.chordColumn}>
            <span className={styles.romanNumeral}>{chord.romanNumeral}</span>
            <span className={`${styles.chordSymbol} ${styles[chord.quality]}`}>
              {getChordSymbol(chord)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className={styles.keyReference}>
      <div className={styles.title}>Chords in Key</div>
      {renderChordRow(majorChords, 'major')}
      {renderChordRow(minorChords, 'minor')}
    </div>
  )
}
