import { Note, IntervalDisplayMode, ScaleType, TriadType, SeventhChordType, ExtendedChordType, ModeType, InversionType, TuningId } from '../../types/music'
import { NOTES, INTERVALS, INTERVAL_LABELS, SCALE_TYPES, SCALE_LABELS, TRIAD_TYPES, TRIAD_LABELS, SEVENTH_CHORD_TYPES, SEVENTH_CHORD_LABELS, EXTENDED_CHORD_TYPES, EXTENDED_CHORD_LABELS, MODE_TYPES, MODE_LABELS, INVERSION_TYPES, INVERSION_LABELS, TUNINGS, TUNING_IDS, supportsInversion } from '../../utils/music'
import styles from './Controls.module.css'

interface ControlsProps {
  rootNote: Note
  onRootNoteChange: (note: Note) => void
  showAllNotes: boolean
  onShowAllNotesChange: (show: boolean) => void
  intervalDisplayMode: IntervalDisplayMode
  onIntervalDisplayModeChange: (mode: IntervalDisplayMode) => void
  scaleType: ScaleType
  onScaleTypeChange: (scale: ScaleType) => void
  triadType: TriadType
  onTriadTypeChange: (triad: TriadType) => void
  seventhChordType: SeventhChordType
  onSeventhChordTypeChange: (chord: SeventhChordType) => void
  extendedChordType: ExtendedChordType
  onExtendedChordTypeChange: (chord: ExtendedChordType) => void
  modeType: ModeType
  onModeTypeChange: (mode: ModeType) => void
  inversionType: InversionType
  onInversionTypeChange: (inversion: InversionType) => void
  tuningId: TuningId
  onTuningChange: (tuning: TuningId) => void
  showReference: boolean
  onShowReferenceChange: (show: boolean) => void
  onReset: () => void
}

export function Controls({
  rootNote,
  onRootNoteChange,
  showAllNotes,
  onShowAllNotesChange,
  intervalDisplayMode,
  onIntervalDisplayModeChange,
  scaleType,
  onScaleTypeChange,
  triadType,
  onTriadTypeChange,
  seventhChordType,
  onSeventhChordTypeChange,
  extendedChordType,
  onExtendedChordTypeChange,
  modeType,
  onModeTypeChange,
  inversionType,
  onInversionTypeChange,
  tuningId,
  onTuningChange,
  showReference,
  onShowReferenceChange,
  onReset,
}: ControlsProps) {
  const hasChord = triadType !== 'none' || seventhChordType !== 'none' || extendedChordType !== 'none'
  return (
    <div className={styles.controls}>
      <div className={styles.section}>
        <span className={styles.sectionTitle}>Tuning</span>
        <label className={styles.label}>
          <select
            className={styles.select}
            value={tuningId}
            onChange={(e) => onTuningChange(e.target.value as TuningId)}
          >
            {TUNING_IDS.map((id) => (
              <option key={id} value={id}>
                {TUNINGS[id].name}
              </option>
            ))}
          </select>
        </label>
        {tuningId !== 'e_standard' && (
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={showReference}
              onChange={(e) => onShowReferenceChange(e.target.checked)}
              className={styles.checkbox}
            />
            Compare with E Standard
          </label>
        )}
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <span className={styles.sectionTitle}>Root Note</span>
        <label className={styles.label}>
          <select
            className={styles.select}
            value={rootNote}
            onChange={(e) => onRootNoteChange(e.target.value as Note)}
          >
            {NOTES.map((note) => (
              <option key={note} value={note}>
                {note}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={showAllNotes}
            onChange={(e) => onShowAllNotesChange(e.target.checked)}
            className={styles.checkbox}
          />
          Show all notes
        </label>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <span className={styles.sectionTitle}>Scales</span>
        <label className={styles.label}>
          Scale:
          <select
            className={styles.select}
            value={scaleType}
            onChange={(e) => onScaleTypeChange(e.target.value as ScaleType)}
          >
            <option value="none">None</option>
            {SCALE_TYPES.map((scale) => (
              <option key={scale} value={scale}>
                {SCALE_LABELS[scale]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <span className={styles.sectionTitle}>Triads</span>
        <label className={styles.label}>
          Triad:
          <select
            className={styles.select}
            value={triadType}
            onChange={(e) => onTriadTypeChange(e.target.value as TriadType)}
          >
            <option value="none">None</option>
            {TRIAD_TYPES.map((triad) => (
              <option key={triad} value={triad}>
                {TRIAD_LABELS[triad]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <span className={styles.sectionTitle}>7th Chords</span>
        <label className={styles.label}>
          7th Chord:
          <select
            className={styles.select}
            value={seventhChordType}
            onChange={(e) => onSeventhChordTypeChange(e.target.value as SeventhChordType)}
          >
            <option value="none">None</option>
            {SEVENTH_CHORD_TYPES.map((chord) => (
              <option key={chord} value={chord}>
                {SEVENTH_CHORD_LABELS[chord]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <span className={styles.sectionTitle}>Extended Chords</span>
        <label className={styles.label}>
          Extended:
          <select
            className={styles.select}
            value={extendedChordType}
            onChange={(e) => onExtendedChordTypeChange(e.target.value as ExtendedChordType)}
          >
            <option value="none">None</option>
            {EXTENDED_CHORD_TYPES.map((chord) => (
              <option key={chord} value={chord}>
                {EXTENDED_CHORD_LABELS[chord]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <span className={styles.sectionTitle}>Inversions</span>
        <label className={styles.label}>
          Inversion:
          <select
            className={styles.select}
            value={inversionType}
            onChange={(e) => onInversionTypeChange(e.target.value as InversionType)}
            disabled={!hasChord}
          >
            {INVERSION_TYPES.map((inv) => (
              <option
                key={inv}
                value={inv}
                disabled={!supportsInversion(inv, triadType, seventhChordType, extendedChordType)}
              >
                {INVERSION_LABELS[inv]}
              </option>
            ))}
          </select>
        </label>
        {!hasChord && (
          <span className={styles.hint}>Select a chord to use inversions</span>
        )}
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <span className={styles.sectionTitle}>Modes</span>
        <label className={styles.label}>
          Mode:
          <select
            className={styles.select}
            value={modeType}
            onChange={(e) => onModeTypeChange(e.target.value as ModeType)}
          >
            <option value="none">None</option>
            {MODE_TYPES.map((mode) => (
              <option key={mode} value={mode}>
                {MODE_LABELS[mode]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <span className={styles.sectionTitle}>Intervals</span>
        <label className={styles.label}>
          Interval:
          <select
            className={styles.select}
            value={intervalDisplayMode}
            onChange={(e) => onIntervalDisplayModeChange(e.target.value as IntervalDisplayMode)}
          >
            <option value="none">None</option>
            {INTERVALS.map((interval) => (
              <option key={interval} value={interval}>
                {INTERVAL_LABELS[interval]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.divider} />

      <button className={styles.resetButton} onClick={onReset}>
        Reset
      </button>
    </div>
  )
}
