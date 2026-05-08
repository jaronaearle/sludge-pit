import { useState } from "react";
import {
  Note,
  SelectedIntervals,
  ScaleType,
  DyadType,
  TriadType,
  SeventhChordType,
  ExtendedChordType,
  ModeType,
  InversionType,
  TuningId,
  FretCount,
  CAGEDShape,
  ScalePosition,
  StringNumber,
} from "../../types/music";

// Note: ScalePosition, StringNumber, and getScalePositionCount are kept for future scale position feature
import {
  NOTES,
  INTERVALS,
  INTERVAL_LABELS,
  SCALE_TYPES,
  SCALE_LABELS,
  DYAD_TYPES,
  DYAD_LABELS,
  TRIAD_TYPES,
  TRIAD_LABELS,
  SEVENTH_CHORD_TYPES,
  SEVENTH_CHORD_LABELS,
  EXTENDED_CHORD_TYPES,
  EXTENDED_CHORD_LABELS,
  MODE_TYPES,
  MODE_LABELS,
  INVERSION_TYPES,
  INVERSION_LABELS,
  TUNINGS,
  TUNING_IDS,
  supportsInversion,
  CAGED_SHAPE_ORDER,
  CAGED_SHAPES,
  getNoteDisplay,
  // getScalePositionCount, // Hidden for now - scale position feature
} from "../../utils/music";
import { CollapsibleSection } from "../CollapsibleSection/CollapsibleSection";
import { ChordProgressions } from "../ChordProgressions/ChordProgressions";
import { NotationGuide } from "../NotationGuide/NotationGuide";
import { ModePlayer } from "../ModePlayer/ModePlayer";
import styles from "./Controls.module.css";

interface ControlsProps {
  rootNote: Note;
  onRootNoteChange: (note: Note) => void;
  showAllNotes: boolean;
  onShowAllNotesChange: (show: boolean) => void;
  showDegrees: boolean;
  onShowDegreesChange: (show: boolean) => void;
  selectedIntervals: SelectedIntervals;
  onSelectedIntervalsChange: (intervals: SelectedIntervals) => void;
  scaleType: ScaleType;
  onScaleTypeChange: (scale: ScaleType) => void;
  dyadType: DyadType;
  onDyadTypeChange: (dyad: DyadType) => void;
  triadType: TriadType;
  onTriadTypeChange: (triad: TriadType) => void;
  seventhChordType: SeventhChordType;
  onSeventhChordTypeChange: (chord: SeventhChordType) => void;
  extendedChordType: ExtendedChordType;
  onExtendedChordTypeChange: (chord: ExtendedChordType) => void;
  modeType: ModeType;
  onModeTypeChange: (mode: ModeType) => void;
  inversionType: InversionType;
  onInversionTypeChange: (inversion: InversionType) => void;
  tuningId: TuningId;
  onTuningChange: (tuning: TuningId) => void;
  showReference: boolean;
  onShowReferenceChange: (show: boolean) => void;
  fretCount: FretCount;
  onFretCountChange: (count: FretCount) => void;
  showCAGED: boolean;
  onShowCAGEDChange: (show: boolean) => void;
  cagedShape: CAGEDShape | 'all';
  onCagedShapeChange: (shape: CAGEDShape | 'all') => void;
  scalePosition: ScalePosition;
  onScalePositionChange: (position: ScalePosition) => void;
  singleStringMode: boolean;
  onSingleStringModeChange: (enabled: boolean) => void;
  selectedString: StringNumber;
  onSelectedStringChange: (stringNum: StringNumber) => void;
  onReset: () => void;
  onResetScales: () => void;
  onResetChords: () => void;
  onChordSelect: (chordRoot: Note, quality: TriadType) => void;
  chordProgressionsResetKey: number;
  practiceActive: boolean;
  onPracticeModeChange: (active: boolean) => void;
}

