import { useCallback, useEffect, useState } from 'react'
import type { DiagnosticsResult } from './collector'
import { diagnosticSections, formatDiagnostics } from './contract'
import { requestDiagnostics } from './extension'
import './styles.css'

/** The same snapshot powers the visible rows and clipboard across both products. */
export function DiagnosticsPage() {
  const [result, setResult] = useState<DiagnosticsResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [copyFallback, setCopyFallback] = useState(false)
  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    setCopied(false)
    setCopyFallback(false)
    try {
      setResult(await requestDiagnostics())
    } catch {
      setError('无法收集诊断信息，请刷新后重试。')
    } finally {
      setLoading(false)
    }
  }, [])
  useEffect(() => {
    void refresh()
  }, [refresh])
  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  const copy = () => {
    if (!result) return
    // Keep the clipboard write in the user's gesture; collection happens separately.
    try {
      void navigator.clipboard
        .writeText(formatDiagnostics(result.snapshot))
        .then(() => {
          setCopied(true)
          setCopyFallback(false)
        })
        .catch(() => setCopyFallback(true))
    } catch {
      setCopyFallback(true)
    }
  }

  return (
    <section
      className="browseros-diagnostics ph-no-capture"
      aria-labelledby="diagnostics-title"
    >
      <p className="diagnostics-breadcrumb">
        帮助 <span>/</span> 诊断信息
      </p>
      <div className="diagnostics-header">
        <div>
          <h1 id="diagnostics-title">诊断信息</h1>
          <p>查看版本与系统详情，帮助排查问题。</p>
        </div>
        <div className="diagnostics-actions">
          <button
            type="button"
            onClick={() => void refresh()}
            disabled={loading}
          >
            <span aria-hidden="true">↻</span>{' '}
            {loading ? '正在刷新…' : '刷新'}
          </button>
          <button
            type="button"
            className="diagnostics-copy"
            onClick={copy}
            disabled={!result || loading}
          >
            {copied ? '已复制' : '复制诊断信息'}
          </button>
        </div>
      </div>
      <p className="diagnostics-timestamp" role="status">
        {result
          ? `${result.cached ? '缓存记录' : '采集时间'} · ${new Date(result.snapshot.collectedAt).toLocaleString('zh-CN')}`
          : loading
            ? '正在收集诊断信息…'
            : '暂无可用记录'}
      </p>
      {error && (
        <p role="alert">
          {error}
          {result ? ' 当前显示的是上一次的记录。' : ''}
        </p>
      )}
      {result &&
        diagnosticSections(result.snapshot).map((section) => (
          <section
            className="diagnostics-section"
            key={section.title}
            aria-label={section.title}
          >
            <div className="diagnostics-section-heading">
              <h2>{section.title}</h2>
              {section.title === '内存' && <span>采集时的系统数据</span>}
            </div>
            <dl>
              {section.rows.map(([label, value]) => (
                <div className="diagnostics-row" key={label}>
                  <dt>{label}</dt>
                  <dd>{value ?? '不可用'}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      {result && (
        <p className="diagnostics-note">
          复制内容仅包含以上诊断详情和采集时间，不包含浏览历史或账户信息。
        </p>
      )}
      {copyFallback && result && (
        <label className="diagnostics-fallback">
          剪贴板不可用，请选中后复制以下详情：
          <textarea
            readOnly
            value={formatDiagnostics(result.snapshot)}
            onFocus={(event) => event.currentTarget.select()}
            rows={16}
          />
        </label>
      )}
    </section>
  )
}
