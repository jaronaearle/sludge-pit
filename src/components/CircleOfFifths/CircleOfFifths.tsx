import { Note } from '../../types/music'
import { CIRCLE_OF_FIFTHS, getRelativeMinor } from '../../utils/music'
import styles from './CircleOfFifths.module.css'

interface CircleOfFifthsProps {
  selectedRoot: Note
  onRootSelect: (note: Note) => void
}

export function CircleOfFifths({ selectedRoot, onRootSelect }: CircleOfFifthsProps) {
  const size = 320
  const center = size / 2
  const outerRadius = 140
  const innerRadius = 90
  const labelOuterRadius = 115
  const labelInnerRadius = 65

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Circle of Fifths</h3>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={styles.svg}
      >
        {/* Outer ring - Major keys */}
        {CIRCLE_OF_FIFTHS.map((note, index) => {
          const angle = (index * 30 - 90) * (Math.PI / 180)
          const nextAngle = ((index + 1) * 30 - 90) * (Math.PI / 180)

          const x1 = center + outerRadius * Math.cos(angle)
          const y1 = center + outerRadius * Math.sin(angle)
          const x2 = center + outerRadius * Math.cos(nextAngle)
          const y2 = center + outerRadius * Math.sin(nextAngle)
          const x3 = center + innerRadius * Math.cos(nextAngle)
          const y3 = center + innerRadius * Math.sin(nextAngle)
          const x4 = center + innerRadius * Math.cos(angle)
          const y4 = center + innerRadius * Math.sin(angle)

          const labelX = center + labelOuterRadius * Math.cos(angle + (15 * Math.PI / 180))
          const labelY = center + labelOuterRadius * Math.sin(angle + (15 * Math.PI / 180))

          const isSelected = note === selectedRoot

          return (
            <g key={note} onClick={() => onRootSelect(note)} className={styles.segment}>
              <path
                d={`M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 0 0 ${x4} ${y4} Z`}
                className={`${styles.majorSegment} ${isSelected ? styles.selected : ''}`}
              />
              <text
                x={labelX}
                y={labelY}
                className={`${styles.majorLabel} ${isSelected ? styles.selectedLabel : ''}`}
              >
                {note}
              </text>
            </g>
          )
        })}

        {/* Inner ring - Minor keys */}
        {CIRCLE_OF_FIFTHS.map((majorNote, index) => {
          const minorNote = getRelativeMinor(majorNote)
          const angle = (index * 30 - 90) * (Math.PI / 180)
          const nextAngle = ((index + 1) * 30 - 90) * (Math.PI / 180)

          const x1 = center + innerRadius * Math.cos(angle)
          const y1 = center + innerRadius * Math.sin(angle)
          const x2 = center + innerRadius * Math.cos(nextAngle)
          const y2 = center + innerRadius * Math.sin(nextAngle)
          const innerMostRadius = 40
          const x3 = center + innerMostRadius * Math.cos(nextAngle)
          const y3 = center + innerMostRadius * Math.sin(nextAngle)
          const x4 = center + innerMostRadius * Math.cos(angle)
          const y4 = center + innerMostRadius * Math.sin(angle)

          const labelX = center + labelInnerRadius * Math.cos(angle + (15 * Math.PI / 180))
          const labelY = center + labelInnerRadius * Math.sin(angle + (15 * Math.PI / 180))

          const isSelected = minorNote === selectedRoot

          return (
            <g key={`${minorNote}m`} onClick={() => onRootSelect(minorNote)} className={styles.segment}>
              <path
                d={`M ${x1} ${y1} A ${innerRadius} ${innerRadius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerMostRadius} ${innerMostRadius} 0 0 0 ${x4} ${y4} Z`}
                className={`${styles.minorSegment} ${isSelected ? styles.selected : ''}`}
              />
              <text
                x={labelX}
                y={labelY}
                className={`${styles.minorLabel} ${isSelected ? styles.selectedLabel : ''}`}
              >
                {minorNote}m
              </text>
            </g>
          )
        })}

        {/* Center circle */}
        <circle cx={center} cy={center} r={38} className={styles.centerCircle} />
      </svg>
      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.majorDot} /> Major
        </span>
        <span className={styles.legendItem}>
          <span className={styles.minorDot} /> Minor
        </span>
      </div>
    </div>
  )
}
