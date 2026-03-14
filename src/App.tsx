import { useState } from 'react'
import { Note, SelectedIntervals, ScaleType, DyadType, TriadType, SeventhChordType, ExtendedChordType, ModeType, InversionType, TuningId, FretCount } from './types/music'
import { Fretboard } from './components/Fretboard/Fretboard'
import { Controls } from './components/Controls/Controls'
import { KeyReference } from './components/KeyReference/KeyReference'
import { CircleOfFifths } from './components/CircleOfFifths/CircleOfFifths'
import { TUNINGS } from './utils/music'
import styles from './App.module.css'

function App() {
  const [rootNote, setRootNote] = useState<Note>('C')
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

  const handleReset = () => {
    setRootNote('C')
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
  }

  const currentTuning = TUNINGS[tuningId]
  const referenceTuning = TUNINGS['e_standard']

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Neck Learner</h1>
        <p className={styles.subtitle}>Learn the guitar fretboard</p>
      </header>

      <main className={styles.main}>
        <Controls
          rootNote={rootNote}
          onRootNoteChange={setRootNote}
          showAllNotes={showAllNotes}
          onShowAllNotesChange={setShowAllNotes}
          showDegrees={showDegrees}
          onShowDegreesChange={setShowDegrees}
          selectedIntervals={selectedIntervals}
          onSelectedIntervalsChange={setSelectedIntervals}
          scaleType={scaleType}
          onScaleTypeChange={setScaleType}
          dyadType={dyadType}
          onDyadTypeChange={setDyadType}
          triadType={triadType}
          onTriadTypeChange={setTriadType}
          seventhChordType={seventhChordType}
          onSeventhChordTypeChange={setSeventhChordType}
          extendedChordType={extendedChordType}
          onExtendedChordTypeChange={setExtendedChordType}
          modeType={modeType}
          onModeTypeChange={setModeType}
          inversionType={inversionType}
          onInversionTypeChange={setInversionType}
          tuningId={tuningId}
          onTuningChange={setTuningId}
          showReference={showReference}
          onShowReferenceChange={setShowReference}
          fretCount={fretCount}
          onFretCountChange={setFretCount}
          onReset={handleReset}
        />

        <KeyReference rootNote={rootNote} />

        {showReference && tuningId !== 'e_standard' && (
          <Fretboard
            rootNote={rootNote}
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
            label="E Standard (Reference)"
            compact
          />
        )}

        <Fretboard
          rootNote={rootNote}
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
          label={tuningId !== 'e_standard' ? currentTuning.name : undefined}
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
