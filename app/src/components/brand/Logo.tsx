// src/components/brand/Logo.tsx
// Logo do Projeto Tippe — ícone de régua de maré + wordmark em Georgia.
// Disponível em duas variantes: "full" (ícone + texto) e "icon" (só ícone).

type Props = {
    variant?: 'full' | 'icon'
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

const sizes = {
    sm: { r: 14, total: 28, fontSize: 18, gap: 8 },
    md: { r: 20, total: 40, fontSize: 24, gap: 10 },
    lg: { r: 36, total: 72, fontSize: 40, gap: 14 },
}

export function Logo({ variant = 'full', size = 'sm', className = '' }: Props) {
    const { r, total, fontSize, gap } = sizes[size]
    const cx = total / 2
    const cy = total / 2

    // Posições internas relativas ao centro do círculo
    const waveY = cy + r * 0.1          // onda um pouco acima do centro
    const poleTop = cy - r * 0.7
    const poleBtm = cy + r * 0.7
    const waveAmp = r * 0.28             // amplitude da onda

    // Pontos da onda (termina no polo em x=cx)
    const w0x = cx - r * 0.85
    const w1x = cx - r * 0.55
    const w2x = cx - r * 0.25
    const w3x = cx

    const wavePath = [
        `M${w0x},${waveY}`,
        `Q${(w0x + w1x) / 2},${waveY - waveAmp} ${w1x},${waveY}`,
        `Q${(w1x + w2x) / 2},${waveY + waveAmp} ${w2x},${waveY}`,
        `Q${(w2x + w3x) / 2},${waveY - waveAmp * 0.5} ${w3x},${waveY}`,
    ].join(' ')

    const tickLen = r * 0.25
    const tickLen2 = r * 0.18

    const iconSvg = (
        <svg
            width={total}
            height={total}
            viewBox={`0 0 ${total} ${total}`}
            aria-hidden="true"
            style={{ flexShrink: 0 }}
        >
            {/* Círculo fundo */}
            <circle cx={cx} cy={cy} r={r} fill="#12C5D6" />

            {/* Polo (régua vertical) */}
            <line
                x1={cx} y1={poleTop}
                x2={cx} y2={poleBtm}
                stroke="white"
                strokeWidth={total * 0.04}
                opacity={0.4}
                strokeLinecap="round"
            />

            {/* Marcas de graduação */}
            {[0.25, 0.5, 0.75].map((pct, i) => {
                const ty = poleTop + (poleBtm - poleTop) * pct
                const len = i % 2 === 0 ? tickLen : tickLen2
                return (
                    <line
                        key={pct}
                        x1={cx} y1={ty}
                        x2={cx + len} y2={ty}
                        stroke="white"
                        strokeWidth={total * 0.03}
                        opacity={i % 2 === 0 ? 0.55 : 0.35}
                    />
                )
            })}

            {/* Onda */}
            <path
                d={wavePath}
                fill="none"
                stroke="white"
                strokeWidth={total * 0.07}
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Marcador no nível da água */}
            <circle cx={cx} cy={waveY} r={r * 0.18} fill="white" />
            <circle cx={cx} cy={waveY} r={r * 0.09} fill="#12C5D6" />
        </svg>
    )

    if (variant === 'icon') return <span className={className}>{iconSvg}</span>

    return (
        <span
            className={`flex items-center ${className}`}
            style={{ gap }}
        >
            {iconSvg}
            <span
                style={{
                    fontFamily: "Georgia, Palatino, 'Book Antiqua', serif",
                    fontSize,
                    fontWeight: 400,
                    letterSpacing: '-0.03em',
                    color: 'var(--color-text-primary)',
                    lineHeight: 1,
                }}
            >
                tippe
            </span>
        </span>
    )
}