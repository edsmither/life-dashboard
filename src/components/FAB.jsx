export default function FAB({ onClick, accent }) {
  return (
    <button
      onClick={onClick}
      aria-label="Voice capture"
      style={{
        position: 'fixed',
        bottom: 28,
        right: 'max(28px, calc(50vw - 206px + 28px))',
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: accent,
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 4px 20px ${accent}60, 0 2px 6px rgba(0,0,0,0.15)`,
        transition: 'transform 0.12s, box-shadow 0.12s',
        zIndex: 100,
      }}
      onMouseDown={e => e.currentTarget.style.transform = 'scale(0.93)'}
      onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
      onTouchStart={e => e.currentTarget.style.transform = 'scale(0.93)'}
      onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="9" y="2" width="6" height="12" rx="3" stroke="#fff" strokeWidth="1.8" fill="none"/>
        <path d="M5 10a7 7 0 0014 0M12 19v3M9 22h6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  )
}
