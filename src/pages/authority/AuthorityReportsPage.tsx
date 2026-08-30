import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  Send,
  FileText,
  Camera,
  MapPin,
  RefreshCw,
  TrendingUp,
  Bell,
  Map,
  CheckCheck,
  Filter,
} from 'lucide-react';

import AuthorityLayout from '@/components/authority/AuthorityLayout';
import AuthorityRiskBadge from '@/components/authority/AuthorityRiskBadge';
import ConfirmationModal from '@/components/authority/ConfirmationModal';
import { LoadingState, EmptyState } from '@/components/authority/States';
import {
  authorityReports,
  realityCheckData,
} from '@/data/authorityMockData';

import type { AuthorityReport } from '@/types/authority';

const STATUS_FLOW: AuthorityReport['status'][] = [
  'new',
  'under-review',
  'verified',
  'dispatched',
  'resolved',
];

const STATUS_STYLES: Record<
  AuthorityReport['status'],
  string
> = {
  new: 'bg-risk-critical/10 text-risk-critical',
  'under-review':
    'bg-risk-moderate/10 text-risk-moderate',
  verified:
    'bg-blue-light text-blue-primary',
  rejected:
    'bg-ink-muted/10 text-ink-muted',
  dispatched:
    'bg-risk-high/10 text-risk-high',
  resolved:
    'bg-risk-low/10 text-risk-low',
};

type FilterStatus =
  | 'all'
  | AuthorityReport['status'];

type ActionType =
  | 'verify'
  | 'reject'
  | 'dispatch'
  | 'resolve'
  | 'alert'
  | 'map';

