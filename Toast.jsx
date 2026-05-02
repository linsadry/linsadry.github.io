// Toast.jsx
import { useEffect, useState } from 'react'
import { C } from '../lib/utils'

export function Toast() {
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    const handler = (e) => {
      setMsg(e.detail)
      setTimeout(() => setMsg(null), 2200)
    }
    window.addEventListener('rastro-toast', handler)
    return () => window.removeEventListener('rastro-toast', handler)
  }, [])

  if (!msg) return null

  return (
    <div style={{
      position: 'fixed', bottom: 110, left: '50%', transform: 'translateX(-50%)',
      background: C.olive, color: '#fff', padding: '10px 22px',
      borderRadius: 20, fontSize: 14, fontWeight: 600,
      zIndex: 9999, whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
      transition: 'opacity 0.2s',
    }}>
      {msg}
    </div>
  )
}

// DeleteConfirm.jsx
export function DeleteConfirm({ message, onConfirm, onCancel }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(44,36,24,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9000, padding: '0 24px',
    }}
      onClick={onCancel}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: C.paper, borderRadius: 20, padding: '28px 24px',
          width: '100%', maxWidth: 340, boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        }}
      >
        <p style={{ fontSize: 15, color: C.text, marginBottom: 24, lineHeight: 1.5, textAlign: 'center' }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '13px 0', borderRadius: 14, border: `1.5px solid ${C.divider}`,
              background: 'transparent', color: C.textMid, fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: '13px 0', borderRadius: 14, border: 'none',
              background: C.terracotta, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}
          >
            Remover
          </button>
        </div>
      </div>
    </div>
  )
}
