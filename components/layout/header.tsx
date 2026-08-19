'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Briefcase, Users, FileText, X, ArrowRight, CornerDownLeft } from 'lucide-react'
import { NotificationDropdown } from '@/components/layout/notification-dropdown'
import { ThemeToggle } from '@/components/theme-toggle'
import { Badge } from '@/components/ui/badge'
import { INITIAL_MOCK_JOBS } from '@/lib/mock-data'
import { INITIAL_MOCK_EMPLOYEES } from '@/lib/hris-mock'
import { INITIAL_MOCK_DISCIPLINARY, INITIAL_MOCK_CERTIFICATES } from '@/lib/ocorrencias-mock'

interface SearchResultItem {
  id: string
  title: string
  subtitle: string
  category: 'vaga' | 'colaborador' | 'ocorrencia'
  href: string
  badge?: string
}

export function Header() {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Filtragem dinâmica de resultados agregados
  const trimmed = searchValue.trim().toLowerCase()

  const matchingJobs: SearchResultItem[] = !trimmed
    ? []
    : INITIAL_MOCK_JOBS.filter(
        (j) =>
          j.title.toLowerCase().includes(trimmed) ||
          j.department.toLowerCase().includes(trimmed) ||
          j.contract_type.toLowerCase().includes(trimmed)
      ).map((j) => ({
        id: j.id,
        title: j.title,
        subtitle: `${j.department} • ${j.contract_type} • ${j.workplace_model}`,
        category: 'vaga' as const,
        href: `/ats/${j.id}`,
        badge: j.status === 'aberta' ? 'Vaga Aberta' : j.status,
      }))

  const matchingEmployees: SearchResultItem[] = !trimmed
    ? []
    : INITIAL_MOCK_EMPLOYEES.filter(
        (e) =>
          e.full_name.toLowerCase().includes(trimmed) ||
          e.job_title.toLowerCase().includes(trimmed) ||
          e.email.toLowerCase().includes(trimmed) ||
          e.department.toLowerCase().includes(trimmed)
      ).map((e) => ({
        id: e.id,
        title: e.full_name,
        subtitle: `${e.job_title} • ${e.department} (${e.contract_type})`,
        category: 'colaborador' as const,
        href: `/colaboradores/${e.id}`,
        badge: e.status,
      }))

  const matchingDisciplinary: SearchResultItem[] = !trimmed
    ? []
    : INITIAL_MOCK_DISCIPLINARY.filter(
        (d) =>
          d.employee_name.toLowerCase().includes(trimmed) ||
          d.reason.toLowerCase().includes(trimmed)
      ).map((d) => ({
        id: d.id,
        title: `Medida: ${d.employee_name}`,
        subtitle: `${d.type.replace('_', ' ')} • ${d.reason.slice(0, 45)}...`,
        category: 'ocorrencia' as const,
        href: '/ocorrencias',
        badge: 'Ocorrencia',
      }))

  const matchingCertificates: SearchResultItem[] = !trimmed
    ? []
    : INITIAL_MOCK_CERTIFICATES.filter(
        (c) =>
          c.employee_name.toLowerCase().includes(trimmed) ||
          (c.cid && c.cid.toLowerCase().includes(trimmed))
      ).map((c) => ({
        id: c.id,
        title: `Atestado: ${c.employee_name}`,
        subtitle: `${c.days_count} dias • CID: ${c.cid || 'Nao informado'}`,
        category: 'ocorrencia' as const,
        href: '/ocorrencias',
        badge: c.status,
      }))

  const allResults: SearchResultItem[] = [
    ...matchingJobs,
    ...matchingEmployees,
    ...matchingDisciplinary,
    ...matchingCertificates,
  ].slice(0, 8)

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Resetar seleção ao mudar busca
  useEffect(() => {
    setSelectedIndex(0)
  }, [searchValue])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || allResults.length === 0) {
      if (e.key === 'Enter' && searchValue.trim()) {
        router.push(`/ats?search=${encodeURIComponent(searchValue.trim())}`)
      }
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % allResults.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + allResults.length) % allResults.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const selected = allResults[selectedIndex]
      if (selected) {
        setIsOpen(false)
        router.push(selected.href)
      } else if (searchValue.trim()) {
        setIsOpen(false)
        router.push(`/ats?search=${encodeURIComponent(searchValue.trim())}`)
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'vaga':
        return <Briefcase className="h-4 w-4 text-[var(--primary)]" />
      case 'colaborador':
        return <Users className="h-4 w-4 text-sky-500" />
      default:
        return <FileText className="h-4 w-4 text-amber-500" />
    }
  }

  return (
    <header className="h-16 border-b border-[var(--border-subtle)] bg-[var(--background)] px-4 sm:px-8
      flex items-center justify-between shrink-0 transition-colors duration-200 z-30 relative">

      {/* Search Input with Auto-complete Dropdown */}
      <div ref={containerRef} className="relative w-72 sm:w-80 md:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)] pointer-events-none" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => {
            if (searchValue.trim()) setIsOpen(true)
          }}
          onKeyDown={handleKeyDown}
          placeholder="Buscar vagas, colaboradores, documentos..."
          className="
            w-full h-9 pl-9 pr-8 rounded-lg text-xs
            bg-[var(--secondary)] border border-[var(--border-subtle)]
            text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]
            focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent
            transition-all duration-200
          "
        />

        {searchValue && (
          <button
            type="button"
            onClick={() => {
              setSearchValue('')
              setIsOpen(false)
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-0.5 rounded"
            title="Limpar busca"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Dropdown de Sugestoes e Resultados */}
        {isOpen && searchValue.trim().length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-[var(--background)] border border-[var(--border-subtle)] rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in-0 zoom-in-95 duration-100">
            {allResults.length > 0 ? (
              <div className="py-2 divide-y divide-[var(--border-subtle)] max-h-96 overflow-y-auto">
                <div className="px-3 py-1.5 flex items-center justify-between text-[11px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                  <span>Resultados ({allResults.length})</span>
                  <span className="text-[10px] lowercase text-[var(--muted-foreground)] flex items-center gap-1">
                    use as setas e <CornerDownLeft className="h-2.5 w-2.5 inline" />
                  </span>
                </div>

                <div className="py-1">
                  {allResults.map((item, idx) => (
                    <Link
                      key={`${item.category}-${item.id}-${idx}`}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 transition-colors cursor-pointer ${
                        idx === selectedIndex
                          ? 'bg-[var(--accent)] text-[var(--foreground)]'
                          : 'hover:bg-[var(--secondary)] text-[var(--foreground)]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <div className="p-1.5 rounded-md bg-[var(--secondary)] shrink-0">
                          {getCategoryIcon(item.category)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate text-[var(--foreground)]">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-[var(--muted-foreground)] truncate">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {item.badge && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--secondary)] border border-[var(--border-subtle)] text-[var(--foreground)] capitalize">
                            {item.badge}
                          </span>
                        )}
                        <ArrowRight className="h-3.5 w-3.5 text-[var(--muted-foreground)] opacity-60" />
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Footer Link to full ATS search */}
                <div className="p-2 bg-[var(--secondary)]/40 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false)
                      router.push(`/ats?search=${encodeURIComponent(searchValue.trim())}`)
                    }}
                    className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center justify-center gap-1 w-full py-1"
                  >
                    <span>Ver todos os resultados no painel de Vagas</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-6 px-4 text-center text-xs text-[var(--muted-foreground)]">
                <p className="font-semibold text-[var(--foreground)]">Nenhum resultado encontrado</p>
                <p className="text-[11px] mt-0.5">
                  Nao encontramos vagas, colaboradores ou documentos para &quot;{searchValue}&quot;.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <NotificationDropdown />
      </div>
    </header>
  )
}