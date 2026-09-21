/** Upload de imagem do admin — client-only, usado pelos formulários de case. */
export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Falha no upload');
  return data.url as string;
}
