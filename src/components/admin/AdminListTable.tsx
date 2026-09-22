'use client';

export interface AdminListRow {
  id: string;
  title: string;
  desc: string;
}

/** Tabela de listagem no mesmo padrão visual de /admin/cases (card branco, cabeçalho em
 * uppercase cinza, linhas com borda) — usada em telas que listam um punhado de itens fixos
 * (Global, Pages) pra manter consistência com a tela de Cases. */
export default function AdminListTable({ rows, renderAction }: { rows: AdminListRow[]; renderAction: (row: AdminListRow) => React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
            <Th>Nome</Th>
            <Th>Descrição</Th>
            <Th align="right">&nbsp;</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id} style={i < rows.length - 1 ? { borderBottom: '1px solid var(--color-border)' } : undefined}>
              <Td>
                <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{row.title}</span>
              </Td>
              <Td>
                <span style={{ color: 'rgba(26,26,26,0.55)', lineHeight: 1.5 }}>{row.desc}</span>
              </Td>
              <Td align="right">{renderAction(row)}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children, align = 'left' }: { children: React.ReactNode; align?: 'left' | 'right' }) {
  return (
    <th style={{ textAlign: align, padding: '12px 16px', fontSize: '11px', fontWeight: 700, color: 'rgba(26,26,26,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
      {children}
    </th>
  );
}

function Td({ children, align = 'left' }: { children: React.ReactNode; align?: 'left' | 'right' }) {
  return <td style={{ textAlign: align, padding: '12px 16px', verticalAlign: 'top' }}>{children}</td>;
}