export function Controls({
  rootNote,
  onRootNoteChange,
  showAllNotes,
  onShowAllNotesChange,
  showDegrees,
  onShowDegreesChange,
  selectedIntervals,
  onSelectedIntervalsChange,
  scaleType,
  onScaleTypeChange,
  dyadType,
  onDyadTypeChange,
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
  fretCount,
  onFretCountChange,
  showCAGED,
  onShowCAGEDChange,
  cagedShape,
  onCagedShapeChange,
  scalePosition: _scalePosition,
  onScalePositionChange: _onScalePositionChange,
  singleStringMode,
  onSingleStringModeChange,
  selectedString,
  onSelectedStringChange,
  onReset,
  onResetScales,
  onResetChords,
  onChordSelect,
  chordProgressionsResetKey,
  practiceActive,
  onPracticeModeChange,
}: ControlsProps) {
  const [showNotationGuide, setShowNotationGuide] = useState(false);

  const hasChord =
    triadType !== "none" ||
    seventhChordType !== "none" ||
    extendedChordType !== "none";

  return (
    <div className={styles.controls}>
      {/* Top Level - Always Visible */}
      <div className={styles.topSection}>
        <div className={styles.topRow}>
          <div className={styles.group}>
            <label className={styles.label}>
              Root:
              <select
                className={styles.select}
                value={rootNote}
                onChange={(e) => onRootNoteChange(e.target.value as Note)}
              >
                {NOTES.map((note) => (
                  <option key={note} value={note}>
                    {getNoteDisplay(note)}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.label}>
              Tuning:
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

            <label
              className={`${styles.checkboxLabel} ${tuningId === "e_standard" ? styles.disabled : ""}`}
            >
              <input
                type="checkbox"
                checked={showReference}
                onChange={(e) => onShowReferenceChange(e.target.checked)}
                className={styles.checkbox}
                disabled={tuningId === "e_standard"}
              />
              Compare to E standard
            </label>

            <label className={styles.label}>
              Frets:
              <select
                className={styles.selectSmall}
                value={fretCount}
                onChange={(e) =>
                  onFretCountChange(Number(e.target.value) as FretCount)
                }
              >
                <option value={12}>12</option>
                <option value={18}>18</option>
              </select>
            </label>

            <label className={styles.label}>
              String:
              <select
                className={styles.selectSmall}
                value={singleStringMode ? selectedString : 0}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val === 0) {
                    onSingleStringModeChange(false);
                  } else {
                    onSingleStringModeChange(true);
                    onSelectedStringChange(val as StringNumber);
                  }
                }}
              >
                <option value={0}>All</option>
                {([6, 5, 4, 3, 2, 1] as StringNumber[]).map((str) => {
                  const tuningNotes = TUNINGS[tuningId].notes;
                  const note = tuningNotes[6 - str];
                  return (
                    <option key={str} value={str}>
                      {str} ({getNoteDisplay(note)})
                    </option>
                  );
                })}
              </select>
            </label>
          </div>

          <div className={styles.group}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={showAllNotes}
                onChange={(e) => onShowAllNotesChange(e.target.checked)}
                className={styles.checkbox}
              />
              Show all notes
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={showDegrees}
                onChange={(e) => onShowDegreesChange(e.target.checked)}
                className={styles.checkbox}
              />
              Show degrees
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={showCAGED}
                onChange={(e) => onShowCAGEDChange(e.target.checked)}
                className={styles.checkbox}
              />
              CAGED
            </label>

            {showCAGED && (
              <select
                className={styles.selectSmall}
                value={cagedShape}
                onChange={(e) =>
                  onCagedShapeChange(e.target.value as CAGEDShape | 'all')
                }
              >
                <option value="all">All</option>
                {CAGED_SHAPE_ORDER.map((shape) => (
                  <option key={shape} value={shape} style={{ color: CAGED_SHAPES[shape].color }}>
                    {shape}
                  </option>
                ))}
              </select>
            )}

            <button
              className={styles.guideButton}
              onClick={() => setShowNotationGuide(true)}
            >
              Notation Guide
            </button>

            <button className={styles.resetButton} onClick={onReset}>
              Reset
            </button>
          </div>
        </div>
      </div>

      <NotationGuide
        isOpen={showNotationGuide}
        onClose={() => setShowNotationGuide(false)}
      />

      {/* Collapsible Sections */}
      <div className={styles.sections}>
        <CollapsibleSection title="Scales & Modes" defaultOpen={true}>
          <div className={styles.sectionContent}>
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

            {(scaleType !== 'none' || modeType !== 'none') && (
              <button className={styles.sectionResetButton} onClick={onResetScales}>
                Clear
              </button>
            )}
          </div>
          {modeType !== 'none' && (
            <ModePlayer
              modeType={modeType}
              selectedString={selectedString}
              onModeTypeChange={onModeTypeChange}
              onSingleStringModeChange={onSingleStringModeChange}
              onSelectedStringChange={onSelectedStringChange}
              onPracticeModeChange={onPracticeModeChange}
            />
          )}
        </CollapsibleSection>

        {!practiceActive && <CollapsibleSection title="Chords & Dyads" defaultOpen={false}>
          <div className={styles.sectionContent}>
            <label className={styles.label}>
              Dyad:
              <select
                className={styles.select}
                value={dyadType}
                onChange={(e) => onDyadTypeChange(e.target.value as DyadType)}
              >
                <option value="none">None</option>
                {DYAD_TYPES.map((dyad) => (
                  <option key={dyad} value={dyad}>
                    {DYAD_LABELS[dyad]}
                  </option>
                ))}
              </select>
            </label>

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

            <label className={styles.label}>
              7th Chord:
              <select
                className={styles.select}
                value={seventhChordType}
                onChange={(e) =>
                  onSeventhChordTypeChange(e.target.value as SeventhChordType)
                }
              >
                <option value="none">None</option>
                {SEVENTH_CHORD_TYPES.map((chord) => (
                  <option key={chord} value={chord}>
                    {SEVENTH_CHORD_LABELS[chord]}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.label}>
              Extended:
              <select
                className={styles.select}
                value={extendedChordType}
                onChange={(e) =>
                  onExtendedChordTypeChange(e.target.value as ExtendedChordType)
                }
              >
                <option value="none">None</option>
                {EXTENDED_CHORD_TYPES.map((chord) => (
                  <option key={chord} value={chord}>
                    {EXTENDED_CHORD_LABELS[chord]}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.label}>
              Inversion:
              <select
                className={styles.select}
                value={inversionType}
                onChange={(e) =>
                  onInversionTypeChange(e.target.value as InversionType)
                }
                disabled={!hasChord}
              >
                {INVERSION_TYPES.map((inv) => (
                  <option
                    key={inv}
                    value={inv}
                    disabled={
                      !supportsInversion(
                        inv,
                        triadType,
                        seventhChordType,
                        extendedChordType,
                      )
                    }
                  >
                    {INVERSION_LABELS[inv]}
                  </option>
                ))}
              </select>
            </label>
            {!hasChord && (
              <span className={styles.hint}>
                Select a chord to use inversions
              </span>
            )}
            {hasChord && (
              <button className={styles.sectionResetButton} onClick={onResetChords}>
                Clear
              </button>
            )}
          </div>
        </CollapsibleSection>}

        {!practiceActive && <CollapsibleSection title="Intervals" defaultOpen={false}>
          <div className={styles.sectionContent}>
            <div className={styles.intervalCheckboxes}>
              {INTERVALS.map((interval) => {
                const isChecked = selectedIntervals.includes(interval);
                const handleChange = () => {
                  if (isChecked) {
                    onSelectedIntervalsChange(
                      selectedIntervals.filter((i) => i !== interval)
                    );
                  } else {
                    onSelectedIntervalsChange([...selectedIntervals, interval]);
                  }
                };
                return (
                  <label key={interval} className={styles.intervalCheckbox}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={handleChange}
                      className={styles.checkbox}
                    />
                    {INTERVAL_LABELS[interval]}
                  </label>
                );
              })}
            </div>
            {selectedIntervals.length > 0 && (
              <button
                className={styles.clearButton}
                onClick={() => onSelectedIntervalsChange([])}
              >
                Clear All
              </button>
            )}
          </div>
        </CollapsibleSection>}

        {!practiceActive && <ChordProgressions key={chordProgressionsResetKey} rootNote={rootNote} onChordSelect={onChordSelect} />}
      </div>
    </div>
  );
}
