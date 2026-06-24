import { useState } from 'react'
import { Note, ScaleType } from '../../types/music'
import { CIRCLE_OF_FIFTHS_DATA, CircleOfFifthsKey } from '../../utils/music'
import styles from './CircleOfFifths.module.css'

const SHARP_ORDER = ['F#', 'C#', 'G#', 'D#', 'A#', 'E#', 'B#']
const FLAT_ORDER = ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Fb']

function getAccidentalNotes(data: CircleOfFifthsKey): { type: 'sharp' | 'flat' | 'none'; notes: string[] } {
  const isFlat = data.key.endsWith('b')
  if (isFlat && data.flats) {
    return { type: 'flat', notes: FLAT_ORDER.slice(0, data.flats) }
  }
  if (data.sharps) {
    return { type: 'sharp', notes: SHARP_ORDER.slice(0, data.sharps) }
  }
  if (data.flats) {
    return { type: 'flat', notes: FLAT_ORDER.slice(0, data.flats) }
  }
  return { type: 'none', notes: [] }
}

interface CircleOfFifthsProps {
  selectedRoot: Note
  onRootSelect: (note: Note) => void
  onScaleTypeChange?: (scaleType: ScaleType) => void
}

export function CircleOfFifths({ selectedRoot, onRootSelect, onScaleTypeChange }: CircleOfFifthsProps) {
  const [hoveredData, setHoveredData] = useState<CircleOfFifthsKey | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  const handleKeySelect = (note: Note) => {
    onRootSelect(note)
    // Automatically show the major scale for the selected key
    if (onScaleTypeChange) {
      onScaleTypeChange('major')
    }
  }

  const size = 500
  const center = size / 2

  // Ring radii (outer to inner)
  const keyOuterRadius = 240
  const keyInnerRadius = 190
  const sharpsOuterRadius = 190
  const sharpsInnerRadius = 145
  const flatsOuterRadius = 145
  const flatsInnerRadius = 100
  const minorOuterRadius = 100
  const minorInnerRadius = 50

  // Label radii (centered in each ring)
  const keyLabelRadius = (keyOuterRadius + keyInnerRadius) / 2
  const sharpsLabelRadius = (sharpsOuterRadius + sharpsInnerRadius) / 2
  const flatsLabelRadius = (flatsOuterRadius + flatsInnerRadius) / 2
  const minorLabelRadius = (minorOuterRadius + minorInnerRadius) / 2

  const createArcPath = (
    outerR: number,
    innerR: number,
    startAngle: number,
    endAngle: number
  ) => {
    const x1 = center + outerR * Math.cos(startAngle)
    const y1 = center + outerR * Math.sin(startAngle)
    const x2 = center + outerR * Math.cos(endAngle)
    const y2 = center + outerR * Math.sin(endAngle)
    const x3 = center + innerR * Math.cos(endAngle)
    const y3 = center + innerR * Math.sin(endAngle)
    const x4 = center + innerR * Math.cos(startAngle)
    const y4 = center + innerR * Math.sin(startAngle)

    return `M ${x1} ${y1} A ${outerR} ${outerR} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 0 0 ${x4} ${y4} Z`
  }

  const getLabelPosition = (radius: number, angle: number) => ({
    x: center + radius * Math.cos(angle),
    y: center + radius * Math.sin(angle),
  })

  // Get the root note from the key string (handles flats by converting to sharps)
  const getNoteFromKey = (key: string): Note => {
    const noteMap: Record<string, Note> = {
      'C': 'C', 'G': 'G', 'D': 'D', 'A': 'A', 'E': 'E', 'B': 'B',
      'F#': 'F#', 'Db': 'C#', 'Ab': 'G#', 'Eb': 'D#', 'Bb': 'A#', 'F': 'F'
    }
    return noteMap[key] || 'C'
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Circle of Fifths</h3>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={styles.svg}
      >
        {CIRCLE_OF_FIFTHS_DATA.map((data, index) => {
          const startAngle = (index * 30 - 90) * (Math.PI / 180)
          const endAngle = ((index + 1) * 30 - 90) * (Math.PI / 180)
          const midAngle = startAngle + (15 * Math.PI / 180)

          const note = getNoteFromKey(data.key)
          const isSelected = note === selectedRoot

          const keyLabel = getLabelPosition(keyLabelRadius, midAngle)
          const sharpsLabel = getLabelPosition(sharpsLabelRadius, midAngle)
          const flatsLabel = getLabelPosition(flatsLabelRadius, midAngle)
          const minorLabel = getLabelPosition(minorLabelRadius, midAngle)

          return (
            <g
              key={data.key}
              onClick={() => handleKeySelect(note)}
              className={styles.segment}
              onMouseEnter={() => setHoveredData(data)}
              onMouseLeave={() => setHoveredData(null)}
              onMouseMove={(e) => setTooltipPos({ x: e.clientX, y: e.clientY })}
            >
              {/* Outer ring - Major key names */}
              <path
                d={createArcPath(keyOuterRadius, keyInnerRadius, startAngle, endAngle)}
                className={`${styles.keySegment} ${isSelected ? styles.selected : ''}`}
              />

              {/* Second ring - Sharps count */}
              <path
                d={createArcPath(sharpsOuterRadius, sharpsInnerRadius, startAngle, endAngle)}
                className={`${styles.sharpsSegment} ${isSelected ? styles.sharpsSelected : ''}`}
              />

              {/* Third ring - Flats count */}
              <path
                d={createArcPath(flatsOuterRadius, flatsInnerRadius, startAngle, endAngle)}
                className={`${styles.flatsSegment} ${isSelected ? styles.flatsSelected : ''}`}
              />

              {/* Inner ring - Relative minor */}
              <path
                d={createArcPath(minorOuterRadius, minorInnerRadius, startAngle, endAngle)}
                className={`${styles.minorSegment} ${isSelected ? styles.minorSelected : ''}`}
              />

              {/* Key label */}
              <text
                x={keyLabel.x}
                y={keyLabel.y}
                className={`${styles.keyLabel} ${isSelected ? styles.selectedLabel : ''}`}
              >
                {data.enharmonic ? (
                  <>
                    <tspan x={keyLabel.x} dy="-0.4em">{data.key}</tspan>
                    <tspan x={keyLabel.x} dy="1em" className={styles.enharmonicLabel}>({data.enharmonic})</tspan>
                  </>
                ) : (
                  data.key
                )}
              </text>

              {/* Sharps label */}
              <text
                x={sharpsLabel.x}
                y={sharpsLabel.y}
                className={`${styles.sharpsLabel} ${isSelected ? styles.selectedLabel : ''}`}
              >
                {data.sharps !== null ? `${data.sharps}♯` : ''}
              </text>

              {/* Flats label */}
              <text
                x={flatsLabel.x}
                y={flatsLabel.y}
                className={`${styles.flatsLabel} ${isSelected ? styles.selectedLabel : ''}`}
              >
                {data.flats !== null ? `${data.flats}♭` : ''}
              </text>

              {/* Relative minor label */}
              <text
                x={minorLabel.x}
                y={minorLabel.y}
                className={`${styles.minorLabel} ${isSelected ? styles.selectedLabel : ''}`}
              >
                {data.relativeMinor}
              </text>
            </g>
          )
        })}

        {/* Center circle */}
        <circle cx={center} cy={center} r={48} className={styles.centerCircle} />
      </svg>

      {hoveredData && (() => {
        const acc = getAccidentalNotes(hoveredData)
        return (
          <div
            className={styles.tooltip}
            style={{ left: tooltipPos.x + 14, top: tooltipPos.y - 14 }}
          >
            <div className={styles.tooltipTitle}>{hoveredData.key} Major</div>
            {acc.type === 'none' && (
              <div className={styles.tooltipNone}>No sharps or flats</div>
            )}
            {acc.type === 'sharp' && (
              <div className={styles.tooltipAccidentals}>
                <span className={styles.tooltipCount}>{acc.notes.length}♯</span>
                <span className={styles.tooltipNotes}>{acc.notes.join('  ')}</span>
              </div>
            )}
            {acc.type === 'flat' && (
              <div className={styles.tooltipAccidentals}>
                <span className={styles.tooltipCount}>{acc.notes.length}♭</span>
                <span className={styles.tooltipNotes}>{acc.notes.join('  ')}</span>
              </div>
            )}
          </div>
        )
      })()}

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.keyDot} /> Major Key
        </span>
        <span className={styles.legendItem}>
          <span className={styles.sharpsDot} /> Sharps
        </span>
        <span className={styles.legendItem}>
          <span className={styles.flatsDot} /> Flats
        </span>
        <span className={styles.legendItem}>
          <span className={styles.minorDot} /> Relative Minor
        </span>
      </div>
    </div>
  )
}
