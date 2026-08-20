'use client'

import React, { useState, useEffect, useRef } from 'react'
import { X, Monitor, Tablet, Smartphone, Info } from 'lucide-react'

/* ──────────────────────────────────────────────────────────
   LRH INFO MODAL
   Conteúdo: Resumo do projeto + Manual de Responsividade
   ────────────────────────────────────────────────────────── */
function LrhModal({ onClose }: { onClose: () => void }) {
  // Fecha com Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-label="Informações do LimaRH"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm" />

      {/* Modal Panel */}
      <div
        className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl
          bg-white dark:bg-zinc-900
          border border-[var(--border-subtle)] dark:border-[#2ECC71]/30
          shadow-2xl dark:shadow-[0_0_40px_rgba(46,204,113,0.15)]
          animate-[lrh-modal-in_0.3s_cubic-bezier(0.34,1.56,0.64,1)_forwards]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-5 pb-4
          border-b border-[var(--border-subtle)] dark:border-zinc-800
          bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[var(--primary)]/10 dark:bg-[#2ECC71]/10 flex items-center justify-center">
              <Info className="h-4.5 w-4.5 text-[var(--primary)] dark:text-[#2ECC71]" size={18} />
            </div>
            <div>
              <h2 className="text-base font-black text-[var(--foreground)] tracking-tight">
                Lima<span className="text-[var(--primary)] dark:text-[#2ECC71]">RH</span> — Informações do Sistema
              </h2>
              <p className="text-[11px] text-[var(--muted-foreground)] font-medium">Plataforma Integrada de RH</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center
              text-[var(--muted-foreground)] hover:text-[var(--foreground)]
              hover:bg-[var(--muted)] dark:hover:bg-zinc-800
              transition-colors duration-150"
            aria-label="Fechar modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-6">

          {/* ── Seção 1: Resumo do Projeto ── */}
          <section>
            <h3 className="text-sm font-bold text-[var(--foreground)] mb-3 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] dark:bg-[#2ECC71] inline-block" />
              Resumo do Projeto
            </h3>
            <div className="rounded-xl bg-[var(--muted)] dark:bg-zinc-800/60 p-4 space-y-3 text-[13px] text-[var(--foreground)] leading-relaxed">
              <p>
                <strong className="text-[var(--primary)] dark:text-[#2ECC71]">LimaRH</strong> é uma plataforma integrada
                de Gestão de Recursos Humanos desenvolvida para centralizar e automatizar os principais processos de RH em
                uma única interface moderna e responsiva.
              </p>
              <p>
                O sistema cobre todo o ciclo de vida do colaborador — desde a contratação até o desenvolvimento de carreira —
                organizando as operações em módulos especializados que se comunicam entre si em tempo real.
              </p>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {[
                  { label: 'HRIS', desc: 'Cadastro e perfil de colaboradores (CLT/PJ)' },
                  { label: 'ATS', desc: 'Recrutamento, vagas e pipeline de candidatos' },
                  { label: 'Performance', desc: 'PDI, 1:1s, Feedbacks SBI e avaliações' },
                  { label: 'Ocorrências', desc: 'Registros disciplinares e atestados médicos' },
                ].map((m) => (
                  <div key={m.label} className="rounded-lg bg-white dark:bg-zinc-900 border border-[var(--border-subtle)] dark:border-zinc-700 p-2.5">
                    <span className="block text-[11px] font-black text-[var(--primary)] dark:text-[#2ECC71] tracking-wider mb-0.5">{m.label}</span>
                    <span className="text-[11px] text-[var(--muted-foreground)]">{m.desc}</span>
                  </div>
                ))}
              </div>
              <p className="text-[12px] text-[var(--muted-foreground)]">
                Construído com <strong>Next.js 16</strong>, <strong>React 19</strong>, <strong>Tailwind CSS v4</strong> e
                <strong> Supabase</strong> como backend. Suporta tema claro e escuro com paletas específicas por modo.
              </p>
            </div>
          </section>

          {/* ── Seção 2: Manual de Responsividade ── */}
          <section>
            <h3 className="text-sm font-bold text-[var(--foreground)] mb-3 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] dark:bg-[#2ECC71] inline-block" />
              Manual de Responsividade
            </h3>
            <p className="text-[12px] text-[var(--muted-foreground)] mb-3">
              A interface do LimaRH adapta-se automaticamente a três contextos principais. Conheça os comportamentos de cada um:
            </p>

            {/* Desktop */}
            <div className="rounded-xl border border-[var(--border-subtle)] dark:border-zinc-700 overflow-hidden mb-3">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)]/8 dark:bg-[#2ECC71]/8 border-b border-[var(--border-subtle)] dark:border-zinc-700">
                <Monitor size={14} className="text-[var(--primary)] dark:text-[#2ECC71]" />
                <span className="text-[12px] font-bold text-[var(--foreground)]">Desktop</span>
                <span className="ml-auto text-[10px] font-semibold text-[var(--muted-foreground)] bg-[var(--muted)] dark:bg-zinc-800 rounded-full px-2 py-0.5">≥ 1024px</span>
              </div>
              <div className="p-4 space-y-2 text-[12px] text-[var(--foreground)]">
                <ul className="space-y-1.5 text-[var(--muted-foreground)]">
                  <li className="flex gap-2"><span className="text-[var(--primary)] dark:text-[#2ECC71] font-bold mt-0.5">→</span> <span>Sidebar fixa à esquerda com navegação completa e animação LRH no rodapé.</span></li>
                  <li className="flex gap-2"><span className="text-[var(--primary)] dark:text-[#2ECC71] font-bold mt-0.5">→</span> <span>Header com barra de pesquisa expandida, botões de tema e notificações.</span></li>
                  <li className="flex gap-2"><span className="text-[var(--primary)] dark:text-[#2ECC71] font-bold mt-0.5">→</span> <span>Cards exibidos em grid de 2 a 4 colunas com padding completo (<code className="bg-[var(--muted)] dark:bg-zinc-800 rounded px-1">p-6</code>).</span></li>
                  <li className="flex gap-2"><span className="text-[var(--primary)] dark:text-[#2ECC71] font-bold mt-0.5">→</span> <span>Tabelas e listas com colunas completas e dados completos visíveis.</span></li>
                  <li className="flex gap-2"><span className="text-[var(--primary)] dark:text-[#2ECC71] font-bold mt-0.5">→</span> <span>Dialogs e modais centralizados com largura máxima (<code className="bg-[var(--muted)] dark:bg-zinc-800 rounded px-1">max-w-2xl</code>).</span></li>
                </ul>
              </div>
            </div>

            {/* Tablet */}
            <div className="rounded-xl border border-[var(--border-subtle)] dark:border-zinc-700 overflow-hidden mb-3">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)]/8 dark:bg-[#2ECC71]/8 border-b border-[var(--border-subtle)] dark:border-zinc-700">
                <Tablet size={14} className="text-[var(--primary)] dark:text-[#2ECC71]" />
                <span className="text-[12px] font-bold text-[var(--foreground)]">Tablet</span>
                <span className="ml-auto text-[10px] font-semibold text-[var(--muted-foreground)] bg-[var(--muted)] dark:bg-zinc-800 rounded-full px-2 py-0.5">768px – 1023px</span>
              </div>
              <div className="p-4 space-y-2 text-[12px] text-[var(--foreground)]">
                <ul className="space-y-1.5 text-[var(--muted-foreground)]">
                  <li className="flex gap-2"><span className="text-[var(--primary)] dark:text-[#2ECC71] font-bold mt-0.5">→</span> <span>Sidebar recolhida (apenas ícones) ou abre como drawer ao tocar no menu.</span></li>
                  <li className="flex gap-2"><span className="text-[var(--primary)] dark:text-[#2ECC71] font-bold mt-0.5">→</span> <span>Header com pesquisa reduzida e controles essenciais visíveis.</span></li>
                  <li className="flex gap-2"><span className="text-[var(--primary)] dark:text-[#2ECC71] font-bold mt-0.5">→</span> <span>Grid de cards reduz para 2 colunas com padding intermediário (<code className="bg-[var(--muted)] dark:bg-zinc-800 rounded px-1">p-4</code>).</span></li>
                  <li className="flex gap-2"><span className="text-[var(--primary)] dark:text-[#2ECC71] font-bold mt-0.5">→</span> <span>Fontes e espaçamentos ligeiramente menores para melhor densidade.</span></li>
                  <li className="flex gap-2"><span className="text-[var(--primary)] dark:text-[#2ECC71] font-bold mt-0.5">→</span> <span>Dialogs e modais ocupam 90% da largura da tela.</span></li>
                </ul>
              </div>
            </div>

            {/* Mobile */}
            <div className="rounded-xl border border-[var(--border-subtle)] dark:border-zinc-700 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)]/8 dark:bg-[#2ECC71]/8 border-b border-[var(--border-subtle)] dark:border-zinc-700">
                <Smartphone size={14} className="text-[var(--primary)] dark:text-[#2ECC71]" />
                <span className="text-[12px] font-bold text-[var(--foreground)]">Mobile</span>
                <span className="ml-auto text-[10px] font-semibold text-[var(--muted-foreground)] bg-[var(--muted)] dark:bg-zinc-800 rounded-full px-2 py-0.5">≤ 767px</span>
              </div>
              <div className="p-4 space-y-2 text-[12px] text-[var(--foreground)]">
                <ul className="space-y-1.5 text-[var(--muted-foreground)]">
                  <li className="flex gap-2"><span className="text-[var(--primary)] dark:text-[#2ECC71] font-bold mt-0.5">→</span> <span>Sidebar oculta. Navegação pelo menu inferior (bottom nav) com ícones e rótulos.</span></li>
                  <li className="flex gap-2"><span className="text-[var(--primary)] dark:text-[#2ECC71] font-bold mt-0.5">→</span> <span>Header compacto: animação LRH no topo esquerdo, ícones de ação à direita.</span></li>
                  <li className="flex gap-2"><span className="text-[var(--primary)] dark:text-[#2ECC71] font-bold mt-0.5">→</span> <span>Cards em coluna única com padding reduzido (<code className="bg-[var(--muted)] dark:bg-zinc-800 rounded px-1">p-3</code>) e fontes compactas.</span></li>
                  <li className="flex gap-2"><span className="text-[var(--primary)] dark:text-[#2ECC71] font-bold mt-0.5">→</span> <span>Tabelas convertem para cards empilhados ou exibem colunas essenciais.</span></li>
                  <li className="flex gap-2"><span className="text-[var(--primary)] dark:text-[#2ECC71] font-bold mt-0.5">→</span> <span>Modais e drawers ocupam 100% da largura, deslizando da parte inferior da tela.</span></li>
                  <li className="flex gap-2"><span className="text-[var(--primary)] dark:text-[#2ECC71] font-bold mt-0.5">→</span> <span>Menu mobile no dark: fundo <code className="bg-[var(--muted)] dark:bg-zinc-800 rounded px-1">bg-zinc-900</code> com borda verde neon de separação.</span></li>
                  <li className="flex gap-2"><span className="text-[var(--primary)] dark:text-[#2ECC71] font-bold mt-0.5">→</span> <span>Menu mobile no light: fundo claro com borda de separação destacada.</span></li>
                </ul>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="pt-2 border-t border-[var(--border-subtle)] dark:border-zinc-800 flex items-center justify-between">
            <p className="text-[11px] text-[var(--muted-foreground)]">
              Lima<span className="font-bold text-[var(--primary)] dark:text-[#2ECC71]">RH</span> v0.1.0 — Ecossistema Integrado de RH
            </p>
            <button
              onClick={onClose}
              className="text-[11px] font-semibold px-3 py-1.5 rounded-lg
                bg-[var(--primary)] dark:bg-[#2ECC71]
                text-white dark:text-black
                hover:bg-[var(--primary-hover)] dark:hover:bg-[#27AE60]
                transition-colors duration-150"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────
   LRH ANIMATION COMPONENT
   - Execução única ao montar (sem loop)
   - Desktop: 3 bolinhas sobem → texto unificado "LRH" + legenda "LimaRH"
   - Mobile:  mesma animação cai do topo e se fixa
   - Clicável: abre modal informativo
   ────────────────────────────────────────────────────────── */

interface LrhAnimationProps {
  variant?: 'desktop' | 'mobile'
}

export function LrhAnimation({ variant = 'desktop' }: LrhAnimationProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [phase, setPhase] = useState<'dots' | 'text' | 'settled'>('dots')
  const phaseRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Fase 1: bolinhas (0 – 2.4s)
    phaseRef.current = setTimeout(() => {
      setPhase('text')
      // Fase 2: texto surge (2.4s – 4s)
      phaseRef.current = setTimeout(() => {
        setPhase('settled')
      }, 1600)
    }, 2400)

    return () => {
      if (phaseRef.current) clearTimeout(phaseRef.current)
    }
  }, [])

  /* ── MOBILE ── */
  if (variant === 'mobile') {
    return (
      <>
        <button
          onClick={() => setModalOpen(true)}
          className="relative flex items-center gap-1.5 select-none rounded-lg px-2 py-1 -ml-1
            hover:bg-[var(--muted)] dark:hover:bg-zinc-800 transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
          title="Ver informações do LimaRH"
          aria-label="Abrir informações do LimaRH"
        >
          {/* Bolinhas (fase inicial) */}
          {phase === 'dots' && (
            <div className="flex items-center gap-1.5" aria-hidden="true">
              {[0, 150, 300].map((delay) => (
                <span
                  key={delay}
                  className="h-2 w-2 rounded-full bg-[var(--primary)] dark:bg-[#2ECC71]
                    shadow-[0_0_6px_var(--primary)] dark:shadow-[0_0_8px_#2ECC71]"
                  style={{
                    animation: `lrh-dot-drop-mobile 2.4s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms forwards`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Texto "LRH" unificado + legenda (fases text e settled) */}
          {(phase === 'text' || phase === 'settled') && (
            <div
              className="flex flex-col items-start leading-none"
              style={{
                animation: phase === 'text'
                  ? 'lrh-text-in 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards'
                  : 'none',
              }}
            >
              <span
                className="font-black text-[15px] tracking-tighter leading-none
                  text-[var(--primary)] dark:text-[#2ECC71]
                  drop-shadow-[0_0_6px_var(--primary)] dark:drop-shadow-[0_0_8px_#2ECC71]"
              >
                LRH
              </span>
              <span className="text-[9px] font-semibold text-[var(--muted-foreground)] tracking-wide leading-none mt-0.5">
                LimaRH
              </span>
            </div>
          )}
        </button>

        {modalOpen && <LrhModal onClose={() => setModalOpen(false)} />}
      </>
    )
  }

  /* ── DESKTOP ── */
  return (
    <>
      <div className="p-4 border-t border-[var(--border-subtle)]">
        <button
          onClick={() => setModalOpen(true)}
          className="w-full relative p-4 rounded-xl text-left
            bg-[var(--secondary)] dark:bg-zinc-900/90
            border border-[var(--border-subtle)] dark:border-[#2ECC71]/30
            shadow-xs hover:border-[var(--primary)] dark:hover:border-[#2ECC71]/60
            hover:shadow-[var(--glow-shadow-hover)]
            transition-all duration-300 overflow-hidden
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
          title="Ver informações do LimaRH"
          aria-label="Abrir informações do LimaRH"
        >
          {/* Glow ambient */}
          <div className="absolute -inset-1 bg-gradient-to-tr from-[var(--primary)]/8 via-transparent to-[var(--primary)]/8 dark:from-[#2ECC71]/12 dark:via-transparent dark:to-[#2ECC71]/12 opacity-75 blur-sm" />

          <div className="relative flex flex-col items-center justify-center min-h-[80px] text-center">

            {/* Fase 1: Bolinhas subindo por baixo */}
            {phase === 'dots' && (
              <div className="flex items-end justify-center gap-3" aria-hidden="true">
                {[0, 200, 400].map((delay) => (
                  <span
                    key={delay}
                    className="h-3.5 w-3.5 rounded-full
                      bg-[var(--primary)] dark:bg-[#2ECC71]
                      shadow-[0_0_12px_var(--primary)] dark:shadow-[0_0_16px_#2ECC71]"
                    style={{
                      animation: `lrh-dot-rise-desktop 2.4s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms forwards`,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Fase 2+: Texto "LRH" unificado */}
            {(phase === 'text' || phase === 'settled') && (
              <div
                className="flex flex-col items-center gap-1"
                style={{
                  animation: phase === 'text'
                    ? 'lrh-text-in 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards'
                    : 'none',
                }}
              >
                <span
                  className="font-black text-3xl tracking-tight leading-none
                    text-[var(--primary)] dark:text-[#2ECC71]
                    drop-shadow-[0_0_12px_var(--primary)] dark:drop-shadow-[0_0_16px_#2ECC71]"
                >
                  LRH
                </span>
                <span className="text-[11px] font-semibold text-[var(--muted-foreground)] tracking-widest uppercase">
                  LimaRH
                </span>
              </div>
            )}

            {/* Shimmer (só na fase settled) */}
            {phase === 'settled' && (
              <div
                className="absolute inset-y-0 -left-full w-3/4 bg-gradient-to-r from-transparent via-white/15 dark:via-[#2ECC71]/20 to-transparent pointer-events-none"
                style={{ animation: 'lrh-shimmer-once 1.5s ease-in-out 0.5s forwards' }}
              />
            )}
          </div>
        </button>
      </div>

      {modalOpen && <LrhModal onClose={() => setModalOpen(false)} />}
    </>
  )
}
