import { useFormContext } from 'react-hook-form';
import {
  BriefingFormData,
  ADVOCACIA_FORMAT,
  ADVOCACIA_FOCUS,
  SAUDE_ATTENDANCE_TYPE,
  SAUDE_FOCUS,
  COMERCIO_SALES_TYPE,
  COMERCIO_LOGISTICS,
  SERVICOS_CLOSURE_MODEL,
  YES_NO,
  GENERIC_RAIOX_PAIN_OPTIONS,
} from '../../lib/briefing';
import { Input } from '../ui/Input';

export default function BriefingStep2() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<BriefingFormData>();

  const businessSegment = watch('businessSegment');

  if (businessSegment === 'advocacia') {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center md:text-left mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-heading-light dark:text-heading-dark mb-2">
            Raio-X do seu Escritório
          </h2>
          <p className="text-text-light dark:text-text-dark text-sm md:text-base">
            Conte-nos como sua banca atua hoje para entendermos qual a melhor estratégia digital para você.
          </p>
        </div>

        <Input
          label="Quais as suas principais áreas de atuação? *"
          placeholder="Ex: Direito Civil, Família, Trabalhista..."
          error={errors.advocacia_practiceAreas?.message}
          {...register('advocacia_practiceAreas')}
        />

        <div className="space-y-3">
          <label className="block text-sm font-medium text-heading-light dark:text-heading-dark">
            Qual o formato de atendimento principal? *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ADVOCACIA_FORMAT.map((format) => (
              <label
                key={format}
                className="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none"
              >
                <input
                  type="radio"
                  className="sr-only"
                  value={format}
                  {...register('advocacia_format')}
                />
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <span className="block text-sm font-medium text-heading-light dark:text-heading-dark capitalize">
                      {format}
                    </span>
                  </span>
                </span>
                <span
                  className="pointer-events-none absolute -inset-px rounded-lg border-2"
                  aria-hidden="true"
                  style={{
                    borderColor:
                      watch('advocacia_format') === format ? '#ED8B3F' : 'transparent',
                  }}
                />
              </label>
            ))}
          </div>
          {errors.advocacia_format && (
            <p className="text-sm text-red-600">{errors.advocacia_format.message}</p>
          )}
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-heading-light dark:text-heading-dark">
            Você realiza triagem/qualificação dos clientes antes de atender? *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {YES_NO.map((opt) => (
              <label
                key={opt}
                className="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none"
              >
                <input
                  type="radio"
                  className="sr-only"
                  value={opt}
                  {...register('advocacia_screening')}
                />
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <span className="block text-sm font-medium text-heading-light dark:text-heading-dark capitalize">
                      {opt === 'sim' ? 'Sim, já filtramos os contatos' : 'Não, atendo todos que chegam'}
                    </span>
                  </span>
                </span>
                <span
                  className="pointer-events-none absolute -inset-px rounded-lg border-2"
                  aria-hidden="true"
                  style={{
                    borderColor:
                      watch('advocacia_screening') === opt ? '#ED8B3F' : 'transparent',
                  }}
                />
              </label>
            ))}
          </div>
          {errors.advocacia_screening && (
            <p className="text-sm text-red-600">{errors.advocacia_screening.message}</p>
          )}
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-heading-light dark:text-heading-dark">
            Qual o foco dos casos que você deseja atrair? *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ADVOCACIA_FOCUS.map((focus) => (
              <label
                key={focus}
                className="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none"
              >
                <input
                  type="radio"
                  className="sr-only"
                  value={focus}
                  {...register('advocacia_caseFocus')}
                />
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <span className="block text-sm font-medium text-heading-light dark:text-heading-dark capitalize">
                      {focus === 'volume' ? 'Volume de Ações' : 'Casos Estratégicos (Alto Valor)'}
                    </span>
                  </span>
                </span>
                <span
                  className="pointer-events-none absolute -inset-px rounded-lg border-2"
                  aria-hidden="true"
                  style={{
                    borderColor:
                      watch('advocacia_caseFocus') === focus ? '#ED8B3F' : 'transparent',
                  }}
                />
              </label>
            ))}
          </div>
          {errors.advocacia_caseFocus && (
            <p className="text-sm text-red-600">{errors.advocacia_caseFocus.message}</p>
          )}
        </div>
      </div>
    );
  }

  if (businessSegment === 'saude') {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center md:text-left mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-heading-light dark:text-heading-dark mb-2">
            Raio-X da Saúde
          </h2>
          <p className="text-text-light dark:text-text-dark text-sm md:text-base">
            Queremos entender como é a rotina de agendamentos e atendimentos no seu consultório/clínica.
          </p>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-heading-light dark:text-heading-dark">
            Qual a modalidade de atendimento mais comum? *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SAUDE_ATTENDANCE_TYPE.map((opt) => (
              <label
                key={opt}
                className="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none"
              >
                <input
                  type="radio"
                  className="sr-only"
                  value={opt}
                  {...register('saude_attendanceType')}
                />
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <span className="block text-sm font-medium text-heading-light dark:text-heading-dark capitalize">
                      {opt === 'ambos' ? 'Particular e Convênio' : opt}
                    </span>
                  </span>
                </span>
                <span
                  className="pointer-events-none absolute -inset-px rounded-lg border-2"
                  aria-hidden="true"
                  style={{
                    borderColor:
                      watch('saude_attendanceType') === opt ? '#ED8B3F' : 'transparent',
                  }}
                />
              </label>
            ))}
          </div>
          {errors.saude_attendanceType && (
            <p className="text-sm text-red-600">{errors.saude_attendanceType.message}</p>
          )}
        </div>

        <Input
          label="De onde vem o maior volume de agendamentos hoje? *"
          placeholder="Ex: Indicações, Doctoralia, WhatsApp, Instagram..."
          error={errors.saude_mainVolume?.message}
          {...register('saude_mainVolume')}
        />

        <div className="space-y-3">
          <label className="block text-sm font-medium text-heading-light dark:text-heading-dark">
            A clínica utiliza algum software médico/prontuário digital atual? *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {YES_NO.map((opt) => (
              <label
                key={opt}
                className="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none"
              >
                <input
                  type="radio"
                  className="sr-only"
                  value={opt}
                  {...register('saude_hasMedicalSoftware')}
                />
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <span className="block text-sm font-medium text-heading-light dark:text-heading-dark capitalize">
                      {opt}
                    </span>
                  </span>
                </span>
                <span
                  className="pointer-events-none absolute -inset-px rounded-lg border-2"
                  aria-hidden="true"
                  style={{
                    borderColor:
                      watch('saude_hasMedicalSoftware') === opt ? '#ED8B3F' : 'transparent',
                  }}
                />
              </label>
            ))}
          </div>
          {errors.saude_hasMedicalSoftware && (
            <p className="text-sm text-red-600">{errors.saude_hasMedicalSoftware.message}</p>
          )}
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-heading-light dark:text-heading-dark">
            Qual o foco de volume que você busca? *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SAUDE_FOCUS.map((focus) => (
              <label
                key={focus}
                className="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none"
              >
                <input
                  type="radio"
                  className="sr-only"
                  value={focus}
                  {...register('saude_focus')}
                />
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <span className="block text-sm font-medium text-heading-light dark:text-heading-dark capitalize">
                      {focus}
                    </span>
                  </span>
                </span>
                <span
                  className="pointer-events-none absolute -inset-px rounded-lg border-2"
                  aria-hidden="true"
                  style={{
                    borderColor:
                      watch('saude_focus') === focus ? '#ED8B3F' : 'transparent',
                  }}
                />
              </label>
            ))}
          </div>
          {errors.saude_focus && (
            <p className="text-sm text-red-600">{errors.saude_focus.message}</p>
          )}
        </div>
      </div>
    );
  }

  if (businessSegment === 'comercio') {
    const channels = [
      { id: 'loja_fisica', label: 'Loja Física' },
      { id: 'ecommerce', label: 'E-commerce Próprio (Site)' },
      { id: 'instagram_whatsapp', label: 'Instagram e WhatsApp' },
      { id: 'marketplace', label: 'Marketplaces (MercadoLivre, Shopee, etc)' }
    ];

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center md:text-left mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-heading-light dark:text-heading-dark mb-2">
            Raio-X do Comércio
          </h2>
          <p className="text-text-light dark:text-text-dark text-sm md:text-base">
            Como funciona a rua dinâmica de vendas e estoque?
          </p>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-heading-light dark:text-heading-dark">
            Quais seus canais de venda atuais? (Selecione todos que se aplicam) *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {channels.map((channel) => (
              <label
                key={channel.id}
                className="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none"
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  value={channel.label}
                  {...register('comercio_salesChannel')}
                />
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <span className="block text-sm font-medium text-heading-light dark:text-heading-dark">
                      {channel.label}
                    </span>
                  </span>
                </span>
                <span
                  className="pointer-events-none absolute -inset-px rounded-lg border-2"
                  aria-hidden="true"
                  style={{
                    borderColor:
                      watch('comercio_salesChannel')?.includes(channel.label) ? '#ED8B3F' : 'transparent',
                  }}
                />
              </label>
            ))}
          </div>
          {errors.comercio_salesChannel && (
            <p className="text-sm text-red-600">{errors.comercio_salesChannel.message}</p>
          )}
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-heading-light dark:text-heading-dark">
            Qual seu formato principal de venda? *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {COMERCIO_SALES_TYPE.map((opt) => (
              <label
                key={opt}
                className="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none"
              >
                <input
                  type="radio"
                  className="sr-only"
                  value={opt}
                  {...register('comercio_salesType')}
                />
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <span className="block text-sm font-medium text-heading-light dark:text-heading-dark capitalize">
                      {opt === 'varejo_atacado' ? 'Varejo e Atacado' : opt}
                    </span>
                  </span>
                </span>
                <span
                  className="pointer-events-none absolute -inset-px rounded-lg border-2"
                  aria-hidden="true"
                  style={{
                    borderColor:
                      watch('comercio_salesType') === opt ? '#ED8B3F' : 'transparent',
                  }}
                />
              </label>
            ))}
          </div>
          {errors.comercio_salesType && (
            <p className="text-sm text-red-600">{errors.comercio_salesType.message}</p>
          )}
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-heading-light dark:text-heading-dark">
            Como funciona a sua logística principal hoje? *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {COMERCIO_LOGISTICS.map((opt) => (
              <label
                key={opt}
                className="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none"
              >
                <input
                  type="radio"
                  className="sr-only"
                  value={opt}
                  {...register('comercio_logistics')}
                />
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <span className="block text-sm font-medium text-heading-light dark:text-heading-dark capitalize">
                      Entrega {opt}
                    </span>
                  </span>
                </span>
                <span
                  className="pointer-events-none absolute -inset-px rounded-lg border-2"
                  aria-hidden="true"
                  style={{
                    borderColor:
                      watch('comercio_logistics') === opt ? '#ED8B3F' : 'transparent',
                  }}
                />
              </label>
            ))}
          </div>
          {errors.comercio_logistics && (
            <p className="text-sm text-red-600">{errors.comercio_logistics.message}</p>
          )}
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-heading-light dark:text-heading-dark">
            Você possui um sistema ERP ou gerenciador de estoque atual? *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {YES_NO.map((opt) => (
              <label
                key={opt}
                className="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none"
              >
                <input
                  type="radio"
                  className="sr-only"
                  value={opt}
                  {...register('comercio_hasERP')}
                />
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <span className="block text-sm font-medium text-heading-light dark:text-heading-dark capitalize">
                      {opt === 'sim' ? 'Sim, controlo o estoque via sistema' : 'Não, faço manual ou não tenho'}
                    </span>
                  </span>
                </span>
                <span
                  className="pointer-events-none absolute -inset-px rounded-lg border-2"
                  aria-hidden="true"
                  style={{
                    borderColor:
                      watch('comercio_hasERP') === opt ? '#ED8B3F' : 'transparent',
                  }}
                />
              </label>
            ))}
          </div>
          {errors.comercio_hasERP && (
            <p className="text-sm text-red-600">{errors.comercio_hasERP.message}</p>
          )}
        </div>
      </div>
    );
  }

  if (businessSegment === 'servicos') {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center md:text-left mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-heading-light dark:text-heading-dark mb-2">
            Raio-X de Serviços
          </h2>
          <p className="text-text-light dark:text-text-dark text-sm md:text-base">
            Entenda e maximize suas contratações mapeando a forma como você atrai contatos hoje.
          </p>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-heading-light dark:text-heading-dark">
            Qual o modelo principal de fechamento do seu serviço? *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SERVICOS_CLOSURE_MODEL.map((opt) => (
              <label
                key={opt}
                className="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none"
              >
                <input
                  type="radio"
                  className="sr-only"
                  value={opt}
                  {...register('servicos_closureModel')}
                />
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <span className="block text-sm font-medium text-heading-light dark:text-heading-dark capitalize">
                      {opt === 'orcamento' ? 'Orçamento Personalizado' : opt === 'visita' ? 'Visita Técnica' : 'Tabela de Preço Fixa'}
                    </span>
                  </span>
                </span>
                <span
                  className="pointer-events-none absolute -inset-px rounded-lg border-2"
                  aria-hidden="true"
                  style={{
                    borderColor:
                      watch('servicos_closureModel') === opt ? '#ED8B3F' : 'transparent',
                  }}
                />
              </label>
            ))}
          </div>
          {errors.servicos_closureModel && (
            <p className="text-sm text-red-600">{errors.servicos_closureModel.message}</p>
          )}
        </div>

        <Input
          label="Em média, qual o volume de propostas enviadas mensalmente? *"
          placeholder="Ex: Entre 10 a 30, Mais de 50 propostas, etc."
          error={errors.servicos_proposalVolume?.message}
          {...register('servicos_proposalVolume')}
        />

        <Input
          label="Qual é a principal dor/obstáculo da sua equipe comercial hoje? *"
          placeholder="Ex: Muitos contatos não qualificados (só curiosos), Preço da concorrência, Demora no retorno..."
          error={errors.servicos_mainPainPoint?.message}
          {...register('servicos_mainPainPoint')}
        />
      </div>
    );
  }

  // Fallback (segmentos sem Raio-X dedicado)
  const painPointsError = errors.genericRaioXPainPoints?.message;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center md:text-left mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-heading-light dark:text-heading-dark mb-2">
          Raio-X de Negócios
        </h2>
        <p className="text-text-light dark:text-text-dark text-sm md:text-base">
          Marque o que mais se aplica hoje. Se quiser, complemente com detalhes no campo abaixo.
        </p>
      </div>

      <div className="space-y-3">
        <span className="block text-sm font-medium text-heading-light dark:text-heading-dark">
          O que mais te incomoda em vendas ou em atrair clientes?{' '}
          <span className="text-red-500">*</span>
        </span>
        <p className="text-xs text-text-light/70 dark:text-text-dark/70">
          Selecione uma ou mais opções.
        </p>
        <div className="grid gap-3 sm:grid-cols-1">
          {GENERIC_RAIOX_PAIN_OPTIONS.map((opt) => (
            <label
              key={opt.id}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border bg-white p-4 shadow-sm transition-all hover:border-primary/35 ${
                painPointsError ? 'border-red-300' : 'border-gray-200'
              }`}
            >
              <input
                type="checkbox"
                value={opt.id}
                {...register('genericRaioXPainPoints')}
                className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium text-heading-light dark:text-heading-dark">{opt.label}</span>
            </label>
          ))}
        </div>
        {painPointsError && (
          <p className="text-sm text-red-600" role="alert">
            {painPointsError}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <label
          htmlFor="briefing-raiox-detalhes"
          className="block text-sm font-medium text-heading-light dark:text-heading-dark"
        >
          Quer detalhar melhor? (opcional)
        </label>
        <textarea
          id="briefing-raiox-detalhes"
          rows={4}
          maxLength={500}
          placeholder="Ex.: horários de pico, tipo de cliente, o que já tentou fazer…"
          className={`
            block w-full rounded-lg border bg-white px-4 py-3 text-heading-light dark:bg-surface-dark dark:text-heading-dark
            focus:outline-none focus:ring-2 focus:border-transparent transition-shadow
            ${
              errors.outro_operationDetails
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300 focus:ring-primary hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
            }
          `}
          {...register('outro_operationDetails')}
        />
        {errors.outro_operationDetails && (
          <p className="text-sm text-red-600">{errors.outro_operationDetails.message}</p>
        )}
      </div>
    </div>
  );
}