export default function AuthorityReportsPage() {
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(true);

  const [reports, setReports] =
    useState<AuthorityReport[]>(
      authorityReports,
    );

  const [selectedReport, setSelectedReport] =
    useState<AuthorityReport | null>(null);

  const [confirmAction, setConfirmAction] =
    useState<{
      type: ActionType;
      report: AuthorityReport;
    } | null>(null);

  const [successMsg, setSuccessMsg] =
    useState<string | null>(null);

  const [feedback, setFeedback] =
    useState('');

  const [filter, setFilter] =
    useState<FilterStatus>('all');

  useEffect(() => {
    const t = setTimeout(
      () => setLoading(false),
      500,
    );

    return () => clearTimeout(t);
  }, []);

  /*
   * UPDATE REPORT STATUS
   */

  const updateStatus = (
    reportId: string,
    newStatus: AuthorityReport['status'],
    feedbackMsg?: string,
  ) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === reportId
          ? {
              ...report,
              status: newStatus,
              authorityFeedback:
                feedbackMsg ??
                report.authorityFeedback,
            }
          : report,
      ),
    );

    setSelectedReport((prev) =>
      prev?.id === reportId
        ? {
            ...prev,
            status: newStatus,
            authorityFeedback:
              feedbackMsg ??
              prev.authorityFeedback,
          }
        : prev,
    );
  };

  /*
   * CONFIRM ACTION
   */

  const handleConfirm = () => {
    if (!confirmAction) return;

    const {
      type,
      report,
    } = confirmAction;

    if (type === 'verify') {
      const nextStatus: AuthorityReport['status'] =
        report.status === 'new'
          ? 'under-review'
          : 'verified';

      const msg =
        nextStatus === 'verified'
          ? feedback ||
            'Verified by authority team.'
          : 'Under review by authority team.';

      updateStatus(
        report.id,
        nextStatus,
        msg,
      );

      setSuccessMsg(
        nextStatus === 'verified'
          ? 'Report verified successfully.'
          : 'Report moved to under review.',
      );
    }

    if (type === 'reject') {
      updateStatus(
        report.id,
        'rejected',
        'Report rejected by authority.',
      );

      setSuccessMsg(
        'Report rejected successfully.',
      );
    }

    if (type === 'dispatch') {
      updateStatus(
        report.id,
        'dispatched',
        'Response team dispatched.',
      );

      setSuccessMsg(
        'Response team dispatched successfully.',
      );
    }

    if (type === 'resolve') {
      updateStatus(
        report.id,
        'resolved',
        'Incident resolved by authority team.',
      );

      setSuccessMsg(
        'Report marked as resolved.',
      );
    }

    if (type === 'alert') {
      setSuccessMsg(
        `Alert created for Report #${report.numericId}.`,
      );
    }

    if (type === 'map') {
      setSuccessMsg(
        `Flood map updated for ${report.zone}.`,
      );
    }

    setConfirmAction(null);
    setFeedback('');

    setTimeout(
      () => setSuccessMsg(null),
      3000,
    );
  };

  /*
   * FILTER REPORTS
   */

  const filteredReports = useMemo(() => {
    if (filter === 'all') {
      return reports;
    }

    return reports.filter(
      (report) =>
        report.status === filter,
    );
  }, [reports, filter]);

  /*
   * COUNTS
   */

  const reportCounts = useMemo(() => {
    return {
      all: reports.length,

      new: reports.filter(
        (r) => r.status === 'new',
      ).length,

      review: reports.filter(
        (r) =>
          r.status ===
          'under-review',
      ).length,

      verified: reports.filter(
        (r) => r.status === 'verified',
      ).length,

      dispatched: reports.filter(
        (r) =>
          r.status === 'dispatched',
      ).length,

      resolved: reports.filter(
        (r) => r.status === 'resolved',
      ).length,

      rejected: reports.filter(
        (r) => r.status === 'rejected',
      ).length,
    };
  }, [reports]);

  /*
   * LOADING
   */

  if (loading) {
    return (
      <AuthorityLayout>
        <LoadingState
          message="Loading citizen reports..."
        />
      </AuthorityLayout>
    );
  }

  return (
    <AuthorityLayout>
      <div className="animate-fade-in">

        {/* HEADER */}

        <div className="mb-6">

          <h1 className="text-h2 font-bold text-navy-dark">
            Citizen Reports Management
          </h1>

          <p className="mt-1 text-[15px] text-ink-muted">
            Review, verify, take action, and
            resolve citizen-submitted flood reports.
          </p>

        </div>


        {/* SUCCESS MESSAGE */}

        {successMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-risk-low/30 bg-risk-low/10 px-4 py-3 text-sm font-medium text-risk-low animate-slide-in">

            <CheckCircle2
              className="h-4 w-4"
              aria-hidden="true"
            />

            {successMsg}

          </div>
        )}


        {/* REPORT SUMMARY */}

        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">

          <div className="rounded-xl border border-border bg-white p-3 shadow-card">
            <p className="text-xs text-ink-muted">
              Total
            </p>

            <p className="mt-1 text-xl font-bold text-navy">
              {reportCounts.all}
            </p>
          </div>


          <div className="rounded-xl border border-risk-critical/20 bg-white p-3 shadow-card">
            <p className="text-xs text-ink-muted">
              New
            </p>

            <p className="mt-1 text-xl font-bold text-risk-critical">
              {reportCounts.new}
            </p>
          </div>


          <div className="rounded-xl border border-risk-moderate/20 bg-white p-3 shadow-card">
            <p className="text-xs text-ink-muted">
              Under Review
            </p>

            <p className="mt-1 text-xl font-bold text-risk-moderate">
              {reportCounts.review}
            </p>
          </div>


          <div className="rounded-xl border border-blue-primary/20 bg-white p-3 shadow-card">
            <p className="text-xs text-ink-muted">
              Verified
            </p>

            <p className="mt-1 text-xl font-bold text-blue-primary">
              {reportCounts.verified}
            </p>
          </div>


          <div className="rounded-xl border border-risk-high/20 bg-white p-3 shadow-card">
            <p className="text-xs text-ink-muted">
              Dispatched
            </p>

            <p className="mt-1 text-xl font-bold text-risk-high">
              {reportCounts.dispatched}
            </p>
          </div>


          <div className="rounded-xl border border-risk-low/20 bg-white p-3 shadow-card">
            <p className="text-xs text-ink-muted">
              Resolved
            </p>

            <p className="mt-1 text-xl font-bold text-risk-low">
              {reportCounts.resolved}
            </p>
          </div>


          <div className="rounded-xl border border-border bg-white p-3 shadow-card">
            <p className="text-xs text-ink-muted">
              Rejected
            </p>

            <p className="mt-1 text-xl font-bold text-ink-muted">
              {reportCounts.rejected}
            </p>
          </div>

        </div>


        {/* FILTERS */}

        <div className="mb-5 rounded-2xl border border-border bg-white p-4 shadow-card">

          <div className="flex items-center gap-2">

            <Filter
              className="h-4 w-4 text-blue-primary"
              aria-hidden="true"
            />

            <p className="text-sm font-semibold text-navy">
              Filter Reports
            </p>

          </div>


          <div className="mt-3 flex flex-wrap gap-2">

            {[
              {
                value: 'all',
                label: 'All',
              },
              {
                value: 'new',
                label: 'New',
              },
              {
                value: 'under-review',
                label: 'Under Review',
              },
              {
                value: 'verified',
                label: 'Verified',
              },
              {
                value: 'dispatched',
                label: 'Dispatched',
              },
              {
                value: 'resolved',
                label: 'Resolved',
              },
              {
                value: 'rejected',
                label: 'Rejected',
              },
            ].map((item) => (

              <button
                key={item.value}
                type="button"
                onClick={() =>
                  setFilter(
                    item.value as FilterStatus,
                  )
                }
                className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                  filter === item.value
                    ? 'border-navy bg-navy text-white'
                    : 'border-border bg-white text-ink-muted hover:border-blue-primary hover:text-navy'
                }`}
              >
                {item.label}
              </button>

            ))}

          </div>

        </div>


        {/* MAIN CONTENT */}

        <div className="grid gap-5 lg:grid-cols-3">

          {/* REPORT LIST */}

          <div className="lg:col-span-1">

            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-muted">
              Incoming Reports
            </h2>


            <div className="space-y-2">

              {filteredReports.length === 0 ? (

                <EmptyState
                  message="No reports found for this filter."
                />

              ) : (

                filteredReports.map(
                  (report) => (

                    <button
                      key={report.id}
                      type="button"
                      onClick={() =>
                        setSelectedReport(
                          report,
                        )
                      }
                      className={`w-full rounded-2xl border p-4 text-left shadow-card transition-all duration-200 ${
                        selectedReport?.id ===
                        report.id
                          ? 'border-blue-primary ring-2 ring-blue-primary/25'
                          : 'border-border hover:border-blue-primary'
                      }`}
                    >

                      <div className="flex items-center justify-between">

                        <span className="text-sm font-bold text-navy">
                          #{report.numericId}
                        </span>

                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[report.status]}`}
                        >
                          {report.status
                            .replace(
                              '-',
                              ' ',
                            )
                            .toUpperCase()}
                        </span>

                      </div>


                      <div className="mt-2 flex items-center justify-between">

                        <span className="flex items-center gap-1 text-xs text-ink-muted">

                          <MapPin
                            className="h-3 w-3"
                            aria-hidden="true"
                          />

                          {report.zone}

                        </span>

                        <AuthorityRiskBadge
                          level={report.severity}
                          size="sm"
                        />

                      </div>


                      <p className="mt-1 text-xs text-ink-muted">
                        {report.submittedAt}
                      </p>

                    </button>

                  ),
                )

              )}

            </div>

          </div>


          {/* DETAILS */}

          <div className="lg:col-span-2">

            {selectedReport ? (

              <div className="space-y-4">

                {/* REPORT DETAIL */}

                <div className="rounded-2xl border border-border bg-white p-6 shadow-card animate-slide-up">

                  <div className="flex flex-wrap items-center justify-between gap-3">

                    <div>

                      <p className="text-xs text-ink-muted">
                        Citizen Flood Report
                      </p>

                      <h2 className="text-xl font-bold text-navy-dark">
                        Report #{selectedReport.numericId}
                      </h2>

                    </div>

                    <AuthorityRiskBadge
                      level={
                        selectedReport.severity
                      }
                    />

                  </div>


                  {/* BASIC DETAILS */}

                  <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">

                    <div className="rounded-xl bg-surface p-3">
                      <dt className="text-xs text-ink-muted">
                        Location
                      </dt>

                      <dd className="mt-1 text-sm font-semibold text-navy">
                        {selectedReport.zone}
                      </dd>
                    </div>


                    <div className="rounded-xl bg-surface p-3">
                      <dt className="text-xs text-ink-muted">
                        Reported
                      </dt>

                      <dd className="mt-1 text-sm font-semibold text-navy">
                        {selectedReport.submittedAt}
                      </dd>
                    </div>


                    <div className="rounded-xl bg-surface p-3">
                      <dt className="text-xs text-ink-muted">
                        Citizen
                      </dt>

                      <dd className="mt-1 text-sm font-semibold text-navy">
                        {selectedReport.citizenName}
                      </dd>
                    </div>

                  </dl>


                  {/* DESCRIPTION */}

                  <div className="mt-4">

                    <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                      Citizen Description
                    </h3>

                    <p className="rounded-xl bg-surface p-3 text-sm text-ink">
                      "{selectedReport.description}"
                    </p>

                  </div>


                  {/* EVIDENCE */}

                  <div className="mt-4">

                    <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                      Evidence
                    </h3>

                    {selectedReport.hasPhoto ? (

                      <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3">

                        <Camera
                          className="h-5 w-5 text-blue-primary"
                          aria-hidden="true"
                        />

                        <div>

                          <p className="text-sm font-semibold text-navy">
                            Photo evidence available
                          </p>

                          <p className="text-xs text-ink-muted">
                            Citizen uploaded supporting evidence.
                          </p>

                        </div>

                      </div>

                    ) : (

                      <p className="text-sm text-ink-muted">
                        No photo evidence submitted.
                      </p>

                    )}

                  </div>


                  {/* STATUS */}

                  <div className="mt-4">

                    <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                      Status
                    </h3>

                    <div className="flex flex-wrap items-center gap-2">

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[selectedReport.status]}`}
                      >
                        {selectedReport.status
                          .replace(
                            '-',
                            ' ',
                          )
                          .toUpperCase()}
                      </span>

                      {selectedReport.status !==
                        'rejected' && (
                        <span className="text-xs text-ink-muted">
                          Step{' '}
                          {Math.max(
                            STATUS_FLOW.indexOf(
                              selectedReport.status,
                            ) + 1,
                            1,
                          )}{' '}
                          of{' '}
                          {STATUS_FLOW.length}
                        </span>
                      )}

                    </div>

                  </div>


                  {/* FEEDBACK */}

                  <div className="mt-4">

                    <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                      Authority Feedback
                    </h3>

                    <p className="text-sm text-ink">
                      {selectedReport.authorityFeedback ||
                        'No authority feedback yet.'}
                    </p>


                    {selectedReport.status !==
                      'verified' &&
                      selectedReport.status !==
                        'rejected' &&
                      selectedReport.status !==
                        'resolved' && (

                        <input
                          type="text"
                          value={feedback}
                          onChange={(e) =>
                            setFeedback(
                              e.target.value,
                            )
                          }
                          placeholder="Add feedback before verifying..."
                          className="mt-2 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-ink outline-none focus:border-blue-primary"
                        />

                      )}

                  </div>


                  {/* VERIFICATION ACTIONS */}

                  <div className="mt-6">

                    <h3 className="mb-3 text-sm font-semibold text-ink-muted">
                      Verification
                    </h3>

                    <div className="flex flex-wrap gap-3">

                      <button
                        type="button"
                        onClick={() =>
                          setConfirmAction({
                            type: 'verify',
                            report: selectedReport,
                          })
                        }
                        disabled={
                          selectedReport.status ===
                            'verified' ||
                          selectedReport.status ===
                            'rejected' ||
                          selectedReport.status ===
                            'resolved'
                        }
                        className="flex items-center gap-2 rounded-xl bg-risk-low/10 px-4 py-2.5 text-sm font-semibold text-risk-low transition-colors hover:bg-risk-low hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >

                        <CheckCircle2
                          className="h-4 w-4"
                          aria-hidden="true"
                        />

                        {selectedReport.status ===
                        'new'
                          ? 'Start Review'
                          : 'Verify Report'}

                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          setConfirmAction({
                            type: 'reject',
                            report: selectedReport,
                          })
                        }
                        disabled={
                          selectedReport.status ===
                            'rejected' ||
                          selectedReport.status ===
                            'resolved'
                        }
                        className="flex items-center gap-2 rounded-xl bg-risk-critical/10 px-4 py-2.5 text-sm font-semibold text-risk-critical transition-colors hover:bg-risk-critical hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >

                        <XCircle
                          className="h-4 w-4"
                          aria-hidden="true"
                        />

                        Reject Report

                      </button>

                    </div>

                  </div>


                  {/* RESPONSE ACTIONS */}

                  <div className="mt-6">

                    <h3 className="mb-3 text-sm font-semibold text-ink-muted">
                      Take Action
                    </h3>

                    <div className="flex flex-wrap gap-3">

                      <button
                        type="button"
                        onClick={() =>
                          setConfirmAction({
                            type: 'alert',
                            report: selectedReport,
                          })
                        }
                        disabled={
                          selectedReport.status ===
                            'rejected' ||
                          selectedReport.status ===
                            'resolved'
                        }
                        className="flex items-center gap-2 rounded-xl bg-risk-critical/10 px-4 py-2.5 text-sm font-semibold text-risk-critical transition-colors hover:bg-risk-critical hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >

                        <Bell
                          className="h-4 w-4"
                          aria-hidden="true"
                        />

                        Create Alert

                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          setConfirmAction({
                            type: 'map',
                            report: selectedReport,
                          })
                        }
                        disabled={
                          selectedReport.status ===
                            'rejected' ||
                          selectedReport.status ===
                            'resolved'
                        }
                        className="flex items-center gap-2 rounded-xl bg-blue-light px-4 py-2.5 text-sm font-semibold text-blue-primary transition-colors hover:bg-blue-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >

                        <Map
                          className="h-4 w-4"
                          aria-hidden="true"
                        />

                        Update Map

                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          setConfirmAction({
                            type: 'dispatch',
                            report: selectedReport,
                          })
                        }
                        disabled={
                          selectedReport.status ===
                            'dispatched' ||
                          selectedReport.status ===
                            'rejected' ||
                          selectedReport.status ===
                            'resolved'
                        }
                        className="flex items-center gap-2 rounded-xl bg-risk-high/10 px-4 py-2.5 text-sm font-semibold text-risk-high transition-colors hover:bg-risk-high hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >

                        <Send
                          className="h-4 w-4"
                          aria-hidden="true"
                        />

                        Dispatch Response

                      </button>

                    </div>

                  </div>


                  {/* RESOLVE */}

                  <div className="mt-6 border-t border-border pt-5">

                    <button
                      type="button"
                      onClick={() =>
                        setConfirmAction({
                          type: 'resolve',
                          report: selectedReport,
                        })
                      }
                      disabled={
                        selectedReport.status ===
                          'resolved' ||
                        selectedReport.status ===
                          'rejected'
                      }
                      className="flex items-center gap-2 rounded-xl bg-risk-low px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-risk-low/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                      <CheckCheck
                        className="h-4 w-4"
                        aria-hidden="true"
                      />

                      Close / Resolve Report

                    </button>

                  </div>

                </div>


                {/* REALITY CHECK */}

                <div className="rounded-2xl border border-blue-primary/30 bg-blue-light/30 p-5 shadow-card">

                  <div className="flex items-center gap-2">

                    <RefreshCw
                      className="h-5 w-5 text-blue-primary"
                      aria-hidden="true"
                    />

                    <h2 className="text-lg font-bold text-navy-dark">
                      Reality Check
                    </h2>

                  </div>


                  <p className="mt-1 text-xs text-ink-muted">
                    Model → Citizen Observation →
                    Authority Verification →
                    Risk Recalibration
                  </p>


                  <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">

                    <div className="rounded-xl bg-white p-3">
                      <dt className="text-xs text-ink-muted">
                        Model Risk
                      </dt>

                      <dd className="mt-1">
                        <AuthorityRiskBadge
                          level={
                            realityCheckData.modelRisk
                          }
                          size="sm"
                        />
                      </dd>
                    </div>


                    <div className="rounded-xl bg-white p-3">
                      <dt className="text-xs text-ink-muted">
                        Citizen Reports
                      </dt>

                      <dd className="mt-1 text-lg font-bold text-navy">
                        {realityCheckData.citizenReports}
                      </dd>
                    </div>


                    <div className="rounded-xl bg-white p-3">
                      <dt className="text-xs text-ink-muted">
                        Verified Reports
                      </dt>

                      <dd className="mt-1 text-lg font-bold text-navy">
                        {realityCheckData.verifiedReports}
                      </dd>
                    </div>


                    <div className="rounded-xl bg-white p-3">
                      <dt className="text-xs text-ink-muted">
                        Observed Water Depth
                      </dt>

                      <dd className="mt-1 text-sm font-bold text-navy">
                        {realityCheckData.observedWaterDepth}
                      </dd>
                    </div>


                    <div className="rounded-xl bg-white p-3">
                      <dt className="text-xs text-ink-muted">
                        Model Estimated Depth
                      </dt>

                      <dd className="mt-1 text-sm font-bold text-navy">
                        {realityCheckData.modelEstimatedDepth}
                      </dd>
                    </div>


                    <div className="rounded-xl bg-white p-3">
                      <dt className="text-xs text-ink-muted">
                        Ground Observation
                      </dt>

                      <dd className="mt-1">

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            realityCheckData.groundObservation ===
                            'confirmed'
                              ? 'bg-risk-low/10 text-risk-low'
                              : realityCheckData.groundObservation ===
                                'contradicted'
                              ? 'bg-risk-critical/10 text-risk-critical'
                              : 'bg-risk-moderate/10 text-risk-moderate'
                          }`}
                        >
                          {realityCheckData.groundObservation.toUpperCase()}
                        </span>

                      </dd>
                    </div>

                  </dl>


                  {/* RECALIBRATION */}

                  <div className="mt-4 rounded-xl border border-blue-primary/20 bg-white p-4">

                    <div className="flex items-center gap-2">

                      <TrendingUp
                        className="h-4 w-4 text-blue-primary"
                        aria-hidden="true"
                      />

                      <h3 className="text-sm font-bold text-navy">
                        Risk Recalibration
                      </h3>

                    </div>


                    <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3">

                      <div>
                        <p className="text-xs text-ink-muted">
                          Previous Risk
                        </p>

                        <p className="mt-0.5 text-lg font-bold text-ink-muted line-through">
                          {realityCheckData.previousRisk}%
                        </p>
                      </div>


                      <div>
                        <p className="text-xs text-ink-muted">
                          Updated Risk
                        </p>

                        <p className="mt-0.5 text-lg font-bold text-risk-high">
                          {realityCheckData.updatedRisk}%
                        </p>
                      </div>


                      <div>
                        <p className="text-xs text-ink-muted">
                          Updated Confidence
                        </p>

                        <p className="mt-0.5 text-lg font-bold text-risk-low">
                          {realityCheckData.updatedConfidence}%
                        </p>
                      </div>

                    </div>


                    <p className="mt-3 text-xs text-ink-muted">
                      <span className="font-semibold">
                        Reason:
                      </span>{' '}
                      {realityCheckData.recalibrationReason}
                    </p>


                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          '/authority/map',
                        )
                      }
                      className="mt-3 flex items-center gap-1.5 rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-dark"
                    >

                      <FileText
                        className="h-4 w-4"
                        aria-hidden="true"
                      />

                      View Updated Map

                    </button>

                  </div>


                  <p className="mt-3 text-xs text-ink-muted/70">
                    Prototype UI only — no actual
                    ML recalibration is performed.
                  </p>

                </div>

              </div>

            ) : (

              <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white p-12">

                <FileText
                  className="h-8 w-8 text-ink-muted/40"
                  aria-hidden="true"
                />

                <p className="mt-3 text-sm font-medium text-ink-muted">
                  Select a report to view details
                  and verification options.
                </p>

              </div>

            )}

          </div>

        </div>

      </div>


      {/* CONFIRMATION MODAL */}

      <ConfirmationModal
        open={confirmAction !== null}

        title={
          confirmAction?.type ===
          'verify'
            ? confirmAction.report.status ===
              'new'
              ? 'Start Review?'
              : 'Verify Report?'
            : confirmAction?.type ===
              'reject'
            ? 'Reject Report?'
            : confirmAction?.type ===
              'dispatch'
            ? 'Dispatch Response Team?'
            : confirmAction?.type ===
              'resolve'
            ? 'Resolve Report?'
            : confirmAction?.type ===
              'alert'
            ? 'Create Alert?'
            : 'Update Flood Map?'
        }

        message={
          confirmAction?.type ===
          'verify'
            ? confirmAction.report.status ===
              'new'
              ? `Report #${confirmAction.report.numericId} will be moved to UNDER REVIEW.`
              : `Report #${confirmAction.report.numericId} will be marked as VERIFIED.`

            : confirmAction?.type ===
              'reject'
            ? `Report #${confirmAction.report.numericId} will be rejected.`

            : confirmAction?.type ===
              'dispatch'
            ? `A response team will be dispatched for Report #${confirmAction.report.numericId}.`

            : confirmAction?.type ===
              'resolve'
            ? `Report #${confirmAction.report.numericId} will be marked as RESOLVED.`

            : confirmAction?.type ===
              'alert'
            ? `A public flood alert will be created for ${confirmAction.report.zone}.`

            : `The flood map will be updated for ${confirmAction?.report.zone}.`
        }

        confirmLabel={
          confirmAction?.type ===
          'verify'
            ? confirmAction.report.status ===
              'new'
              ? 'Start Review'
              : 'Verify'

            : confirmAction?.type ===
              'reject'
            ? 'Reject'

            : confirmAction?.type ===
              'dispatch'
            ? 'Dispatch'

            : confirmAction?.type ===
              'resolve'
            ? 'Resolve'

            : confirmAction?.type ===
              'alert'
            ? 'Create Alert'
            : 'Update Map'
        }

        onConfirm={handleConfirm}

        onCancel={() =>
          setConfirmAction(null)
        }
      />

    </AuthorityLayout>
  );
}