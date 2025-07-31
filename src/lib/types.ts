

export interface ClientData {
  id: string;
  clientName: string;
  campaign: string;
  status: 'Ativa' | 'Pausada' | 'Concluída';
}

export interface KpiCardData {
  title: string;
  value: string;
  change: string;
  previousValue: string;
}

export interface ReportData {
  reportTitle: string;
  kpiCards: KpiCardData[];
}
