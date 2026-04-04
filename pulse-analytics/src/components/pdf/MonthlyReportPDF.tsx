'use client';

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';

const lightStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    color: '#131b2e',
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#0058be',
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: '#0058be',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#505f76',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#8892b0',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#131b2e',
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e8eaf0',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 20,
  },
  statBox: {
    width: '23%',
    padding: 15,
    backgroundColor: '#faf8ff',
    borderRadius: 8,
  },
  statLabel: {
    fontSize: 10,
    color: '#505f76',
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 700,
    color: '#0058be',
  },
  table: {
    width: '100%',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f4ff',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e8eaf0',
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
  },
  tableCellHeader: {
    flex: 1,
    fontSize: 10,
    fontWeight: 700,
    color: '#505f76',
    textTransform: 'uppercase',
  },
  insightBox: {
    backgroundColor: '#f0f9ff',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#0058be',
    marginBottom: 10,
  },
  insightTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: '#0058be',
    marginBottom: 6,
  },
  insightText: {
    fontSize: 11,
    color: '#505f76',
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 10,
    color: '#8892b0',
    borderTopWidth: 1,
    borderTopColor: '#e8eaf0',
    paddingTop: 15,
  },
});

const darkStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    color: '#e2e8f0',
    backgroundColor: '#0f172a',
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: '#60a5fa',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#64748b',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#f1f5f9',
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 20,
  },
  statBox: {
    width: '23%',
    padding: 15,
    backgroundColor: '#1e293b',
    borderRadius: 8,
  },
  statLabel: {
    fontSize: 10,
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 700,
    color: '#60a5fa',
  },
  table: {
    width: '100%',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
    color: '#e2e8f0',
  },
  tableCellHeader: {
    flex: 1,
    fontSize: 10,
    fontWeight: 700,
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  insightBox: {
    backgroundColor: '#1e293b',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#60a5fa',
    marginBottom: 10,
  },
  insightTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: '#60a5fa',
    marginBottom: 6,
  },
  insightText: {
    fontSize: 11,
    color: '#cbd5e1',
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 10,
    color: '#64748b',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 15,
  },
});

interface ReportData {
  monthYear: string;
  stats: {
    totalOrganicReach: string;
    totalPaidReach: string;
    totalAdSpend: string;
    avgEngRate: string;
    totalFollowers: string;
    roas: string;
  };
  topOrganicPosts: Array<{
    rank: string;
    title: string;
    platform: string;
    value: string;
  }>;
  topPaidPosts: Array<{
    rank: string;
    title: string;
    platform: string;
    value: string;
  }>;
  insights: Array<{
    type: 'success' | 'warning';
    text: string;
  }>;
  contentPlan: Array<{
    num: string;
    title: string;
    desc: string;
  }>;
}

interface MonthlyReportPDFProps {
  data: ReportData;
  /** Align PDF with app light/dark theme */
  colorMode?: 'light' | 'dark';
}

export default function MonthlyReportPDF({ data, colorMode = 'light' }: MonthlyReportPDFProps) {
  const styles = colorMode === 'dark' ? darkStyles : lightStyles;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Pulse Analytics</Text>
          <Text style={styles.subtitle}>Monthly Performance Report</Text>
          <Text style={styles.date}>{data.monthYear}</Text>
        </View>

        {/* Key Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Organic Reach</Text>
              <Text style={styles.statValue}>{data.stats.totalOrganicReach}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Paid Reach</Text>
              <Text style={styles.statValue}>{data.stats.totalPaidReach}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Ad Spend</Text>
              <Text style={styles.statValue}>{data.stats.totalAdSpend}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Engagement Rate</Text>
              <Text style={styles.statValue}>{data.stats.avgEngRate}</Text>
            </View>
          </View>
        </View>

        {/* Top Organic Posts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Organic Posts</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCellHeader, { flex: 0.5 }]}>Rank</Text>
              <Text style={[styles.tableCellHeader, { flex: 2 }]}>Post</Text>
              <Text style={[styles.tableCellHeader, { flex: 1 }]}>Platform</Text>
              <Text style={[styles.tableCellHeader, { flex: 1 }]}>Views</Text>
            </View>
            {data.topOrganicPosts.map((post, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 0.5 }]}>#{post.rank}</Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>{post.title}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{post.platform}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{post.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Key Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Insights</Text>
          {data.insights.slice(0, 3).map((insight, index) => (
            <View key={index} style={styles.insightBox}>
              <Text style={styles.insightTitle}>
                {insight.type === 'success' ? '✓ Success' : '⚠ Opportunity'}
              </Text>
              <Text style={styles.insightText}>{insight.text}</Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated by Pulse Analytics • {new Date().toLocaleDateString()}</Text>
        </View>
      </Page>

      {/* Second Page: Content Plan */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI-Generated Content Plan</Text>
          {data.contentPlan.map((item, index) => (
            <View key={index} style={[styles.insightBox, { marginBottom: 20 }]}>
              <Text style={styles.insightTitle}>Priority {item.num}: {item.title}</Text>
              <Text style={styles.insightText}>{item.desc}</Text>
            </View>
          ))}
        </View>

        {/* Top Paid Posts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Paid / Boosted Posts</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCellHeader, { flex: 0.5 }]}>Rank</Text>
              <Text style={[styles.tableCellHeader, { flex: 2 }]}>Post</Text>
              <Text style={[styles.tableCellHeader, { flex: 1 }]}>Platform</Text>
              <Text style={[styles.tableCellHeader, { flex: 1 }]}>ROAS</Text>
            </View>
            {data.topPaidPosts.map((post, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 0.5 }]}>#{post.rank}</Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>{post.title}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{post.platform}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{post.value}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
}
