export const themes = {
  sage: {
    name: 'Sage',
    accent: '#6b8e6e',
    light: {
      bg: '#f1f0e6', surface: '#fcfbf3', surfaceAlt: '#f6f4ea',
      ink: '#2a3328', inkSoft: '#5d6a5b', inkMute: '#a7af9f',
      line: 'rgba(42,51,40,0.08)', lineSoft: 'rgba(42,51,40,0.05)',
      pillBg: '#e7eadc', scrim: 'rgba(42,51,40,0.45)',
      shadow: '0 8px 24px rgba(80,100,70,0.10), 0 1px 2px rgba(42,51,40,0.04)',
      shadowLg: '0 22px 50px rgba(80,100,70,0.22), 0 2px 4px rgba(42,51,40,0.08)',
    },
    dark: {
      bg: '#1d2520', surface: '#252e28', surfaceAlt: '#2c352f',
      ink: '#e7eadc', inkSoft: '#a7af9f', inkMute: '#5d6a5b',
      line: 'rgba(231,234,220,0.10)', lineSoft: 'rgba(231,234,220,0.06)',
      pillBg: '#2c352f', scrim: 'rgba(0,0,0,0.6)',
      shadow: '0 8px 24px rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.2)',
      shadowLg: '0 22px 50px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)',
    },
  },
  peach: {
    name: 'Peach',
    accent: '#d97757',
    light: {
      bg: '#fbf1e6', surface: '#ffffff', surfaceAlt: '#fff8ef',
      ink: '#3a2a1e', inkSoft: '#7a5e4d', inkMute: '#b29c8b',
      line: 'rgba(58,42,30,0.08)', lineSoft: 'rgba(58,42,30,0.05)',
      pillBg: '#f4e7d8', scrim: 'rgba(58,42,30,0.45)',
      shadow: '0 8px 24px rgba(170,110,60,0.10), 0 1px 2px rgba(58,42,30,0.04)',
      shadowLg: '0 22px 50px rgba(170,110,60,0.22), 0 2px 4px rgba(58,42,30,0.08)',
    },
    dark: {
      bg: '#27201a', surface: '#332a22', surfaceAlt: '#3b3127',
      ink: '#f4e7d8', inkSoft: '#b29c8b', inkMute: '#7a5e4d',
      line: 'rgba(244,231,216,0.10)', lineSoft: 'rgba(244,231,216,0.06)',
      pillBg: '#3b3127', scrim: 'rgba(0,0,0,0.6)',
      shadow: '0 8px 24px rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.2)',
      shadowLg: '0 22px 50px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)',
    },
  },
  slate: {
    name: 'Slate',
    accent: '#5b7a91',
    light: {
      bg: '#eef0f2', surface: '#fafbfb', surfaceAlt: '#f4f5f5',
      ink: '#212a32', inkSoft: '#566773', inkMute: '#9aa6af',
      line: 'rgba(33,42,50,0.08)', lineSoft: 'rgba(33,42,50,0.05)',
      pillBg: '#e2e6e9', scrim: 'rgba(33,42,50,0.45)',
      shadow: '0 8px 24px rgba(60,80,100,0.10), 0 1px 2px rgba(33,42,50,0.04)',
      shadowLg: '0 22px 50px rgba(60,80,100,0.22), 0 2px 4px rgba(33,42,50,0.08)',
    },
    dark: {
      bg: '#191e22', surface: '#212830', surfaceAlt: '#272f38',
      ink: '#e2e6e9', inkSoft: '#9aa6af', inkMute: '#566773',
      line: 'rgba(226,230,233,0.10)', lineSoft: 'rgba(226,230,233,0.06)',
      pillBg: '#272f38', scrim: 'rgba(0,0,0,0.6)',
      shadow: '0 8px 24px rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.2)',
      shadowLg: '0 22px 50px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)',
    },
  },
}

export const densityScale = {
  compact:  { pad: 16, gap: 12, cardPad: 14, listGap: 8,  titleSize: 26 },
  cozy:     { pad: 20, gap: 16, cardPad: 18, listGap: 12, titleSize: 30 },
  spacious: { pad: 24, gap: 22, cardPad: 22, listGap: 16, titleSize: 36 },
}

export function resolveTheme(themeName, mode) {
  const t = themes[themeName] || themes.sage
  return { ...t[mode], accent: t.accent }
}
