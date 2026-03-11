import { Note, Interval, ScaleType, TriadType, SeventhChordType, ExtendedChordType, ModeType, InversionType, Tuning, TuningId } from '../types/music'

export const NOTES: Note[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

// Standard tuning: low E to high E (strings 6 to 1)
export const STANDARD_TUNING: Note[] = ['E', 'A', 'D', 'G', 'B', 'E']

// All available tunings
export const TUNINGS: Record<TuningId, Tuning> = {
  e_standard: { id: 'e_standard', name: 'E Standard', notes: ['E', 'A', 'D', 'G', 'B', 'E'] },
  d_standard: { id: 'd_standard', name: 'D Standard', notes: ['D', 'G', 'C', 'F', 'A', 'D'] },
  c_standard: { id: 'c_standard', name: 'C Standard', notes: ['C', 'F', 'A#', 'D#', 'G', 'C'] },
  b_standard: { id: 'b_standard', name: 'B Standard', notes: ['B', 'E', 'A', 'D', 'F#', 'B'] },
  a_standard: { id: 'a_standard', name: 'A#/Bb Standard', notes: ['A#', 'D#', 'G#', 'C#', 'F', 'A#'] },
}

export const TUNING_IDS: TuningId[] = ['e_standard', 'd_standard', 'c_standard', 'b_standard', 'a_standard']

export const FRET_COUNT = 12

export function getNoteAtFret(openNote: Note, fret: number): Note {
  const startIndex = NOTES.indexOf(openNote)
  const noteIndex = (startIndex + fret) % 12
  return NOTES[noteIndex]
}

export function getInterval(root: Note, note: Note): Interval {
  const rootIndex = NOTES.indexOf(root)
  const noteIndex = NOTES.indexOf(note)
  const semitones = (noteIndex - rootIndex + 12) % 12

  const intervals: Interval[] = [
    'unison',
    'minor2nd',
    'major2nd',
    'minor3rd',
    'major3rd',
    'perfect4th',
    'tritone',
    'perfect5th',
    'minor6th',
    'major6th',
    'minor7th',
    'major7th',
  ]

  return intervals[semitones]
}

export const INTERVAL_COLORS: Record<Interval, string> = {
  unison: '#ef4444',      // red
  minor2nd: '#f97316',    // orange
  major2nd: '#fb923c',    // light orange
  minor3rd: '#facc15',    // yellow
  major3rd: '#fde047',    // light yellow
  perfect4th: '#22c55e',  // green
  tritone: '#06b6d4',     // cyan
  perfect5th: '#3b82f6',  // blue
  minor6th: '#6366f1',    // indigo
  major6th: '#818cf8',    // light indigo
  minor7th: '#a855f7',    // purple
  major7th: '#c084fc',    // light purple
}

export const INTERVAL_LABELS: Record<Interval, string> = {
  unison: 'Root (Unison)',
  minor2nd: 'Minor 2nd',
  major2nd: 'Major 2nd',
  minor3rd: 'Minor 3rd',
  major3rd: 'Major 3rd',
  perfect4th: 'Perfect 4th',
  tritone: 'Tritone',
  perfect5th: 'Perfect 5th',
  minor6th: 'Minor 6th',
  major6th: 'Major 6th',
  minor7th: 'Minor 7th',
  major7th: 'Major 7th',
}

export const INTERVALS: Interval[] = [
  'unison',
  'minor2nd',
  'major2nd',
  'minor3rd',
  'major3rd',
  'perfect4th',
  'tritone',
  'perfect5th',
  'minor6th',
  'major6th',
  'minor7th',
  'major7th',
]

// Scale patterns as semitone intervals from root
// Each number represents semitones from the root note
export const SCALE_PATTERNS: Record<Exclude<ScaleType, 'none'>, number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11],           // W-W-H-W-W-W-H
  natural_minor: [0, 2, 3, 5, 7, 8, 10],   // W-H-W-W-H-W-W
  harmonic_minor: [0, 2, 3, 5, 7, 8, 11],  // W-H-W-W-H-WH-H
  melodic_minor: [0, 2, 3, 5, 7, 9, 11],   // W-H-W-W-W-W-H (ascending)
}

export const SCALE_LABELS: Record<Exclude<ScaleType, 'none'>, string> = {
  major: 'Major',
  natural_minor: 'Natural Minor',
  harmonic_minor: 'Harmonic Minor',
  melodic_minor: 'Melodic Minor',
}

export const SCALE_TYPES: Exclude<ScaleType, 'none'>[] = [
  'major',
  'natural_minor',
  'harmonic_minor',
  'melodic_minor',
]

