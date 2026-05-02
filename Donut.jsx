// Donut.jsx — Gráfico donut SVG por categoria
import { fmtBRL } from '../lib/utils'

export default function Donut({ data, size = 160 }) {
  // data: [{name, color, value}]
  const total  = data.reduce((s, d) => s + d.value, 0)
  const cx     = size / 2
  const cy     = size / 2
  const rOuter = size * 0.45
  const rInner = size * 0.28

  if (!total) return (
    <svg width={size} height={size}>
      <circle cx={cx} cy={cy} r={rOuter} fill="#EDE8DF"/>
      <circle cx={cx} cy={cy} r={rInner} fill="#FAF7F2"/>
    </svg>
  )

  let angle = -Math.PI / 2
  const slices = data.map(d => {
    const pct   = d.value / total
    const sweep = pct * 2 * Math.PI
    const start = angle
    angle += sweep
    return { ...d, pct, start, end: angle }
  })

  const arc = (cx, cy, r, start, end) => {
    const x1 = cx + r * Math.cos(start)
    const y1 = cy + r * Math.sin(start)
    const x2 = cx + r * Math.cos(end)
    const y2 = cy + r * Math.sin(end)
    const large = (end - start) > Math.PI ? 1 : 0
    return `M${x1},${y1} A${r},${r},0,${large},1,${x2},${y2}`
  }

  const donutPath = (s) => {
    const ox1 = cx + rOuter * Math.cos(s.start)
    const oy1 = cy + rOuter * Math.sin(s.start)
    const ox2 = cx + rOuter * Math.cos(s.end)
    const oy2 = cy + rOuter * Math.sin(s.end)
    const ix1 = cx + rInner * Math.cos(s.end)
    const iy1 = cy + rInner * Math.sin(s.end)
    const ix2 = cx + rInner * Math.cos(s.start)
    const iy2 = cy + rInner * Math.sin(s.start)
    const large = (s.end - s.start) > Math.PI ? 1 : 0
    return [
      `M${ox1},${oy1}`,
      `A${rOuter},${rOuter},0,${large},1,${ox2},${oy2}`,
      `L${ix1},${iy1}`,
      `A${rInner},${rInner},0,${large},0,${ix2},${iy2}`,
      'Z'
    ].join(' ')
  }

  return (
    <svg width={size} height={size}>
      {slices.map((s, i) => (
        <path key={i} d={donutPath(s)} fill={s.color} />
      ))}
      <circle cx={cx} cy={cy} r={rInner} fill="#FAF7F2"/>
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="10" fill="#7A6A58" fontFamily="Nunito Sans">Total</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="11" fill="#2F3E34" fontFamily="Playfair Display" fontWeight="700">
        {fmtBRL(total).replace('R$', 'R$')}
      </text>
    </svg>
  )
}
