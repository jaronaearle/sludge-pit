import { Note, Interval, ScaleType, DyadType, TriadType, SeventhChordType, ExtendedChordType, ModeType, InversionType, Tuning, TuningId, CAGEDShape } from '../types/music'

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
  pentatonic_major: [0, 2, 4, 7, 9],       // 1-2-3-5-6
  pentatonic_minor: [0, 3, 5, 7, 10],      // 1-b3-4-5-b7
  blues: [0, 3, 5, 6, 7, 10],              // 1-b3-4-b5-5-b7
}

export const SCALE_LABELS: Record<Exclude<ScaleType, 'none'>, string> = {
  major: 'Major',
  natural_minor: 'Natural Minor',
  harmonic_minor: 'Harmonic Minor',
  melodic_minor: 'Melodic Minor',
  pentatonic_major: 'Pentatonic Major',
  pentatonic_minor: 'Pentatonic Minor',
  blues: 'Blues',
}

export const SCALE_TYPES: Exclude<ScaleType, 'none'>[] = [
  'major',
  'natural_minor',
  'harmonic_minor',
  'melodic_minor',
  'pentatonic_major',
  'pentatonic_minor',
  'blues',
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

// Dyad patterns as semitone intervals from root
export const DYAD_PATTERNS: Record<Exclude<DyadType, 'none'>, number[]> = {
  minor_2nd: [0, 1],      // Root, Minor 2nd
  major_2nd: [0, 2],      // Root, Major 2nd
  minor_3rd: [0, 3],      // Root, Minor 3rd
  major_3rd: [0, 4],      // Root, Major 3rd
  perfect_4th: [0, 5],    // Root, Perfect 4th
  tritone: [0, 6],        // Root, Tritone (b5/#4)
  perfect_5th: [0, 7],    // Root, Perfect 5th
  minor_6th: [0, 8],      // Root, Minor 6th
  major_6th: [0, 9],      // Root, Major 6th
  minor_7th: [0, 10],     // Root, Minor 7th
  major_7th: [0, 11],     // Root, Major 7th
  octave: [0, 12],        // Root, Octave
}

export const DYAD_LABELS: Record<Exclude<DyadType, 'none'>, string> = {
  minor_2nd: 'Minor 2nd',
  major_2nd: 'Major 2nd',
  minor_3rd: 'Minor 3rd',
  major_3rd: 'Major 3rd',
  perfect_4th: 'Perfect 4th',
  tritone: 'Tritone (b5)',
  perfect_5th: 'Perfect 5th (Power Chord)',
  minor_6th: 'Minor 6th',
  major_6th: 'Major 6th',
  minor_7th: 'Minor 7th',
  major_7th: 'Major 7th',
  octave: 'Octave',
}

export const DYAD_TYPES: Exclude<DyadType, 'none'>[] = [
  'minor_2nd',
  'major_2nd',
  'minor_3rd',
  'major_3rd',
  'perfect_4th',
  'tritone',
  'perfect_5th',
  'minor_6th',
  'major_6th',
  'minor_7th',
  'major_7th',
  'octave',
]

export function getDyadNotes(root: Note, dyadType: Exclude<DyadType, 'none'>): Note[] {
  const rootIndex = NOTES.indexOf(root)
  const pattern = DYAD_PATTERNS[dyadType]
  return pattern.map(semitones => NOTES[(rootIndex + semitones) % 12])
}

export function isNoteInDyad(note: Note, root: Note, dyadType: Exclude<DyadType, 'none'>): boolean {
  const dyadNotes = getDyadNotes(root, dyadType)
  return dyadNotes.includes(note)
}

export function getDyadDegree(note: Note, root: Note, dyadType: Exclude<DyadType, 'none'>): number | null {
  const dyadNotes = getDyadNotes(root, dyadType)
  const index = dyadNotes.indexOf(note)
  return index === -1 ? null : index + 1
}

// Triad patterns as semitone intervals from root
export const TRIAD_PATTERNS: Record<Exclude<TriadType, 'none'>, number[]> = {
  major: [0, 4, 7],       // Root, Major 3rd, Perfect 5th
  minor: [0, 3, 7],       // Root, Minor 3rd, Perfect 5th
  diminished: [0, 3, 6],  // Root, Minor 3rd, Diminished 5th
  augmented: [0, 4, 8],   // Root, Major 3rd, Augmented 5th
  sus2: [0, 2, 7],        // Root, Major 2nd, Perfect 5th
  sus4: [0, 5, 7],        // Root, Perfect 4th, Perfect 5th
}

export const TRIAD_LABELS: Record<Exclude<TriadType, 'none'>, string> = {
  major: 'Major',
  minor: 'Minor',
  diminished: 'Diminished',
  augmented: 'Augmented',
  sus2: 'Suspended 2nd',
  sus4: 'Suspended 4th',
}

export const TRIAD_TYPES: Exclude<TriadType, 'none'>[] = [
  'major',
  'minor',
  'diminished',
  'augmented',
  'sus2',
  'sus4',
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

// Circle of fifths with full data for each key
export interface CircleOfFifthsKey {
  key: string
  enharmonic: string | null
  sharps: number | null
  flats: number | null
  relativeMinor: string
}

export const CIRCLE_OF_FIFTHS_DATA: CircleOfFifthsKey[] = [
  { key: 'C', enharmonic: null, sharps: null, flats: null, relativeMinor: 'Am' },
  { key: 'G', enharmonic: null, sharps: 1, flats: null, relativeMinor: 'Em' },
  { key: 'D', enharmonic: null, sharps: 2, flats: null, relativeMinor: 'Bm' },
  { key: 'A', enharmonic: null, sharps: 3, flats: null, relativeMinor: 'F#m' },
  { key: 'E', enharmonic: null, sharps: 4, flats: null, relativeMinor: 'C#m' },
  { key: 'B', enharmonic: 'Cb', sharps: 5, flats: 7, relativeMinor: 'G#m' },
  { key: 'F#', enharmonic: 'Gb', sharps: 6, flats: 6, relativeMinor: 'D#m' },
  { key: 'Db', enharmonic: 'C#', sharps: 7, flats: 5, relativeMinor: 'Bbm' },
  { key: 'Ab', enharmonic: null, sharps: null, flats: 4, relativeMinor: 'Fm' },
  { key: 'Eb', enharmonic: null, sharps: null, flats: 3, relativeMinor: 'Cm' },
  { key: 'Bb', enharmonic: null, sharps: null, flats: 2, relativeMinor: 'Gm' },
  { key: 'F', enharmonic: null, sharps: null, flats: 1, relativeMinor: 'Dm' },
]

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
  minMaj7: [0, 3, 7, 11],          // Root, Minor 3rd, Perfect 5th, Major 7th
  aug7: [0, 4, 8, 10],             // Root, Major 3rd, Augmented 5th, Minor 7th (7#5)
  '7sus4': [0, 5, 7, 10],          // Root, Perfect 4th, Perfect 5th, Minor 7th
  '7b5': [0, 4, 6, 10],            // Root, Major 3rd, Diminished 5th, Minor 7th
}

export const SEVENTH_CHORD_LABELS: Record<Exclude<SeventhChordType, 'none'>, string> = {
  major7: 'Major 7th',
  minor7: 'Minor 7th',
  dominant7: 'Dominant 7th',
  diminished7: 'Diminished 7th',
  half_diminished7: 'Half-Dim 7th (m7♭5)',
  minMaj7: 'Minor-Major 7th',
  aug7: 'Augmented 7th (7#5)',
  '7sus4': '7sus4',
  '7b5': '7♭5',
}

export const SEVENTH_CHORD_TYPES: Exclude<SeventhChordType, 'none'>[] = [
  'major7',
  'minor7',
  'dominant7',
  'diminished7',
  'half_diminished7',
  'minMaj7',
  'aug7',
  '7sus4',
  '7b5',
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
  // Add chords (triad + extension, no 7th)
  add9: [0, 4, 7, 2],             // Major triad + 9th
  madd9: [0, 3, 7, 2],            // Minor triad + 9th

  // 6th chords
  '6': [0, 4, 7, 9],              // Major triad + Major 6th
  m6: [0, 3, 7, 9],               // Minor triad + Major 6th

  // 9th chords (Root, 3rd, 5th, 7th, 9th)
  major9: [0, 4, 7, 11, 2],       // Maj7 + Major 9th (14 % 12 = 2)
  minor9: [0, 3, 7, 10, 2],       // Min7 + Major 9th
  dominant9: [0, 4, 7, 10, 2],    // Dom7 + Major 9th

  // Altered dominant
  '7sharp9': [0, 4, 7, 10, 3],    // Dom7 + #9 (Hendrix chord) - 3 is enharmonic to #9

  // 11th chords (Root, 3rd, 5th, 7th, 9th, 11th)
  major11: [0, 4, 7, 11, 2, 5],   // Maj9 + Perfect 11th (17 % 12 = 5)
  minor11: [0, 3, 7, 10, 2, 5],   // Min9 + Perfect 11th
  dominant11: [0, 4, 7, 10, 2, 5],// Dom9 + Perfect 11th

  // 13th chords (Root, 3rd, 5th, 7th, 9th, 11th, 13th)
  major13: [0, 4, 7, 11, 2, 5, 9],   // Maj11 + Major 13th (21 % 12 = 9)
  minor13: [0, 3, 7, 10, 2, 5, 9],   // Min11 + Major 13th
  dominant13: [0, 4, 7, 10, 2, 5, 9],// Dom11 + Major 13th
}

export const EXTENDED_CHORD_LABELS: Record<Exclude<ExtendedChordType, 'none'>, string> = {
  add9: 'Add 9',
  madd9: 'Minor Add 9',
  '6': 'Major 6th',
  m6: 'Minor 6th',
  major9: 'Major 9th',
  minor9: 'Minor 9th',
  dominant9: 'Dominant 9th',
  '7sharp9': '7#9 (Hendrix)',
  major11: 'Major 11th',
  minor11: 'Minor 11th',
  dominant11: 'Dominant 11th',
  major13: 'Major 13th',
  minor13: 'Minor 13th',
  dominant13: 'Dominant 13th',
}

export const EXTENDED_CHORD_TYPES: Exclude<ExtendedChordType, 'none'>[] = [
  'add9',
  'madd9',
  '6',
  'm6',
  'major9',
  'minor9',
  'dominant9',
  '7sharp9',
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

// Chord Voicings
// Each voicing is an array of 6 values (low E to high E)
// -1 = muted, 0 = open, positive number = fret
export interface ChordVoicing {
  name: string
  frets: number[]  // 6 values, low E to high E
  baseFret: number // The lowest fret in the diagram (for movable shapes)
  cagedShape?: CAGEDShape // Which CAGED shape this voicing corresponds to
}

// Open chord voicings (root position, played at the nut)
export const OPEN_CHORD_VOICINGS: Record<string, ChordVoicing[]> = {
  // Major chords
  'C_major': [
    { name: 'Open C', frets: [-1, 3, 2, 0, 1, 0], baseFret: 1, cagedShape: 'C' },
  ],
  'A_major': [
    { name: 'Open A', frets: [-1, 0, 2, 2, 2, 0], baseFret: 1, cagedShape: 'A' },
  ],
  'G_major': [
    { name: 'Open G', frets: [3, 2, 0, 0, 0, 3], baseFret: 1, cagedShape: 'G' },
  ],
  'E_major': [
    { name: 'Open E', frets: [0, 2, 2, 1, 0, 0], baseFret: 1, cagedShape: 'E' },
  ],
  'D_major': [
    { name: 'Open D', frets: [-1, -1, 0, 2, 3, 2], baseFret: 1, cagedShape: 'D' },
  ],
  // Minor chords
  'A_minor': [
    { name: 'Open Am', frets: [-1, 0, 2, 2, 1, 0], baseFret: 1, cagedShape: 'A' },
  ],
  'E_minor': [
    { name: 'Open Em', frets: [0, 2, 2, 0, 0, 0], baseFret: 1, cagedShape: 'E' },
  ],
  'D_minor': [
    { name: 'Open Dm', frets: [-1, -1, 0, 2, 3, 1], baseFret: 1, cagedShape: 'D' },
  ],
  // Suspended chords
  'A_sus2': [
    { name: 'Open Asus2', frets: [-1, 0, 2, 2, 0, 0], baseFret: 1, cagedShape: 'A' },
  ],
  'D_sus2': [
    { name: 'Open Dsus2', frets: [-1, -1, 0, 2, 3, 0], baseFret: 1, cagedShape: 'D' },
  ],
  'E_sus2': [
    { name: 'Open Esus2', frets: [0, 2, 4, 4, 0, 0], baseFret: 1, cagedShape: 'E' },
  ],
  'A_sus4': [
    { name: 'Open Asus4', frets: [-1, 0, 2, 2, 3, 0], baseFret: 1, cagedShape: 'A' },
  ],
  'D_sus4': [
    { name: 'Open Dsus4', frets: [-1, -1, 0, 2, 3, 3], baseFret: 1, cagedShape: 'D' },
  ],
  'E_sus4': [
    { name: 'Open Esus4', frets: [0, 2, 2, 2, 0, 0], baseFret: 1, cagedShape: 'E' },
  ],
  // 7th chords
  'A_dominant7': [
    { name: 'Open A7', frets: [-1, 0, 2, 0, 2, 0], baseFret: 1, cagedShape: 'A' },
  ],
  'E_dominant7': [
    { name: 'Open E7', frets: [0, 2, 0, 1, 0, 0], baseFret: 1, cagedShape: 'E' },
  ],
  'D_dominant7': [
    { name: 'Open D7', frets: [-1, -1, 0, 2, 1, 2], baseFret: 1, cagedShape: 'D' },
  ],
  'G_dominant7': [
    { name: 'Open G7', frets: [3, 2, 0, 0, 0, 1], baseFret: 1, cagedShape: 'G' },
  ],
  'C_major7': [
    { name: 'Open Cmaj7', frets: [-1, 3, 2, 0, 0, 0], baseFret: 1, cagedShape: 'C' },
  ],
  'A_minor7': [
    { name: 'Open Am7', frets: [-1, 0, 2, 0, 1, 0], baseFret: 1, cagedShape: 'A' },
  ],
  'E_minor7': [
    { name: 'Open Em7', frets: [0, 2, 0, 0, 0, 0], baseFret: 1, cagedShape: 'E' },
  ],
  'D_minor7': [
    { name: 'Open Dm7', frets: [-1, -1, 0, 2, 1, 1], baseFret: 1, cagedShape: 'D' },
  ],
}

// Movable barre chord shapes (relative to root)
// These are templates that get transposed based on root note
export const BARRE_CHORD_SHAPES: Record<string, ChordVoicing[]> = {
  'major': [
    { name: 'E Shape Barre', frets: [0, 2, 2, 1, 0, 0], baseFret: 0, cagedShape: 'E' },
    { name: 'A Shape Barre', frets: [-1, 0, 2, 2, 2, 0], baseFret: 0, cagedShape: 'A' },
  ],
  'minor': [
    { name: 'Em Shape Barre', frets: [0, 2, 2, 0, 0, 0], baseFret: 0, cagedShape: 'E' },
    { name: 'Am Shape Barre', frets: [-1, 0, 2, 2, 1, 0], baseFret: 0, cagedShape: 'A' },
  ],
  'sus2': [
    { name: 'Sus2 (E Shape)', frets: [0, 2, 2, 2, 0, 0], baseFret: 0, cagedShape: 'E' },
    { name: 'Sus2 (A Shape)', frets: [-1, 0, 2, 2, 0, 0], baseFret: 0, cagedShape: 'A' },
  ],
  'sus4': [
    { name: 'Sus4 (E Shape)', frets: [0, 2, 2, 2, 0, 0], baseFret: 0, cagedShape: 'E' },
    { name: 'Sus4 (A Shape)', frets: [-1, 0, 2, 2, 3, 0], baseFret: 0, cagedShape: 'A' },
  ],
  'dominant7': [
    { name: 'E7 Shape', frets: [0, 2, 0, 1, 0, 0], baseFret: 0, cagedShape: 'E' },
    { name: 'A7 Shape', frets: [-1, 0, 2, 0, 2, 0], baseFret: 0, cagedShape: 'A' },
  ],
  'minor7': [
    { name: 'Em7 Shape', frets: [0, 2, 0, 0, 0, 0], baseFret: 0, cagedShape: 'E' },
    { name: 'Am7 Shape', frets: [-1, 0, 2, 0, 1, 0], baseFret: 0, cagedShape: 'A' },
  ],
  'major7': [
    { name: 'Maj7 (E Shape)', frets: [0, 2, 1, 1, 0, 0], baseFret: 0, cagedShape: 'E' },
    { name: 'Maj7 (A Shape)', frets: [-1, 0, 2, 1, 2, 0], baseFret: 0, cagedShape: 'A' },
  ],
  'minMaj7': [
    { name: 'mMaj7 (E Shape)', frets: [0, 2, 1, 0, 0, 0], baseFret: 0, cagedShape: 'E' },
    { name: 'mMaj7 (A Shape)', frets: [-1, 0, 2, 1, 1, 0], baseFret: 0, cagedShape: 'A' },
  ],
  '7sus4': [
    { name: '7sus4 (E Shape)', frets: [0, 2, 0, 2, 0, 0], baseFret: 0, cagedShape: 'E' },
    { name: '7sus4 (A Shape)', frets: [-1, 0, 2, 0, 3, 0], baseFret: 0, cagedShape: 'A' },
  ],
  'diminished': [
    { name: 'Dim (movable)', frets: [-1, -1, 0, 1, 0, 1], baseFret: 0 },
  ],
  'diminished7': [
    { name: 'Dim7 (movable)', frets: [-1, -1, 0, 1, 0, 1], baseFret: 0 },
  ],
  'augmented': [
    { name: 'Aug (movable)', frets: [-1, -1, 2, 1, 1, 0], baseFret: 0 },
  ],
  'aug7': [
    { name: 'Aug7 (movable)', frets: [-1, -1, 0, 1, 1, 0], baseFret: 0 },
  ],
}

// Power chord shapes
export const POWER_CHORD_SHAPES: ChordVoicing[] = [
  { name: 'Power Chord (6th string)', frets: [0, 2, 2, -1, -1, -1], baseFret: 0 },
  { name: 'Power Chord (5th string)', frets: [-1, 0, 2, 2, -1, -1], baseFret: 0 },
]

// Get voicings for a chord
export function getChordVoicings(root: Note, chordType: TriadType | SeventhChordType): ChordVoicing[] {
  const rootIndex = NOTES.indexOf(root)
  const voicings: ChordVoicing[] = []

  // Check for open chord voicings first
  const openKey = `${root}_${chordType}`
  if (OPEN_CHORD_VOICINGS[openKey]) {
    voicings.push(...OPEN_CHORD_VOICINGS[openKey])
  }

  // Add transposed barre shapes
  const barreShapes = BARRE_CHORD_SHAPES[chordType]
  if (barreShapes) {
    for (const shape of barreShapes) {
      // Calculate the fret offset based on root note
      let baseFret: number
      if (shape.cagedShape === 'E') {
        // E shape barre: root on 6th string
        baseFret = rootIndex === 0 ? 12 : rootIndex // E is 0, so 0 means fret 12
      } else if (shape.cagedShape === 'A') {
        // A shape barre: root on 5th string
        const aIndex = NOTES.indexOf('A')
        baseFret = (rootIndex - aIndex + 12) % 12
        if (baseFret === 0) baseFret = 12
      } else {
        baseFret = rootIndex
      }

      // Only add if it's not duplicating an open chord
      if (baseFret > 1) {
        const transposedFrets = shape.frets.map(f => f === -1 ? -1 : f + baseFret)
        voicings.push({
          ...shape,
          frets: transposedFrets,
          baseFret,
        })
      }
    }
  }

  return voicings.slice(0, 4) // Return max 4 voicings
}

// CAGED System
// Each shape is defined by:
// - primaryString: the string where the root note is found (6=low E, 5=A, 4=D, 3=G, 2=B, 1=high E)
// - rootOffset: how many frets from the start of the shape to the root
// - fretSpan: total frets the shape covers
export interface CAGEDShapeInfo {
  name: CAGEDShape
  primaryString: number  // 6=low E, 5=A, etc.
  rootOffset: number     // frets from shape start to root
  fretSpan: number       // total fret width
  color: string          // display color
}

export const CAGED_SHAPES: Record<CAGEDShape, CAGEDShapeInfo> = {
  E: { name: 'E', primaryString: 6, rootOffset: 0, fretSpan: 4, color: '#ef4444' },  // red
  G: { name: 'G', primaryString: 6, rootOffset: 3, fretSpan: 4, color: '#22c55e' },  // green
  D: { name: 'D', primaryString: 4, rootOffset: 0, fretSpan: 4, color: '#3b82f6' },  // blue
  C: { name: 'C', primaryString: 5, rootOffset: 3, fretSpan: 4, color: '#facc15' },  // yellow
  A: { name: 'A', primaryString: 5, rootOffset: 0, fretSpan: 4, color: '#a855f7' },  // purple
}

export const CAGED_SHAPE_ORDER: CAGEDShape[] = ['C', 'A', 'G', 'E', 'D']

// Get the fret position where a CAGED shape starts for a given root note
// Returns the starting fret of the shape box (0 = nut/open)
export function getCAGEDShapePosition(rootNote: Note, shape: CAGEDShape, tuning: Note[]): number {
  const shapeInfo = CAGED_SHAPES[shape]
  const stringIndex = 6 - shapeInfo.primaryString // Convert to array index (0 = low E)
  const openNote = tuning[stringIndex]

  // Find where root note is on the primary string
  const openNoteIndex = NOTES.indexOf(openNote)
  const rootIndex = NOTES.indexOf(rootNote)
  let rootFret = (rootIndex - openNoteIndex + 12) % 12

  // The shape starts rootOffset frets before the root
  let shapeStart = rootFret - shapeInfo.rootOffset

  // Handle wrapping (if shape would start before nut, move up an octave)
  if (shapeStart < 0) {
    shapeStart += 12
  }

  return shapeStart
}

// Get the fret range for a CAGED shape
export function getCAGEDShapeFretRange(rootNote: Note, shape: CAGEDShape, tuning: Note[]): { start: number, end: number } {
  const shapeInfo = CAGED_SHAPES[shape]
  const start = getCAGEDShapePosition(rootNote, shape, tuning)
  return {
    start,
    end: start + shapeInfo.fretSpan - 1
  }
}