export function getScaleNotes(root: Note, scaleType: Exclude<ScaleType, 'none'>): Note[] {
  const rootIndex = NOTES.indexOf(root)
  const pattern = SCALE_PATTERNS[scaleType]
  return pattern.map(semitones => NOTES[(rootIndex + semitones) % 12])
}

export function isNoteInScale(note: Note, root: Note, scaleType: Exclude<ScaleType, 'none'>): boolean {
  const scaleNotes = getScaleNotes(root, scaleType)
  return scaleNotes.includes(note)
}

export function getScaleDegree(note: Note, root: Note, scaleType: Exclude<ScaleType, 'none'>): number | null {
  const scaleNotes = getScaleNotes(root, scaleType)
  const index = scaleNotes.indexOf(note)
  return index === -1 ? null : index + 1
}

// Triad patterns as semitone intervals from root
export const TRIAD_PATTERNS: Record<Exclude<TriadType, 'none'>, number[]> = {
  major: [0, 4, 7],       // Root, Major 3rd, Perfect 5th
  minor: [0, 3, 7],       // Root, Minor 3rd, Perfect 5th
  diminished: [0, 3, 6],  // Root, Minor 3rd, Diminished 5th
  augmented: [0, 4, 8],   // Root, Major 3rd, Augmented 5th
}

export const TRIAD_LABELS: Record<Exclude<TriadType, 'none'>, string> = {
  major: 'Major',
  minor: 'Minor',
  diminished: 'Diminished',
  augmented: 'Augmented',
}

export const TRIAD_TYPES: Exclude<TriadType, 'none'>[] = [
  'major',
  'minor',
  'diminished',
  'augmented',
]

export function getTriadNotes(root: Note, triadType: Exclude<TriadType, 'none'>): Note[] {
  const rootIndex = NOTES.indexOf(root)
  const pattern = TRIAD_PATTERNS[triadType]
  return pattern.map(semitones => NOTES[(rootIndex + semitones) % 12])
}

export function isNoteInTriad(note: Note, root: Note, triadType: Exclude<TriadType, 'none'>): boolean {
  const triadNotes = getTriadNotes(root, triadType)
  return triadNotes.includes(note)
}

export function getTriadDegree(note: Note, root: Note, triadType: Exclude<TriadType, 'none'>): number | null {
  const triadNotes = getTriadNotes(root, triadType)
  const index = triadNotes.indexOf(note)
  return index === -1 ? null : index + 1
}

// Circle of fifths order
export const CIRCLE_OF_FIFTHS: Note[] = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F']

// Get relative minor for a major key
export function getRelativeMinor(majorRoot: Note): Note {
  const index = NOTES.indexOf(majorRoot)
  return NOTES[(index + 9) % 12] // 9 semitones down = 3 semitones up
}

// Get relative major for a minor key
export function getRelativeMajor(minorRoot: Note): Note {
  const index = NOTES.indexOf(minorRoot)
  return NOTES[(index + 3) % 12]
}

// Seventh chord patterns as semitone intervals from root
export const SEVENTH_CHORD_PATTERNS: Record<Exclude<SeventhChordType, 'none'>, number[]> = {
  major7: [0, 4, 7, 11],           // Root, Major 3rd, Perfect 5th, Major 7th
  minor7: [0, 3, 7, 10],           // Root, Minor 3rd, Perfect 5th, Minor 7th
  dominant7: [0, 4, 7, 10],        // Root, Major 3rd, Perfect 5th, Minor 7th
  diminished7: [0, 3, 6, 9],       // Root, Minor 3rd, Diminished 5th, Diminished 7th
  half_diminished7: [0, 3, 6, 10], // Root, Minor 3rd, Diminished 5th, Minor 7th (m7♭5)
}

export const SEVENTH_CHORD_LABELS: Record<Exclude<SeventhChordType, 'none'>, string> = {
  major7: 'Major 7th',
  minor7: 'Minor 7th',
  dominant7: 'Dominant 7th',
  diminished7: 'Diminished 7th',
  half_diminished7: 'Half-Diminished 7th (m7♭5)',
}

export const SEVENTH_CHORD_TYPES: Exclude<SeventhChordType, 'none'>[] = [
  'major7',
  'minor7',
  'dominant7',
  'diminished7',
  'half_diminished7',
]

export function getSeventhChordNotes(root: Note, chordType: Exclude<SeventhChordType, 'none'>): Note[] {
  const rootIndex = NOTES.indexOf(root)
  const pattern = SEVENTH_CHORD_PATTERNS[chordType]
  return pattern.map(semitones => NOTES[(rootIndex + semitones) % 12])
}

