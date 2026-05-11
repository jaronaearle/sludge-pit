export type Note = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B'

export type Interval =
  | 'unison'
  | 'minor2nd'
  | 'major2nd'
  | 'minor3rd'
  | 'major3rd'
  | 'perfect4th'
  | 'tritone'
  | 'perfect5th'
  | 'minor6th'
  | 'major6th'
  | 'minor7th'
  | 'major7th'

export type NoteDisplayMode = 'all' | Note

export type IntervalDisplayMode = 'none' | Interval

// For multiple interval selection
export type SelectedIntervals = Interval[]

export type ScaleType = 'none' | 'major' | 'natural_minor' | 'harmonic_minor' | 'melodic_minor' | 'pentatonic_major' | 'pentatonic_minor' | 'blues'

export type DyadType = 'none' | 'minor_2nd' | 'major_2nd' | 'minor_3rd' | 'major_3rd' | 'perfect_4th' | 'tritone' | 'perfect_5th' | 'minor_6th' | 'major_6th' | 'minor_7th' | 'major_7th' | 'octave'

export type TriadType = 'none' | 'major' | 'minor' | 'diminished' | 'augmented' | 'sus2' | 'sus4'

export type SeventhChordType = 'none'
  | 'major7' | 'minor7' | 'dominant7' | 'diminished7' | 'half_diminished7'
  | 'minMaj7' | 'aug7' | '7sus4' | '7b5'

export type ExtendedChordType = 'none'
  | 'major9' | 'minor9' | 'dominant9'
  | 'major11' | 'minor11' | 'dominant11'
  | 'major13' | 'minor13' | 'dominant13'
  | 'add9' | 'madd9' | '6' | 'm6' | '7sharp9'

export type ModeType = 'none' | 'ionian' | 'dorian' | 'phrygian' | 'lydian' | 'mixolydian' | 'aeolian' | 'locrian'

export type InversionType = 'root' | 'first' | 'second' | 'third'

export type InstrumentType = 'guitar' | 'bass'

export type TuningId =
  | 'e_standard' | 'd_standard' | 'c_standard' | 'b_standard' | 'a_standard'
  | 'bass_standard' | 'bass_bb_standard' | 'bass_d_standard' | 'bass_c_standard' | 'bass_b_standard'

export interface Tuning {
  id: TuningId
  name: string
  notes: Note[]
}

export interface FretPosition {
  string: number
  fret: number
  note: Note
}

export type FretCount = 12 | 18

export type CAGEDShape = 'C' | 'A' | 'G' | 'E' | 'D'

// Scale position (1-7 for 7-note scales, 1-5 for pentatonic/blues)
export type ScalePosition = 'all' | 1 | 2 | 3 | 4 | 5 | 6 | 7

// String number (1 = high E, 6 = low E)
export type StringNumber = 1 | 2 | 3 | 4 | 5 | 6

// Chord Progressions
export type ProgressionCategory = 'classical' | 'modern'
export type ProgressionKeyType = 'major' | 'minor'

export interface ChordInProgression {
  numeral: string        // "I", "IV", "vi", "bVII", etc.
  quality: TriadType     // The chord quality
  scaleDegree: number    // 1-7 (or modified for borrowed chords)
  borrowed?: boolean     // Is this a borrowed chord?
}

export interface ChordProgression {
  id: string
  name: string                    // "Axis of Awesome", "50s Doo-Wop", etc.
  chords: ChordInProgression[]
  category: ProgressionCategory
  keyType: ProgressionKeyType
  startingNumeral: string         // "I", "vi", etc.
  description?: string            // Optional description/genre info
}
