import { useState } from 'react'
import { Note, SelectedIntervals, ScaleType, DyadType, TriadType, SeventhChordType, ExtendedChordType, ModeType, InversionType, TuningId, FretCount, CAGEDShape } from './types/music'
import { Fretboard } from './components/Fretboard/Fretboard'
import { Controls } from './components/Controls/Controls'
import { KeyReference } from './components/KeyReference/KeyReference'
import { ChordVoicings } from './components/ChordVoicings/ChordVoicings'
import { CircleOfFifths } from './components/CircleOfFifths/CircleOfFifths'
import { TUNINGS } from './utils/music'
import styles from './App.module.css'

function App() {
  const [rootNote, setRootNote] = useState<Note>('C')
  const [chordRoot, setChordRoot] = useState<Note>('C') // Separate root for chord display
  const [showAllNotes, setShowAllNotes] = useState(false)
  const [showDegrees, setShowDegrees] = useState(false)
  const [selectedIntervals, setSelectedIntervals] = useState<SelectedIntervals>([])
  const [scaleType, setScaleType] = useState<ScaleType>('none')
  const [dyadType, setDyadType] = useState<DyadType>('none')
  const [triadType, setTriadType] = useState<TriadType>('none')
  const [seventhChordType, setSeventhChordType] = useState<SeventhChordType>('none')
  const [extendedChordType, setExtendedChordType] = useState<ExtendedChordType>('none')
  const [modeType, setModeType] = useState<ModeType>('none')
  const [inversionType, setInversionType] = useState<InversionType>('root')
  const [tuningId, setTuningId] = useState<TuningId>('e_standard')
  const [showReference, setShowReference] = useState(false)
  const [fretCount, setFretCount] = useState<FretCount>(12)
  const [showCAGED, setShowCAGED] = useState(false)
  const [cagedShape, setCagedShape] = useState<CAGEDShape | 'all'>('all')

  // Clear chords when selecting a scale
  const clearChords = () => {
    setDyadType('none')
    setTriadType('none')
    setSeventhChordType('none')
    setExtendedChordType('none')
    setInversionType('root')
    setChordRoot(rootNote) // Reset chord root to key root
  }

  // Clear scales when selecting a chord
  const clearScales = () => {
    setScaleType('none')
    setModeType('none')
  }

  // Wrapped setters with mutual exclusivity
  const handleScaleTypeChange = (scale: ScaleType) => {
    if (scale !== 'none') {
      clearChords()
      setModeType('none') // Only one scale at a time
    }
    setScaleType(scale)
  }

  const handleModeTypeChange = (mode: ModeType) => {
    if (mode !== 'none') {
      clearChords()
      setScaleType('none') // Only one scale/mode at a time
    }
    setModeType(mode)
  }

  const handleDyadTypeChange = (dyad: DyadType) => {
    if (dyad !== 'none') {
      clearScales()
      setTriadType('none')
      setSeventhChordType('none')
      setExtendedChordType('none')
      setChordRoot(rootNote) // Use key root for new chord
    }
    setDyadType(dyad)
  }

  const handleTriadTypeChange = (triad: TriadType) => {
    if (triad !== 'none') {
      clearScales()
      setDyadType('none')
      setSeventhChordType('none')
      setExtendedChordType('none')
      setChordRoot(rootNote) // Use key root for new chord
    }
    setTriadType(triad)
  }

  const handleSeventhChordTypeChange = (chord: SeventhChordType) => {
    if (chord !== 'none') {
      clearScales()
      setDyadType('none')
      setTriadType('none')
      setExtendedChordType('none')
      setChordRoot(rootNote) // Use key root for new chord
    }
    setSeventhChordType(chord)
  }

  const handleExtendedChordTypeChange = (chord: ExtendedChordType) => {
    if (chord !== 'none') {
      clearScales()
      setDyadType('none')
      setTriadType('none')
      setSeventhChordType('none')
      setChordRoot(rootNote) // Use key root for new chord
    }
    setExtendedChordType(chord)
  }

  // Reset section handlers (preserve root note)
  const handleResetScales = () => {
    setScaleType('none')
    setModeType('none')
  }

  const handleResetChords = () => {
    setDyadType('none')
    setTriadType('none')
    setSeventhChordType('none')
    setExtendedChordType('none')
    setInversionType('root')
    setChordRoot(rootNote)
  }

  // Sync chordRoot when rootNote changes
  const handleRootNoteChange = (note: Note) => {
    setRootNote(note)
    setChordRoot(note) // Keep chord root in sync with key root
  }

  const handleReset = () => {
    setRootNote('C')
    setChordRoot('C')
    setShowAllNotes(false)
    setShowDegrees(false)
    setSelectedIntervals([])
    setScaleType('none')
    setDyadType('none')
    setTriadType('none')
    setSeventhChordType('none')
    setExtendedChordType('none')
    setModeType('none')
    setInversionType('root')
    setTuningId('e_standard')
    setShowReference(false)
    setFretCount(12)
    setShowCAGED(false)
    setCagedShape('all')
  }

  const currentTuning = TUNINGS[tuningId]
  const referenceTuning = TUNINGS['e_standard']

  // Handle chord selection from KeyReference (keeps rootNote, only changes chord)
  const handleChordSelect = (selectedChordRoot: Note, quality: TriadType) => {
    setChordRoot(selectedChordRoot) // Only change chord root, not key root
    setTriadType(quality)
    // Clear other chord types to focus on the selected triad
    setDyadType('none')
    setSeventhChordType('none')
    setExtendedChordType('none')
    clearScales()
    setInversionType('root')
  }

  
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Neck Learner</h1>
        <p className={styles.subtitle}>Learn the guitar fretboard</p>
      </header>

      <main className={styles.main}>
        <Controls
          rootNote={rootNote}
          onRootNoteChange={handleRootNoteChange}
          showAllNotes={showAllNotes}
          onShowAllNotesChange={setShowAllNotes}
          showDegrees={showDegrees}
          onShowDegreesChange={setShowDegrees}
          selectedIntervals={selectedIntervals}
          onSelectedIntervalsChange={setSelectedIntervals}
          scaleType={scaleType}
          onScaleTypeChange={handleScaleTypeChange}
          dyadType={dyadType}
          onDyadTypeChange={handleDyadTypeChange}
          triadType={triadType}
          onTriadTypeChange={handleTriadTypeChange}
          seventhChordType={seventhChordType}
          onSeventhChordTypeChange={handleSeventhChordTypeChange}
          extendedChordType={extendedChordType}
          onExtendedChordTypeChange={handleExtendedChordTypeChange}
          modeType={modeType}
          onModeTypeChange={handleModeTypeChange}
          inversionType={inversionType}
          onInversionTypeChange={setInversionType}
          tuningId={tuningId}
          onTuningChange={setTuningId}
          showReference={showReference}
          onShowReferenceChange={setShowReference}
          fretCount={fretCount}
          onFretCountChange={setFretCount}
          showCAGED={showCAGED}
          onShowCAGEDChange={setShowCAGED}
          cagedShape={cagedShape}
          onCagedShapeChange={setCagedShape}
          onReset={handleReset}
          onResetScales={handleResetScales}
          onResetChords={handleResetChords}
        />

        <KeyReference
          rootNote={rootNote}
          selectedChordRoot={chordRoot}
          selectedTriadType={triadType}
          onChordSelect={handleChordSelect}
        />

        {showReference && tuningId !== 'e_standard' && (
          <Fretboard
            rootNote={rootNote}
            chordRoot={chordRoot}
            showAllNotes={showAllNotes}
            showDegrees={showDegrees}
            selectedIntervals={selectedIntervals}
            scaleType={scaleType}
            dyadType={dyadType}
            triadType={triadType}
            seventhChordType={seventhChordType}
            extendedChordType={extendedChordType}
            modeType={modeType}
            inversionType={inversionType}
            tuning={referenceTuning.notes}
            fretCount={fretCount}
            showCAGED={showCAGED}
            cagedShape={cagedShape}
            label="E Standard (Reference)"
            compact
          />
        )}

        <Fretboard
          rootNote={rootNote}
          chordRoot={chordRoot}
          showAllNotes={showAllNotes}
          showDegrees={showDegrees}
          selectedIntervals={selectedIntervals}
          scaleType={scaleType}
          dyadType={dyadType}
          triadType={triadType}
          seventhChordType={seventhChordType}
          extendedChordType={extendedChordType}
          modeType={modeType}
          inversionType={inversionType}
          tuning={currentTuning.notes}
          fretCount={fretCount}
          showCAGED={showCAGED}
          cagedShape={cagedShape}
          label={tuningId !== 'e_standard' ? currentTuning.name : undefined}
        />

        <ChordVoicings
          rootNote={chordRoot}
          triadType={triadType}
          seventhChordType={seventhChordType}
        />

        <CircleOfFifths
          selectedRoot={rootNote}
          onRootSelect={setRootNote}
          onScaleTypeChange={setScaleType}
        />
      </main>
    </div>
  )
}

export default App