export function isNoteInSeventhChord(note: Note, root: Note, chordType: Exclude<SeventhChordType, 'none'>): boolean {
  const chordNotes = getSeventhChordNotes(root, chordType)
  return chordNotes.includes(note)
}

export function getSeventhChordDegree(note: Note, root: Note, chordType: Exclude<SeventhChordType, 'none'>): number | null {
  const chordNotes = getSeventhChordNotes(root, chordType)
  const index = chordNotes.indexOf(note)
  return index === -1 ? null : index + 1
}

// Mode patterns as semitone intervals from root
export const MODE_PATTERNS: Record<Exclude<ModeType, 'none'>, number[]> = {
  ionian: [0, 2, 4, 5, 7, 9, 11],     // Same as Major scale (W-W-H-W-W-W-H)
  dorian: [0, 2, 3, 5, 7, 9, 10],     // Minor with raised 6th (W-H-W-W-W-H-W)
  phrygian: [0, 1, 3, 5, 7, 8, 10],   // Minor with lowered 2nd (H-W-W-W-H-W-W)
  lydian: [0, 2, 4, 6, 7, 9, 11],     // Major with raised 4th (W-W-W-H-W-W-H)
  mixolydian: [0, 2, 4, 5, 7, 9, 10], // Major with lowered 7th (W-W-H-W-W-H-W)
  aeolian: [0, 2, 3, 5, 7, 8, 10],    // Same as Natural Minor (W-H-W-W-H-W-W)
  locrian: [0, 1, 3, 5, 6, 8, 10],    // Diminished scale (H-W-W-H-W-W-W)
}

export const MODE_LABELS: Record<Exclude<ModeType, 'none'>, string> = {
  ionian: 'Ionian (Major)',
  dorian: 'Dorian',
  phrygian: 'Phrygian',
  lydian: 'Lydian',
  mixolydian: 'Mixolydian',
  aeolian: 'Aeolian (Natural Minor)',
  locrian: 'Locrian',
}

export const MODE_TYPES: Exclude<ModeType, 'none'>[] = [
  'ionian',
  'dorian',
  'phrygian',
  'lydian',
  'mixolydian',
  'aeolian',
  'locrian',
]

export function getModeNotes(root: Note, modeType: Exclude<ModeType, 'none'>): Note[] {
  const rootIndex = NOTES.indexOf(root)
  const pattern = MODE_PATTERNS[modeType]
  return pattern.map(semitones => NOTES[(rootIndex + semitones) % 12])
}

export function isNoteInMode(note: Note, root: Note, modeType: Exclude<ModeType, 'none'>): boolean {
  const modeNotes = getModeNotes(root, modeType)
  return modeNotes.includes(note)
}

export function getModeDegree(note: Note, root: Note, modeType: Exclude<ModeType, 'none'>): number | null {
  const modeNotes = getModeNotes(root, modeType)
  const index = modeNotes.indexOf(note)
  return index === -1 ? null : index + 1
}

// Extended chord patterns as semitone intervals from root
// 9th = 14 semitones (octave + major 2nd), 11th = 17 semitones (octave + perfect 4th), 13th = 21 semitones (octave + major 6th)
// We use mod 12 to keep within one octave for fretboard display
export const EXTENDED_CHORD_PATTERNS: Record<Exclude<ExtendedChordType, 'none'>, number[]> = {
  // 9th chords (Root, 3rd, 5th, 7th, 9th)
  major9: [0, 4, 7, 11, 2],      // Maj7 + Major 9th (14 % 12 = 2)
  minor9: [0, 3, 7, 10, 2],      // Min7 + Major 9th
  dominant9: [0, 4, 7, 10, 2],   // Dom7 + Major 9th

  // 11th chords (Root, 3rd, 5th, 7th, 9th, 11th)
  major11: [0, 4, 7, 11, 2, 5],     // Maj9 + Perfect 11th (17 % 12 = 5)
  minor11: [0, 3, 7, 10, 2, 5],     // Min9 + Perfect 11th
  dominant11: [0, 4, 7, 10, 2, 5],  // Dom9 + Perfect 11th

  // 13th chords (Root, 3rd, 5th, 7th, 9th, 11th, 13th)
  major13: [0, 4, 7, 11, 2, 5, 9],     // Maj11 + Major 13th (21 % 12 = 9)
  minor13: [0, 3, 7, 10, 2, 5, 9],     // Min11 + Major 13th
  dominant13: [0, 4, 7, 10, 2, 5, 9],  // Dom11 + Major 13th
}

export const EXTENDED_CHORD_LABELS: Record<Exclude<ExtendedChordType, 'none'>, string> = {
  major9: 'Major 9th',
  minor9: 'Minor 9th',
  dominant9: 'Dominant 9th',
  major11: 'Major 11th',
  minor11: 'Minor 11th',
  dominant11: 'Dominant 11th',
  major13: 'Major 13th',
  minor13: 'Minor 13th',
  dominant13: 'Dominant 13th',
}

