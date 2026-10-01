'use client';

import { motion } from 'framer-motion';

export interface PillTab {
  id: string;
  label: string;
}

export default function PillTabs({
  tabs,
  activeId,
  onChange,
  layoutId = 'pill-tabs-indicator',
}: {
  tabs: PillTab[];
  activeId: string;
  onChange: (id: string) => void;
  layoutId?: string;
}) {
  return (
    <div
      role="tablist"
      style={{
        display: 'flex',
        flexWrap: 'nowrap',
        overflowX: 'auto',
        maxWidth: '100%',
        gap: '4px',
        padding: '4px',
        borderRadius: '999px',
        background: 'var(--pill-bg, rgba(255,255,255,0.04))',
        isolation: 'isolate',
      }}
    >
      <style>{`
        .pill-tab:not([aria-selected="true"]):hover { color: var(--pill-hover-text, var(--color-primary)) !important; }
      `}</style>
      {tabs.map((tab) => {
        const active = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            className="pill-tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            style={{
              position: 'relative',
              flexShrink: 0,
              whiteSpace: 'nowrap',
              padding: '6px 10px',
              borderRadius: '999px',
              border: 'none',
              background: 'transparent',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              color: active ? 'var(--pill-active-text, #000)' : 'var(--pill-inactive-text, rgba(255,255,255,0.6))',
              transition: 'color 0.25s',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '999px',
                  background: 'var(--pill-active-bg, var(--color-text))',
                  zIndex: -1,
                }}
              />
            )}
            <span style={{ position: 'relative', zIndex: 1 }}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
