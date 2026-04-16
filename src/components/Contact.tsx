'use client';

import FadeIn from './ui/FadeIn';

export default function Contact() {
  return (
    <section
      id="contact"
      style={{ background: '#131313', padding: '96px 0', position: 'relative', overflow: 'hidden' }}
    >
      {/* Glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '400px',
          height: '400px',
          background: '#ff5625',
          opacity: 0.05,
          filter: 'blur(100px)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />

      <div className="section-container" style={{ maxWidth: '85vw', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '64px',
            alignItems: 'start',
          }}
        >
          {/* Left */}
          <FadeIn delay={0.1} direction="right">
          <div>
            <span
              style={{
                fontSize: 'var(--fs-eyebrow)',
                fontWeight: 700,
                color: '#ff5625',
                letterSpacing: 'var(--ls-eyebrow)',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '16px',
              }}
            >
              Vamos conversar
            </span>
            <h2
              style={{
                fontSize: 'var(--fs-h2)',
                fontWeight: 900,
                color: '#fff',
                lineHeight: 1.05,
                margin: '0 0 24px',
              }}
            >
              Vamos Construir<br />
              <span style={{ color: '#ff5625' }}>Algo Melhor</span><br />
              Juntos?
            </h2>
            <p style={{ fontSize: 'var(--fs-body-lg)', color: '#a8a29e', lineHeight: 1.7, maxWidth: '400px', margin: '0 0 40px' }}>
              Se você tem um produto com potencial que ainda não chegou onde deveria, este é o
              momento certo para mudar isso.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="material-symbols-outlined" style={{ color: '#ff5625', fontSize: '20px' }}>mail</span>
                <span style={{ color: '#a8a29e', fontSize: 'var(--fs-body-lg)' }}>tiagosilvamagno@gmail.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="material-symbols-outlined" style={{ color: '#ff5625', fontSize: '20px' }}>phone</span>
                <span style={{ color: '#a8a29e', fontSize: 'var(--fs-body-lg)' }}>+55 92 98116-8163</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="material-symbols-outlined" style={{ color: '#ff5625', fontSize: '20px' }}>open_in_new</span>
                <a href="https://www.linkedin.com/in/tiagosmagno/" target="_blank" rel="noopener noreferrer" style={{ color: '#a8a29e', fontSize: 'var(--fs-body-lg)', textDecoration: 'none' }}>linkedin.com/in/tiagosmagno</a>
              </div>
            </div>
          </div>
          </FadeIn>

          {/* Right: Form */}
          <FadeIn delay={0.3} direction="left" style={{ height: '100%' }}>
          <div className="contact-form-card">
            <style>{`
              .contact-form-card {
                background: #1c1b1b;
                border: 1px solid #2a2a2a;
                border-radius: 20px;
                padding: 40px;
              }
              .contact-form-card input,
              .contact-form-card select,
              .contact-form-card textarea {
                width: 100%;
                box-sizing: border-box;
                background: #131313;
                border: 1px solid #2a2a2a;
                border-radius: 8px;
                padding: 12px 16px;
                color: #fff;
                font-size: var(--fs-body);
                font-family: inherit;
                outline: none;
              }
              .contact-form-card select {
                color: #a8a29e;
                appearance: none;
                -webkit-appearance: none;
              }
              .contact-form-card textarea {
                resize: none;
              }
              .contact-form-card input::placeholder,
              .contact-form-card textarea::placeholder {
                color: #4a4a4a;
              }
              @media (max-width: 767px) {
                .contact-form-card {
                  padding: 20px;
                }
                .contact-fields-grid {
                  grid-template-columns: 1fr !important;
                }
              }
            `}</style>
            <form action="https://formsubmit.co/tiagosilvamagno@gmail.com" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <input type="hidden" name="_captcha" value="false" />

              {/* Name + Email */}
              <div className="contact-fields-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  { label: 'Nome', name: 'name', type: 'text', placeholder: 'Seu nome' },
                  { label: 'E-mail', name: 'email', type: 'email', placeholder: 'seu@email.com' },
                ].map(({ label, name, type, placeholder }) => (
                  <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: 'var(--fs-eyebrow)', fontWeight: 700, color: '#a8a29e', textTransform: 'uppercase', letterSpacing: 'var(--ls-eyebrow)' }}>
                      {label}
                    </label>
                    <input type={type} name={name} placeholder={placeholder} required />
                  </div>
                ))}
              </div>

              {/* Budget */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: 'var(--fs-eyebrow)', fontWeight: 700, color: '#a8a29e', textTransform: 'uppercase', letterSpacing: 'var(--ls-eyebrow)' }}>
                  Qual o seu orçamento?
                </label>
                <select name="budget">
                  <option value="">Selecione uma faixa</option>
                  <option value="Até R$ 5.000">Até R$ 5.000</option>
                  <option value="R$ 5k – R$ 10k">R$ 5k – R$ 10k</option>
                  <option value="R$ 10k – R$ 30k">R$ 10k – R$ 30k</option>
                  <option value="Acima de R$ 30k">Acima de R$ 30k</option>
                </select>
              </div>

              {/* Message */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: 'var(--fs-eyebrow)', fontWeight: 700, color: '#a8a29e', textTransform: 'uppercase', letterSpacing: 'var(--ls-eyebrow)' }}>
                  Mensagem
                </label>
                <textarea name="message" rows={4} required placeholder="Descreva seu projeto ou desafio..." />
              </div>

              {/* Submit */}
              <button
                type="submit"
                style={{
                  background: '#ff5625',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 'var(--fs-btn)',
                  padding: '16px',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                }}
              >
                Enviar Briefing
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>send</span>
              </button>
            </form>
          </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}