export const EXTENDED_CHORD_TYPES: Exclude<ExtendedChordType, 'none'>[] = [
  'major9',
  'minor9',
  'dominant9',
  'major11',
  'minor11',
  'dominant11',
  'major13',
  'minor13',
  'dominant13',
]

export function getExtendedChordNotes(root: Note, chordType: Exclude<ExtendedChordType, 'none'>): Note[] {
  const rootIndex = NOTES.indexOf(root)
  const pattern = EXTENDED_CHORD_PATTERNS[chordType]
  return pattern.map(semitones => NOTES[(rootIndex + semitones) % 12])
}

export function isNoteInExtendedChord(note: Note, root: Note, chordType: Exclude<ExtendedChordType, 'none'>): boolean {
  const chordNotes = getExtendedChordNotes(root, chordType)
  return chordNotes.includes(note)
}

export function getExtendedChordDegree(note: Note, root: Note, chordType: Exclude<ExtendedChordType, 'none'>): number | null {
  const chordNotes = getExtendedChordNotes(root, chordType)
  const index = chordNotes.indexOf(note)
  return index === -1 ? null : index + 1
}

// Inversion utilities
export const INVERSION_LABELS: Record<InversionType, string> = {
  root: 'Root Position',
  first: '1st Inversion (3rd in bass)',
  second: '2nd Inversion (5th in bass)',
  third: '3rd Inversion (7th in bass)',
}

export const INVERSION_TYPES: InversionType[] = ['root', 'first', 'second', 'third']

// Get the bass note index for a given inversion
// Returns 0 for root position, 1 for 1st inversion (3rd), 2 for 2nd inversion (5th), 3 for 3rd inversion (7th)
export function getInversionBassIndex(inversion: InversionType): number {
  switch (inversion) {
    case 'root': return 0
    case 'first': return 1
    case 'second': return 2
    case 'third': return 3
  }
}

// Check if a chord type supports a given inversion
// Triads only support root, 1st, and 2nd inversions
// 7th chords and extended chords support all inversions
export function supportsInversion(
  inversion: InversionType,
  triadType: string,
  seventhChordType: string,
  extendedChordType: string
): boolean {
  const hasTriad = triadType !== 'none'
  const hasSeventh = seventhChordType !== 'none'
  const hasExtended = extendedChordType !== 'none'

  if (!hasTriad && !hasSeventh && !hasExtended) {
    return false // No chord selected
  }

  if (inversion === 'third') {
    // 3rd inversion only for 7th chords and extended chords
    return hasSeventh || hasExtended
  }

  return true
}

// Key reference - chords in a key with Roman numerals
export interface KeyChord {
  root: Note
  quality: 'major' | 'minor' | 'diminished' | 'augmented'
  romanNumeral: string
  degree: number
}

// Major key chord qualities: I ii iii IV V vi vii°
const MAJOR_KEY_QUALITIES: Array<'major' | 'minor' | 'diminished'> = [
  'major', 'minor', 'minor', 'major', 'major', 'minor', 'diminished'
]

const MAJOR_KEY_ROMAN_NUMERALS = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°']

// Natural minor key chord qualities: i ii° III iv v VI VII
const MINOR_KEY_QUALITIES: Array<'major' | 'minor' | 'diminished'> = [
  'minor', 'diminished', 'major', 'minor', 'minor', 'major', 'major'
]

const MINOR_KEY_ROMAN_NUMERALS = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII']

export function getChordsInMajorKey(root: Note): KeyChord[] {
  const scaleNotes = getScaleNotes(root, 'major')
  return scaleNotes.map((note, index) => ({
    root: note,
    quality: MAJOR_KEY_QUALITIES[index],
    romanNumeral: MAJOR_KEY_ROMAN_NUMERALS[index],
    degree: index + 1
  }))
}

export function getChordsInMinorKey(root: Note): KeyChord[] {
  const scaleNotes = getScaleNotes(root, 'natural_minor')
  return scaleNotes.map((note, index) => ({
    root: note,
    quality: MINOR_KEY_QUALITIES[index],
    romanNumeral: MINOR_KEY_ROMAN_NUMERALS[index],
    degree: index + 1
  }))
}

// Get chord symbol (e.g., "C", "Dm", "E°")
export function getChordSymbol(chord: KeyChord): string {
  const qualitySuffix = chord.quality === 'minor' ? 'm' : chord.quality === 'diminished' ? '°' : ''
  return `${chord.root}${qualitySuffix}`
}
