/** Marcador de "parágrafo vazio" — o PUT de /api/admin/content apaga overrides em branco (e a chave
 * voltaria ao texto padrão), então chaves de um bloco de texto sem conteúdo guardam este caractere invisível. */
export const BLANK_PARAGRAPH = '​';

/** Junta várias chaves de texto num único bloco e o quebra em parágrafos (um por linha). */
export function splitParagraphs(texts: string[]): string[] {
  return texts
    .flatMap((text) => text.split(/\n+/))
    .map((text) => text.replaceAll(BLANK_PARAGRAPH, '').trim())
    .filter(Boolean);
}
