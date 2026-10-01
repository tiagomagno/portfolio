/** Seções que existem hoje no layout da Home, na ordem padrão. Seções antigas que ainda
 * têm linha no banco (intro, positioning, stats, work...) não fazem mais parte do site e não
 * aparecem no admin. Ao criar uma seção nova na Home, inclua a chave aqui (e o rótulo abaixo). */
export const HOME_SECTION_KEYS = ['hero', 'cases', 'offer', 'services', 'aboutBento', 'labs', 'ctaFooter'] as const;

/** Rótulo mostrado no admin para seções criadas depois do seed inicial. */
export const HOME_SECTION_LABELS: Record<string, string> = {
  offer: 'Serviços (o que faço)',
};

/** Mantém a ordem salva no banco e encaixa seções novas (ainda sem linha lá) logo depois da seção que
 * vem antes delas na ordem padrão — assim uma seção nova aparece no lugar certo sem ninguém reordenar. */
export function mergeSectionOrder(savedKeys: string[]): string[] {
  const result = [...savedKeys];
  HOME_SECTION_KEYS.forEach((key, i) => {
    if (result.includes(key)) return;
    const previous = HOME_SECTION_KEYS[i - 1];
    const at = previous ? result.indexOf(previous) : -1;
    result.splice(at === -1 ? Math.min(i, result.length) : at + 1, 0, key);
  });
  return result;
}
