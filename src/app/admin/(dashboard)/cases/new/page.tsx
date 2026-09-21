import CaseForm from '@/components/admin/CaseForm';

export default function NewCasePage() {
  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 4px' }}>Novo case</h1>
      <p style={{ fontSize: '13px', color: 'rgba(26,26,26,0.55)', margin: '0 0 24px' }}>
        Só os dados básicos são obrigatórios — o case aparece como &quot;em breve&quot; no portfólio até a narrativa ser preenchida.
      </p>
      <CaseForm mode="create" />
    </div>
  );
}
