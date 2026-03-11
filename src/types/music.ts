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

export type ScaleType = 'none' | 'major' | 'natural_minor' | 'harmonic_minor' | 'melodic_minor'

export type TriadType = 'none' | 'major' | 'minor' | 'diminished' | 'augmented'

export type SeventhChordType = 'none' | 'major7' | 'minor7' | 'dominant7' | 'diminished7' | 'half_diminished7'

export type ExtendedChordType = 'none'
  | 'major9' | 'minor9' | 'dominant9'
  | 'major11' | 'minor11' | 'dominant11'
  | 'major13' | 'minor13' | 'dominant13'

export type ModeType = 'none' | 'ionian' | 'dorian' | 'phrygian' | 'lydian' | 'mixolydian' | 'aeolian' | 'locrian'

export type InversionType = 'root' | 'first' | 'second' | 'third'

export type TuningId = 'e_standard' | 'd_standard' | 'c_standard' | 'b_standard' | 'a_standard'

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
