import { useState } from 'react'
import { Note, IntervalDisplayMode, ScaleType, TriadType, SeventhChordType, ExtendedChordType, ModeType, InversionType, TuningId } from './types/music'
import { Fretboard } from './components/Fretboard/Fretboard'
import { Controls } from './components/Controls/Controls'
import { KeyReference } from './components/KeyReference/KeyReference'
import { CircleOfFifths } from './components/CircleOfFifths/CircleOfFifths'
import { TUNINGS } from './utils/music'
import styles from './App.module.css'

function App() {
  const [rootNote, setRootNote] = useState<Note>('C')
  const [showAllNotes, setShowAllNotes] = useState(false)
  const [intervalDisplayMode, setIntervalDisplayMode] = useState<IntervalDisplayMode>('none')
  const [scaleType, setScaleType] = useState<ScaleType>('none')
  const [triadType, setTriadType] = useState<TriadType>('none')
  const [seventhChordType, setSeventhChordType] = useState<SeventhChordType>('none')
  const [extendedChordType, setExtendedChordType] = useState<ExtendedChordType>('none')
  const [modeType, setModeType] = useState<ModeType>('none')
  const [inversionType, setInversionType] = useState<InversionType>('root')
  const [tuningId, setTuningId] = useState<TuningId>('e_standard')
  const [showReference, setShowReference] = useState(false)

  const handleReset = () => {
    setRootNote('C')
    setShowAllNotes(false)
    setIntervalDisplayMode('none')
    setScaleType('none')
    setTriadType('none')
    setSeventhChordType('none')
    setExtendedChordType('none')
    setModeType('none')
    setInversionType('root')
    setTuningId('e_standard')
    setShowReference(false)
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
          intervalDisplayMode={intervalDisplayMode}
          onIntervalDisplayModeChange={setIntervalDisplayMode}
          scaleType={scaleType}
          onScaleTypeChange={setScaleType}
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
          onReset={handleReset}
        />

        <KeyReference rootNote={rootNote} />

        {showReference && tuningId !== 'e_standard' && (
          <Fretboard
            rootNote={rootNote}
            showAllNotes={showAllNotes}
            intervalDisplayMode={intervalDisplayMode}
            scaleType={scaleType}
            triadType={triadType}
            seventhChordType={seventhChordType}
            extendedChordType={extendedChordType}
            modeType={modeType}
            inversionType={inversionType}
            tuning={referenceTuning.notes}
            label="E Standard (Reference)"
            compact
          />
        )}

        <Fretboard
          rootNote={rootNote}
          showAllNotes={showAllNotes}
          intervalDisplayMode={intervalDisplayMode}
          scaleType={scaleType}
          triadType={triadType}
          seventhChordType={seventhChordType}
          extendedChordType={extendedChordType}
          modeType={modeType}
          inversionType={inversionType}
          tuning={currentTuning.notes}
          label={tuningId !== 'e_standard' ? currentTuning.name : undefined}
        />

        <CircleOfFifths
          selectedRoot={rootNote}
          onRootSelect={setRootNote}
        />
      </main>
    </div>
  )
}

export default App
