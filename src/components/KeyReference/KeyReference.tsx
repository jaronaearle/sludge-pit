import { Note, TriadType } from '../../types/music'
import { getChordsInMajorKey, getChordsInMinorKey, getChordSymbol, KeyChord, getNoteDisplay } from '../../utils/music'
import styles from './KeyReference.module.css'

interface KeyReferenceProps {
  rootNote: Note
  selectedChordRoot?: Note
  selectedTriadType?: TriadType
  onChordSelect?: (root: Note, quality: TriadType) => void
}

export function KeyReference({ rootNote, selectedChordRoot, selectedTriadType, onChordSelect }: KeyReferenceProps) {
  const majorChords = getChordsInMajorKey(rootNote)
  const minorChords = getChordsInMinorKey(rootNote)

  const handleChordClick = (chord: KeyChord) => {
    if (onChordSelect) {
      // Map quality to TriadType
      const triadType: TriadType = chord.quality === 'major' ? 'major'
        : chord.quality === 'minor' ? 'minor'
        : chord.quality === 'diminished' ? 'diminished'
        : 'augmented'
      onChordSelect(chord.root, triadType)
    }
  }

  const isChordSelected = (chord: KeyChord): boolean => {
    if (!selectedChordRoot || !selectedTriadType || selectedTriadType === 'none') return false
    const chordTriadType = chord.quality === 'major' ? 'major'
      : chord.quality === 'minor' ? 'minor'
      : chord.quality === 'diminished' ? 'diminished'
      : 'augmented'
    return chord.root === selectedChordRoot && chordTriadType === selectedTriadType
  }

  const renderChordRow = (chords: KeyChord[], keyType: 'major' | 'minor') => (
    <div className={styles.keyRow}>
      <div className={styles.keyLabel}>
        {getNoteDisplay(rootNote)} {keyType === 'major' ? 'Major' : 'Minor'}
      </div>
      <div className={styles.chordsContainer}>
        {chords.map((chord, index) => (
          <div
            key={index}
            className={`${styles.chordColumn} ${onChordSelect ? styles.clickable : ''} ${isChordSelected(chord) ? styles.selected : ''}`}
            onClick={() => handleChordClick(chord)}
          >
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
      <div className={styles.title}>Chords in Key <span className={styles.hint}>(click to show on fretboard)</span></div>
      {renderChordRow(majorChords, 'major')}
      {renderChordRow(minorChords, 'minor')}
    </div>
  )
}
