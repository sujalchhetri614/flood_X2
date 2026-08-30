import { useEffect, useState } from 'react';
import {
  FileText,
  FileSpreadsheet,
  FileJson,
  Users,
  Route,
  Hospital,
  School,
  ShieldAlert,
} from 'lucide-react';

import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import AuthorityLayout from '@/components/authority/AuthorityLayout';
import { LoadingState } from '@/components/authority/States';
import {
  analyticsData,
  floodRiskByZone,
  rainfallVsFloodRisk,
  infrastructureExposure,
  roadsAtRiskOverTime,
  historicalFloodComparison,
} from '@/data/authorityMockData';
import type { ChartDataPoint } from '@/types/authority';

const RISK_BAR_COLORS: Record<number, string> = {
  0: 'bg-risk-low',
  1: 'bg-risk-moderate',
  2: 'bg-risk-high',
  3: 'bg-risk-critical',
};

function getRiskColor(value: number): string {
  if (value >= 80) return 'bg-risk-critical';
  if (value >= 60) return 'bg-risk-high';
  if (value >= 40) return 'bg-risk-moderate';
  return 'bg-risk-low';
}

function BarChart({ data, title, maxVal = 100, secondary = false }: { data: ChartDataPoint[]; title: string; maxVal?: number; secondary?: boolean }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
      <h3 className="mb-4 text-sm font-semibold text-navy">{title}</h3>
      <div className="flex h-48 items-end justify-between gap-2 sm:gap-4">
        {data.map((point) => (
          <div key={point.label} className="flex flex-1 flex-col items-center gap-1.5">
            <span className="text-xs font-bold text-ink">{point.value}</span>
            <div className="flex w-full flex-1 flex-col items-center justify-end gap-0.5">
              {secondary && point.secondary != null && (
                <div
                  className="w-full rounded-t bg-blue-secondary/40"
                  style={{
                    height: `${Math.min(
                      ((point.secondary ?? 0) / maxVal) * 100,
                      100
                    )}%`,
                  }}
                  title={`Rainfall: ${point.secondary}`}
                />
              )}
              <div
                className={`w-full rounded-t transition-all duration-300 ${getRiskColor(point.value)}`}
                style={{
                  height: `${Math.min(
                    (point.value / maxVal) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
            <span className="text-xs font-medium text-ink-muted">{point.label}</span>
          </div>
        ))}
      </div>
      {secondary && (
        <div className="mt-3 flex items-center justify-center gap-4 text-xs text-ink-muted">
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-blue-secondary/40" /> Rainfall</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-risk-high" /> Flood Risk</span>
        </div>
      )}
    </div>
  );
}

const TOP_METRICS = [
  { key: 'populationExposed', label: 'Population Exposed', icon: Users, color: 'text-blue-primary' },
  { key: 'roadsAffected', label: 'Roads Affected', icon: Route, color: 'text-risk-high' },
  { key: 'hospitalsAtRisk', label: 'Hospitals at Risk', icon: Hospital, color: 'text-risk-critical' },
  { key: 'schoolsAtRisk', label: 'Schools at Risk', icon: School, color: 'text-risk-moderate' },
  { key: 'criticalZones', label: 'Critical Zones', icon: ShieldAlert, color: 'text-risk-critical' },
] as const;

export default function AuthorityAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [exportMsg, setExportMsg] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const handleExport = (format: string) => {
    const reportData = [
      {
        Metric: 'Population Exposed',
        Value: analyticsData.populationExposed,
      },
      {
        Metric: 'Roads Affected',
        Value: analyticsData.roadsAffected,
      },
      {
        Metric: 'Hospitals at Risk',
        Value: analyticsData.hospitalsAtRisk,
      },
      {
        Metric: 'Schools at Risk',
        Value: analyticsData.schoolsAtRisk,
      },
      {
        Metric: 'Critical Zones',
        Value: analyticsData.criticalZones,
      },
    ];

    if (format === 'CSV') {
      const worksheet = XLSX.utils.json_to_sheet(reportData);
      const csv = XLSX.utils.sheet_to_csv(worksheet);

      const blob = new Blob([csv], {
        type: 'text/csv;charset=utf-8;',
      });

      saveAs(blob, 'flood-impact-analytics.csv');

      setExportMsg('CSV report downloaded successfully.');
    }

    if (format === 'Excel') {
      const worksheet = XLSX.utils.json_to_sheet(reportData);

      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        'Analytics',
      );

      XLSX.writeFile(
        workbook,
        'flood-impact-analytics.xlsx',
      );

      setExportMsg('Excel report downloaded successfully.');
    }

    if (format === 'PDF') {
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text(
        'FLOOD X - Impact Analysis & Analytics',
        20,
        20,
      );

      doc.setFontSize(11);

      let y = 35;

      reportData.forEach((item) => {
        doc.text(
          `${item.Metric}: ${item.Value}`,
          20,
          y,
        );

        y += 10;
      });

      doc.save('flood-impact-analytics.pdf');

      setExportMsg('PDF report downloaded successfully.');
    }

    setTimeout(() => {
      setExportMsg(null);
    }, 2500);
  };

  if (loading) {
    return (
      <AuthorityLayout>
        <LoadingState message="Loading analytics data..." />
      </AuthorityLayout>
    );
  }

  return (
    <AuthorityLayout>
      <div className="animate-fade-in">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-h2 font-bold text-navy-dark">Impact Analysis & Analytics</h1>
            <p className="mt-1 text-[15px] text-ink-muted">City-wide flood impact metrics and trend analysis</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => handleExport('PDF')} className="flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2 text-sm font-medium text-ink-muted shadow-card transition-colors hover:bg-blue-light hover:text-navy">
              <FileText className="h-4 w-4" aria-hidden="true" /> PDF
            </button>
            <button onClick={() => handleExport('Excel')} className="flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2 text-sm font-medium text-ink-muted shadow-card transition-colors hover:bg-blue-light hover:text-navy">
              <FileSpreadsheet className="h-4 w-4" aria-hidden="true" /> Excel
            </button>
            <button
              onClick={() => handleExport('CSV')}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2 text-sm font-medium text-ink-muted shadow-card transition-colors hover:bg-blue-light hover:text-navy"
            >
              <FileText
                className="h-4 w-4"
                aria-hidden="true"
              />
              CSV
            </button>
          </div>
        </div>

        {exportMsg && (
          <div className="mb-4 rounded-xl border border-blue-secondary/30 bg-blue-light px-4 py-3 text-sm font-medium text-blue-primary animate-slide-in">
            {exportMsg}
          </div>
        )}

        {/* Top Metrics */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {TOP_METRICS.map(({ key, label, icon: Icon, color }) => (
            <div key={key} className="rounded-2xl border border-border bg-white p-4 shadow-card">
              <Icon className={`h-5 w-5 ${color}`} aria-hidden="true" />
              <p className="mt-2 text-2xl font-bold text-navy-dark">
                {key === 'populationExposed' ? analyticsData.populationExposed.toLocaleString() : analyticsData[key]}
              </p>
              <p className="mt-0.5 text-xs font-medium text-ink-muted">{label}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <BarChart data={floodRiskByZone} title="Flood Risk by Zone" maxVal={100} />
          <BarChart data={rainfallVsFloodRisk} title="Rainfall vs Flood Risk" maxVal={100} secondary />
          <BarChart data={infrastructureExposure} title="Infrastructure Exposure" maxVal={10} />
          <BarChart data={roadsAtRiskOverTime} title="Roads at Risk Over Time" maxVal={25} />
        </div>

        <div className="mt-5">
          <BarChart data={historicalFloodComparison} title="Historical Flood Comparison (Max Risk %)" maxVal={100} />
        </div>

        <p className="mt-4 text-xs text-ink-muted/70">Prototype data — analytics are simulated for demonstration</p>
      </div>
    </AuthorityLayout>
  );
}
