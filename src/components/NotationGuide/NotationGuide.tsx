import { useEffect } from 'react'
import styles from './NotationGuide.module.css'

interface NotationGuideProps {
  isOpen: boolean
  onClose: () => void
}

interface NotationEntry {
  name: string
  weUse: string
  alternatives: string[]
}

const TRIAD_NOTATIONS: NotationEntry[] = [
  { name: 'Major', weUse: 'C', alternatives: ['CM', 'Cmaj', 'CΔ'] },
  { name: 'Minor', weUse: 'Cm', alternatives: ['Cmin', 'C-', 'C−'] },
  { name: 'Diminished', weUse: 'C°', alternatives: ['Cdim', 'Co'] },
  { name: 'Augmented', weUse: 'C+', alternatives: ['Caug', 'C(#5)'] },
  { name: 'Suspended 2nd', weUse: 'Csus2', alternatives: ['C2', 'Csus2'] },
  { name: 'Suspended 4th', weUse: 'Csus4', alternatives: ['C4', 'Csus'] },
]

const SEVENTH_NOTATIONS: NotationEntry[] = [
  { name: 'Dominant 7th', weUse: 'C7', alternatives: ['Cdom7', 'Cdom'] },
  { name: 'Major 7th', weUse: 'Cmaj7', alternatives: ['CΔ7', 'CM7', 'CΔ'] },
  { name: 'Minor 7th', weUse: 'Cm7', alternatives: ['Cmin7', 'C-7', 'C−7'] },
  { name: 'Diminished 7th', weUse: 'C°7', alternatives: ['Cdim7', 'Co7'] },
  { name: 'Half-Diminished', weUse: 'Cø7', alternatives: ['Cm7b5', 'C-7(b5)', 'Cø'] },
  { name: 'Minor-Major 7th', weUse: 'CmMaj7', alternatives: ['Cm(Δ7)', 'C-Δ7', 'CmM7'] },
  { name: 'Augmented 7th', weUse: 'C+7', alternatives: ['Caug7', 'C7(#5)'] },
  { name: '7th Suspended 4th', weUse: 'C7sus4', alternatives: ['C7sus', 'C11 (no 3)'] },
]

const EXTENDED_NOTATIONS: NotationEntry[] = [
  { name: '9th', weUse: 'C9', alternatives: ['Cdom9', 'C7(9)'] },
  { name: 'Major 9th', weUse: 'Cmaj9', alternatives: ['CΔ9', 'CM9'] },
  { name: 'Minor 9th', weUse: 'Cm9', alternatives: ['Cmin9', 'C-9'] },
  { name: '11th', weUse: 'C11', alternatives: ['Cdom11', 'C9(11)'] },
  { name: '13th', weUse: 'C13', alternatives: ['Cdom13', 'C11(13)'] },
  { name: 'Add 9', weUse: 'Cadd9', alternatives: ['C(9)', 'C2 (sometimes)'] },
]

const INTERVAL_NOTATIONS: NotationEntry[] = [
  { name: 'Root / Unison', weUse: 'R', alternatives: ['1', 'P1'] },
  { name: 'Minor 2nd', weUse: 'm2', alternatives: ['b2', '♭2'] },
  { name: 'Major 2nd', weUse: 'M2', alternatives: ['2'] },
  { name: 'Minor 3rd', weUse: 'm3', alternatives: ['b3', '♭3'] },
  { name: 'Major 3rd', weUse: 'M3', alternatives: ['3'] },
  { name: 'Perfect 4th', weUse: 'P4', alternatives: ['4'] },
  { name: 'Tritone', weUse: 'TT', alternatives: ['#4', 'b5', '♯4', '♭5'] },
  { name: 'Perfect 5th', weUse: 'P5', alternatives: ['5'] },
  { name: 'Minor 6th', weUse: 'm6', alternatives: ['b6', '♭6', '#5'] },
  { name: 'Major 6th', weUse: 'M6', alternatives: ['6'] },
  { name: 'Minor 7th', weUse: 'm7', alternatives: ['b7', '♭7'] },
  { name: 'Major 7th', weUse: 'M7', alternatives: ['7', 'Δ7'] },
]

const SCALE_DEGREE_NOTATIONS: NotationEntry[] = [
  { name: 'Tonic', weUse: '1', alternatives: ['I', 'i'] },
  { name: 'Supertonic', weUse: '2', alternatives: ['II', 'ii'] },
  { name: 'Mediant', weUse: '3', alternatives: ['III', 'iii'] },
  { name: 'Subdominant', weUse: '4', alternatives: ['IV', 'iv'] },
  { name: 'Dominant', weUse: '5', alternatives: ['V', 'v'] },
  { name: 'Submediant', weUse: '6', alternatives: ['VI', 'vi'] },
  { name: 'Leading Tone', weUse: '7', alternatives: ['VII', 'vii°'] },
]

function NotationTable({ title, entries }: { title: string; entries: NotationEntry[] }) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>We Use</th>
            <th>Alternatives</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.name}>
              <td className={styles.nameCell}>{entry.name}</td>
              <td className={styles.weUseCell}>{entry.weUse}</td>
              <td className={styles.altCell}>{entry.alternatives.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function NotationGuide({ isOpen, onClose }: NotationGuideProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Notation Guide</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          <p className={styles.intro}>
            Music notation varies across different sources, teachers, and regions.
            This guide shows the notation we use in this app and common alternatives you might encounter.
          </p>

          <NotationTable title="Triads" entries={TRIAD_NOTATIONS} />
          <NotationTable title="7th Chords" entries={SEVENTH_NOTATIONS} />
          <NotationTable title="Extended Chords" entries={EXTENDED_NOTATIONS} />
          <NotationTable title="Intervals" entries={INTERVAL_NOTATIONS} />
          <NotationTable title="Scale Degrees" entries={SCALE_DEGREE_NOTATIONS} />

          <div className={styles.notes}>
            <h3 className={styles.sectionTitle}>Notes</h3>
            <ul>
              <li><strong>Enharmonic equivalents:</strong> We display both sharp and flat names (e.g., A#/Bb)</li>
              <li><strong>Roman numerals:</strong> Uppercase = major, lowercase = minor (e.g., I, IV, V vs ii, iii, vi)</li>
              <li><strong>Borrowed chords:</strong> Shown in purple in chord progressions</li>
              <li><strong>Slash chords:</strong> Root/Bass format (e.g., C/E means C major with E in the bass)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
