import { useState, useEffect } from 'react'
import { Note, TriadType, ProgressionCategory, ProgressionKeyType, ChordProgression, ChordInProgression } from '../../types/music'
import { getStartingNumerals, getProgressions, getChordRootNote, getNoteDisplay } from '../../utils/music'
import { CollapsibleSection } from '../CollapsibleSection/CollapsibleSection'
import styles from './ChordProgressions.module.css'

interface ChordProgressionsProps {
  rootNote: Note
  onChordSelect: (chordRoot: Note, quality: TriadType) => void
}

export function ChordProgressions({ rootNote, onChordSelect }: ChordProgressionsProps) {
  const [category, setCategory] = useState<ProgressionCategory>('modern')
  const [keyType, setKeyType] = useState<ProgressionKeyType>('major')
  const [startingNumeral, setStartingNumeral] = useState<string>('')
  const [selectedProgression, setSelectedProgression] = useState<ChordProgression | null>(null)
  const [selectedChordIndex, setSelectedChordIndex] = useState<number>(0)

  // Get available starting numerals for current category/keyType
  const availableNumerals = getStartingNumerals(category, keyType)

  // Get progressions for current filters
  const progressions = getProgressions(category, keyType, startingNumeral || undefined)

  // Reset starting numeral when category or keyType changes
  useEffect(() => {
    setStartingNumeral('')
    setSelectedProgression(null)
    setSelectedChordIndex(0)
  }, [category, keyType])

  // Reset selected progression when starting numeral changes
  useEffect(() => {
    setSelectedProgression(null)
    setSelectedChordIndex(0)
  }, [startingNumeral])

  // Update fretboard when progression or chord index changes
  useEffect(() => {
    if (selectedProgression && selectedProgression.chords[selectedChordIndex]) {
      const chord = selectedProgression.chords[selectedChordIndex]
      const chordRoot = getChordRootNote(rootNote, chord, keyType)
      onChordSelect(chordRoot, chord.quality)
    }
  }, [selectedProgression, selectedChordIndex, rootNote, keyType, onChordSelect])

  const handleProgressionSelect = (progression: ChordProgression) => {
    setSelectedProgression(progression)
    setSelectedChordIndex(0)
  }

  const handleChordClick = (index: number) => {
    setSelectedChordIndex(index)
  }

  const handleReset = () => {
    setCategory('modern')
    setKeyType('major')
    setStartingNumeral('')
    setSelectedProgression(null)
    setSelectedChordIndex(0)
  }

  const hasActiveState = selectedProgression !== null || category !== 'modern' || keyType !== 'major' || startingNumeral !== ''

  const getChordDisplayName = (chord: ChordInProgression): string => {
    const chordRoot = getChordRootNote(rootNote, chord, keyType)
    const qualitySuffix = chord.quality === 'minor' ? 'm'
      : chord.quality === 'diminished' ? '°'
      : chord.quality === 'augmented' ? '+'
      : ''
    return `${getNoteDisplay(chordRoot)}${qualitySuffix}`
  }

  return (
    <CollapsibleSection title="Chord Progressions" defaultOpen={false}>
      <div className={styles.container}>
        <div className={styles.controls}>
          <label className={styles.label}>
            Style:
            <select
              className={styles.select}
              value={category}
              onChange={(e) => setCategory(e.target.value as ProgressionCategory)}
            >
              <option value="modern">Modern</option>
              <option value="classical">Classical</option>
            </select>
          </label>

          <label className={styles.label}>
            Key:
            <select
              className={styles.select}
              value={keyType}
              onChange={(e) => setKeyType(e.target.value as ProgressionKeyType)}
            >
              <option value="major">Major</option>
              <option value="minor">Minor</option>
            </select>
          </label>

          <label className={styles.label}>
            Starting:
            <select
              className={styles.select}
              value={startingNumeral}
              onChange={(e) => setStartingNumeral(e.target.value)}
            >
              <option value="">All</option>
              {availableNumerals.map((numeral) => (
                <option key={numeral} value={numeral}>
                  {numeral}
                </option>
              ))}
            </select>
          </label>

          {hasActiveState && (
            <button className={styles.clearButton} onClick={handleReset}>
              Clear
            </button>
          )}
        </div>

        <div className={styles.keyLabel}>
          Key of {getNoteDisplay(rootNote)} {keyType === 'major' ? 'Major' : 'Minor'}
        </div>

        <div className={styles.progressionsList}>
          {progressions.map((progression) => (
            <div
              key={progression.id}
              className={`${styles.progressionCard} ${selectedProgression?.id === progression.id ? styles.selected : ''}`}
              onClick={() => handleProgressionSelect(progression)}
            >
              <div className={styles.progressionNumerals}>
                {progression.chords.map((chord, i) => (
                  <span key={i} className={chord.borrowed ? styles.borrowed : ''}>
                    {chord.numeral}
                    {i < progression.chords.length - 1 && ' - '}
                  </span>
                ))}
              </div>
              {progression.description && (
                <div className={styles.progressionDesc}>{progression.description}</div>
              )}
            </div>
          ))}
        </div>

        {selectedProgression && (
          <div className={styles.selectedProgression}>
            <div className={styles.selectedHeader}>
              <span className={styles.selectedHint}>Click chord to show on fretboard</span>
            </div>

          <div className={styles.chordsDisplay}>
            {selectedProgression.chords.map((chord, index) => (
              <div
                key={index}
                className={`${styles.chordColumn} ${selectedChordIndex === index ? styles.activeChord : ''} ${chord.borrowed ? styles.borrowedChord : ''}`}
                onClick={() => handleChordClick(index)}
              >
                <span className={styles.chordNumeral}>{chord.numeral}</span>
                <span className={styles.chordName}>{getChordDisplayName(chord)}</span>
                <span className={styles.chordQuality}>
                  {chord.quality === 'major' ? 'maj' : chord.quality === 'minor' ? 'min' : chord.quality}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </CollapsibleSection>
  )
}
