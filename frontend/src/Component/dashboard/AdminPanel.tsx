import React, { useEffect, useState } from 'react';
import { api, type AdminApplication, type AdminStats, type CommitteeOption } from '../../lib/api';
import './AdminPanel.css';

const pageSize = 10;
const statusOptions = ['SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED', 'WAITLISTED', 'REJECTED', 'WITHDRAWN'];

interface AdminApplicationRowProps {
  application: AdminApplication;
  committees: CommitteeOption[];
  onChanged: () => void;
}

const AdminApplicationRow: React.FC<AdminApplicationRowProps> = ({ application, committees, onChanged }) => {
  const [status, setStatus] = useState(application.status);
  const [committeeCode, setCommitteeCode] = useState(application.allocation?.committee.code ?? '');
  const [portfolioId, setPortfolioId] = useState(application.allocation?.portfolio.id ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const committee = committees.find((item) => item.code === committeeCode);

  const runAction = async (action: () => Promise<unknown>) => {
    setIsSaving(true);
    setError(null);
    try {
      await action();
      onChanged();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'The action failed');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <tr>
      <td>
        <strong>{application.reference}</strong>
        <span>{application.fullName}</span>
        <span>{application.email}</span>
      </td>
      <td>{application.institution}</td>
      <td>{application.preferences.map(({ committee: preference }) => preference.code).join(' → ')}</td>
      <td>{application.status.replaceAll('_', ' ')}</td>
      <td>
        <div className="admin-row-actions">
          <select aria-label={`New status for ${application.reference}`} value={status} onChange={(event) => setStatus(event.target.value)}>
            {statusOptions.map((option) => <option key={option} value={option}>{option.replaceAll('_', ' ')}</option>)}
          </select>
          <button type="button" disabled={isSaving || status === application.status} onClick={() => { void runAction(() => api.admin.updateStatus(application.id, status)); }}>
            Update status
          </button>
          {application.status === 'ACCEPTED' && (
            <>
              <select aria-label={`Committee allocation for ${application.reference}`} value={committeeCode} onChange={(event) => {
                setCommitteeCode(event.target.value);
                setPortfolioId('');
              }}>
                <option value="">Select committee</option>
                {committees.map(({ code, name }) => <option key={code} value={code}>{code} — {name}</option>)}
              </select>
              <select aria-label={`Portfolio allocation for ${application.reference}`} value={portfolioId} onChange={(event) => setPortfolioId(event.target.value)} disabled={!committee}>
                <option value="">Select portfolio</option>
                {committee?.portfolios.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
              </select>
              <button type="button" disabled={isSaving || !committeeCode || !portfolioId || application.allocation?.status === 'ALLOCATED'} onClick={() => { void runAction(() => api.admin.allocate(application.id, committeeCode, portfolioId)); }}>
                Allocate
              </button>
              {application.allocation?.status === 'ALLOCATED' && (
                <button type="button" disabled={isSaving} onClick={() => { void runAction(() => api.admin.unallocate(application.id)); }}>
                  Unallocate
                </button>
              )}
            </>
          )}
          {error && <span className="admin-inline-error" role="alert">{error}</span>}
        </div>
      </td>
    </tr>
  );
};

export const AdminPanel: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [committees, setCommittees] = useState<CommitteeOption[]>([]);
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadCounter, setReloadCounter] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void Promise.all([
      api.admin.stats(),
      api.admin.applications({
        page,
        pageSize,
        ...(appliedSearch ? { q: appliedSearch } : {}),
        ...(statusFilter ? { status: statusFilter } : {}),
      }),
      api.committees.list(),
    ]).then(([nextStats, result, availableCommittees]) => {
      if (!active) return;
      setStats(nextStats);
      setApplications(result.items);
      setTotal(result.total);
      setTotalPages(result.totalPages);
      setCommittees(availableCommittees);
      setError(null);
    }).catch((loadError: unknown) => {
      if (active) setError(loadError instanceof Error ? loadError.message : 'Unable to load administrative data');
    }).finally(() => {
      if (active) setIsLoading(false);
    });
    return () => {
      active = false;
    };
  }, [appliedSearch, page, reloadCounter, statusFilter]);

  const refresh = () => {
    setIsLoading(true);
    setReloadCounter((current) => current + 1);
  };

  const downloadExport = async () => {
    setError(null);
    try {
      const file = await api.admin.export({
        ...(appliedSearch ? { q: appliedSearch } : {}),
        ...(statusFilter ? { status: statusFilter } : {}),
      });
      const url = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'litmun-applications.csv';
      link.click();
      URL.revokeObjectURL(url);
    } catch (exportError) {
      setError(exportError instanceof Error ? exportError.message : 'Unable to export applications');
    }
  };

  return (
    <section className="admin-panel" aria-labelledby="admin-panel-heading">
      <div className="admin-panel-heading">
        <div>
          <h2 id="admin-panel-heading">Application Management</h2>
          <p>Database-backed application review and committee allocation.</p>
        </div>
      </div>
      {error && <p className="admin-error" role="alert">{error}</p>}
      <div className="admin-stats-grid">
        {[
          ['Users', stats?.totalUsers],
          ['Applications', stats?.totalApplications],
          ['Awaiting review', stats?.awaitingReview],
          ['Under review', stats?.underReview],
          ['Accepted', stats?.accepted],
          ['Awaiting allocation', stats?.awaitingAllocation],
          ['Allocated', stats?.allocatedDelegates],
        ].map(([label, value]) => (
          <div className="admin-stat-card" key={label}>
            <span>{label}</span>
            <strong>{value ?? '—'}</strong>
          </div>
        ))}
      </div>

      <form className="admin-filters" onSubmit={(event) => {
        event.preventDefault();
        setPage(1);
        setAppliedSearch(search.trim());
      }}>
        <label>
          Search
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Reference, delegate, or email" />
        </label>
        <label>
          Status
          <select value={statusFilter} onChange={(event) => {
            setPage(1);
            setStatusFilter(event.target.value);
          }}>
            <option value="">All statuses</option>
            {statusOptions.map((option) => <option key={option} value={option}>{option.replaceAll('_', ' ')}</option>)}
          </select>
        </label>
        <button type="submit">Search applications</button>
        <button type="button" onClick={() => { void downloadExport(); }}>Export filtered CSV</button>
      </form>

      <div className="admin-table-wrap">
        <table className="admin-applications-table">
          <thead>
            <tr>
              <th>Delegate</th>
              <th>Institution</th>
              <th>Preferences</th>
              <th>Status</th>
              <th>Review / allocation</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <AdminApplicationRow key={application.id} application={application} committees={committees} onChanged={refresh} />
            ))}
          </tbody>
        </table>
        {isLoading && <p className="admin-table-message" role="status">Loading administrative data…</p>}
        {!isLoading && applications.length === 0 && <p className="admin-table-message">No matching applications.</p>}
      </div>
      <div className="admin-pagination">
        <span>{total} applications · page {page} of {Math.max(totalPages, 1)}</span>
        <div>
          <button type="button" disabled={page <= 1 || isLoading} onClick={() => setPage((current) => current - 1)}>Previous</button>
          <button type="button" disabled={page >= totalPages || isLoading} onClick={() => setPage((current) => current + 1)}>Next</button>
        </div>
      </div>
    </section>
  );
};
