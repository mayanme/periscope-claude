/**
 * Generates fixtures/dummy-pitch-deck.pdf
 * Run: npm run generate-fixtures
 */
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import * as fs from "fs";
import * as path from "path";
import React from "react";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    padding: 50,
    backgroundColor: "#ffffff",
  },
  coverPage: {
    fontFamily: "Helvetica",
    padding: 60,
    backgroundColor: "#1e293b",
    justifyContent: "center",
  },
  section: { marginBottom: 20 },
  label: { fontSize: 9, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
  h1Cover: { fontSize: 36, color: "#ffffff", fontFamily: "Helvetica-Bold", marginBottom: 8 },
  tagline: { fontSize: 16, color: "#94a3b8", marginBottom: 32 },
  metaRow: { flexDirection: "row", gap: 24, marginBottom: 4 },
  metaItem: { fontSize: 11, color: "#cbd5e1" },
  h2: { fontSize: 20, fontFamily: "Helvetica-Bold", color: "#1e293b", marginBottom: 16 },
  body: { fontSize: 11, color: "#374151", lineHeight: 1.6, marginBottom: 8 },
  bullet: { fontSize: 11, color: "#374151", marginBottom: 6, lineHeight: 1.5 },
  bold: { fontFamily: "Helvetica-Bold" },
  chip: {
    backgroundColor: "#eff6ff", borderRadius: 4, paddingHorizontal: 8, paddingVertical: 4,
    fontSize: 10, color: "#1d4ed8", marginRight: 8, marginBottom: 8,
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 12 },
  card: {
    backgroundColor: "#f8fafc", borderRadius: 6, padding: 14,
    marginBottom: 12, borderWidth: 1, borderColor: "#e2e8f0",
  },
  cardTitle: { fontSize: 12, fontFamily: "Helvetica-Bold", color: "#1e293b", marginBottom: 4 },
  cardBody: { fontSize: 10, color: "#4b5563", lineHeight: 1.5 },
  metricRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  metric: { alignItems: "center", flex: 1 },
  metricValue: { fontSize: 22, fontFamily: "Helvetica-Bold", color: "#1d4ed8" },
  metricLabel: { fontSize: 9, color: "#6b7280", marginTop: 2 },
  pageNum: { position: "absolute", bottom: 24, right: 50, fontSize: 9, color: "#9ca3af" },
  divider: { borderBottomWidth: 1, borderBottomColor: "#e5e7eb", marginVertical: 16 },
  founderRow: { flexDirection: "row", gap: 16, marginBottom: 12 },
  founderCard: {
    flex: 1, backgroundColor: "#f8fafc", borderRadius: 6, padding: 12,
    borderWidth: 1, borderColor: "#e2e8f0",
  },
  founderName: { fontSize: 12, fontFamily: "Helvetica-Bold", color: "#1e293b", marginBottom: 2 },
  founderRole: { fontSize: 10, color: "#4f46e5", marginBottom: 6 },
  founderBio: { fontSize: 9, color: "#4b5563", lineHeight: 1.5 },
});

function Slide({
  children,
  cover = false,
  pageNumber,
}: {
  children?: React.ReactNode;
  cover?: boolean;
  pageNumber?: number;
}) {
  return React.createElement(
    Page,
    { size: "A4", style: cover ? styles.coverPage : styles.page },
    children,
    pageNumber !== undefined
      ? React.createElement(Text, { style: styles.pageNum }, `${pageNumber} / 8`)
      : null
  );
}

function Doc() {
  return React.createElement(
    Document,
    { title: "DataSync AI — Seed Round Pitch Deck", author: "DataSync AI" },
    // Slide 1: Cover
    React.createElement(
      Slide,
      { cover: true },
      React.createElement(Text, { style: styles.h1Cover }, "DataSync AI"),
      React.createElement(
        Text,
        { style: styles.tagline },
        "The intelligent data pipeline for mid-market enterprises"
      ),
      React.createElement(View, { style: styles.divider }),
      React.createElement(
        View,
        { style: styles.metaRow },
        React.createElement(Text, { style: styles.metaItem }, "Seed Round · $1.5M"),
        React.createElement(Text, { style: styles.metaItem }, "San Francisco, CA"),
        React.createElement(Text, { style: styles.metaItem }, "Founded 2023")
      ),
      React.createElement(
        Text,
        { style: { fontSize: 10, color: "#64748b", marginTop: 8 } },
        "datasyncai.io  ·  contact@datasyncai.io"
      )
    ),
    // Slide 2: Problem
    React.createElement(
      Slide,
      { pageNumber: 2 },
      React.createElement(Text, { style: styles.h2 }, "The Problem"),
      React.createElement(
        Text,
        { style: styles.body },
        "Mid-market companies (500–5,000 employees) are drowning in disconnected data. They have 15–40 SaaS tools that don't talk to each other, leading to:"
      ),
      React.createElement(Text, { style: styles.bullet }, "• 6-8 hours/week per analyst manually copying data between systems"),
      React.createElement(Text, { style: styles.bullet }, "• Decisions made on stale data (average data lag: 72 hours)"),
      React.createElement(Text, { style: styles.bullet }, "• $240K average annual cost in data engineering headcount per company"),
      React.createElement(Text, { style: styles.bullet }, "• Integration failures causing $50K–$500K in revenue leakage annually"),
      React.createElement(View, { style: styles.divider }),
      React.createElement(
        Text,
        { style: { ...styles.body, fontFamily: "Helvetica-Bold", color: "#1d4ed8" } },
        "Enterprise ETL tools (Fivetran, Informatica) are built for Fortune 500 IT teams — too complex and too expensive for mid-market ops teams."
      )
    ),
    // Slide 3: Solution
    React.createElement(
      Slide,
      { pageNumber: 3 },
      React.createElement(Text, { style: styles.h2 }, "Our Solution"),
      React.createElement(
        Text,
        { style: styles.body },
        "DataSync AI is a no-code data pipeline platform that uses AI to automatically map, clean, and sync data across enterprise SaaS tools — set up in hours, not months."
      ),
      React.createElement(
        View,
        { style: styles.card },
        React.createElement(Text, { style: styles.cardTitle }, "🔄 Auto-mapping"),
        React.createElement(
          Text,
          { style: styles.cardBody },
          "AI detects data schemas across connected tools and automatically creates transformation rules. No SQL, no ETL code."
        )
      ),
      React.createElement(
        View,
        { style: styles.card },
        React.createElement(Text, { style: styles.cardTitle }, "⚡ Real-time sync"),
        React.createElement(
          Text,
          { style: styles.cardBody },
          "Sub-60 second data freshness across all connected systems. Native connectors for Salesforce, HubSpot, NetSuite, Shopify, and 80+ others."
        )
      ),
      React.createElement(
        View,
        { style: styles.card },
        React.createElement(Text, { style: styles.cardTitle }, "🛡️ AI-powered data quality"),
        React.createElement(
          Text,
          { style: styles.cardBody },
          "Automated anomaly detection flags data errors before they propagate. 99.98% accuracy on data transformation tasks."
        )
      )
    ),
    // Slide 4: Market
    React.createElement(
      Slide,
      { pageNumber: 4 },
      React.createElement(Text, { style: styles.h2 }, "Market Opportunity"),
      React.createElement(
        View,
        { style: styles.metricRow },
        React.createElement(
          View,
          { style: styles.metric },
          React.createElement(Text, { style: styles.metricValue }, "$12B"),
          React.createElement(Text, { style: styles.metricLabel }, "TAM: Data Integration Software")
        ),
        React.createElement(
          View,
          { style: styles.metric },
          React.createElement(Text, { style: styles.metricValue }, "$3.2B"),
          React.createElement(Text, { style: styles.metricLabel }, "SAM: Mid-Market Segment")
        ),
        React.createElement(
          View,
          { style: styles.metric },
          React.createElement(Text, { style: styles.metricValue }, "87K"),
          React.createElement(Text, { style: styles.metricLabel }, "Target companies in North America")
        )
      ),
      React.createElement(View, { style: styles.divider }),
      React.createElement(Text, { style: styles.label }, "Why now?"),
      React.createElement(Text, { style: styles.bullet }, "• The average mid-market company added 6 new SaaS tools in 2024 (source: Okta Business at Work Report)"),
      React.createElement(Text, { style: styles.bullet }, "• AI-native data tools have reduced implementation cost by 10x vs. 2020"),
      React.createElement(Text, { style: styles.bullet }, "• CFOs are mandating data infrastructure consolidation after over-investment in SaaS"),
      React.createElement(Text, { style: styles.bullet }, "• First-mover advantage in no-code ETL for mid-market: no well-funded competitor in this exact segment")
    ),
    // Slide 5: Traction
    React.createElement(
      Slide,
      { pageNumber: 5 },
      React.createElement(Text, { style: styles.h2 }, "Traction"),
      React.createElement(
        View,
        { style: styles.metricRow },
        React.createElement(
          View,
          { style: styles.metric },
          React.createElement(Text, { style: styles.metricValue }, "$180K"),
          React.createElement(Text, { style: styles.metricLabel }, "ARR (as of March 2026)")
        ),
        React.createElement(
          View,
          { style: styles.metric },
          React.createElement(Text, { style: styles.metricValue }, "12"),
          React.createElement(Text, { style: styles.metricLabel }, "Paying customers")
        ),
        React.createElement(
          View,
          { style: styles.metric },
          React.createElement(Text, { style: styles.metricValue }, "127%"),
          React.createElement(Text, { style: styles.metricLabel }, "Net Revenue Retention")
        )
      ),
      React.createElement(View, { style: styles.divider }),
      React.createElement(Text, { style: styles.label }, "Key milestones"),
      React.createElement(Text, { style: styles.bullet }, "• Jan 2024: Product launch, first paying customer (Meridian Manufacturing, $18K ARR)"),
      React.createElement(Text, { style: styles.bullet }, "• Jun 2024: $60K ARR, 5 customers, 3x revenue growth in H1"),
      React.createElement(Text, { style: styles.bullet }, "• Sep 2024: Launched Salesforce native integration, 4 enterprise inbounds"),
      React.createElement(Text, { style: styles.bullet }, "• Jan 2025: $120K ARR, hired first sales hire (previously 100% founder-led)"),
      React.createElement(Text, { style: styles.bullet }, "• Mar 2026: $180K ARR, 12 customers, average ACV $15K"),
      React.createElement(View, { style: styles.divider }),
      React.createElement(
        Text,
        { style: { fontSize: 10, color: "#1d4ed8", fontFamily: "Helvetica-Bold" } },
        "Customer logos: Meridian Manufacturing · Apex Logistics · BlueSky Retail · TechForge Inc · 8 others"
      )
    ),
    // Slide 6: Team
    React.createElement(
      Slide,
      { pageNumber: 6 },
      React.createElement(Text, { style: styles.h2 }, "Team"),
      React.createElement(
        View,
        { style: styles.founderRow },
        React.createElement(
          View,
          { style: styles.founderCard },
          React.createElement(Text, { style: styles.founderName }, "Alex Chen"),
          React.createElement(Text, { style: styles.founderRole }, "CEO & Co-founder"),
          React.createElement(
            Text,
            { style: styles.founderBio },
            "Former Principal Engineer at Stripe (data infrastructure team, 6 years). Led the team that built Stripe's internal ETL system handling $1T+ in payment data annually. BS Computer Science, MIT. Angel investor in 3 YC companies."
          )
        ),
        React.createElement(
          View,
          { style: styles.founderCard },
          React.createElement(Text, { style: styles.founderName }, "Priya Patel"),
          React.createElement(Text, { style: styles.founderRole }, "CTO & Co-founder"),
          React.createElement(
            Text,
            { style: styles.founderBio },
            "Former Staff Engineer at Snowflake (connector ecosystem). Led development of 40+ data connectors used by 8,000+ enterprise customers. Previously at Google (BigQuery team). MS Computer Science, Stanford."
          )
        )
      ),
      React.createElement(View, { style: { marginTop: 8 } }),
      React.createElement(
        View,
        { style: styles.card },
        React.createElement(Text, { style: styles.cardTitle }, "Advisors"),
        React.createElement(
          Text,
          { style: styles.cardBody },
          "• Sarah Kim — former VP Engineering, Fivetran (IPO 2021)\n• James Torres — Partner, Bessemer Venture Partners (data infrastructure focus)\n• Neha Singh — COO, Brex"
        )
      ),
      React.createElement(
        View,
        { style: styles.chipRow },
        React.createElement(Text, { style: styles.chip }, "8 employees"),
        React.createElement(Text, { style: styles.chip }, "4 engineers"),
        React.createElement(Text, { style: styles.chip }, "2 sales"),
        React.createElement(Text, { style: styles.chip }, "Hiring: 3 roles open")
      )
    ),
    // Slide 7: Ask
    React.createElement(
      Slide,
      { pageNumber: 7 },
      React.createElement(Text, { style: styles.h2 }, "The Ask"),
      React.createElement(
        View,
        { style: { ...styles.card, backgroundColor: "#eff6ff", borderColor: "#bfdbfe" } },
        React.createElement(
          Text,
          { style: { fontSize: 28, fontFamily: "Helvetica-Bold", color: "#1d4ed8", marginBottom: 4 } },
          "Raising $1.5M Seed"
        ),
        React.createElement(
          Text,
          { style: { fontSize: 11, color: "#1e40af" } },
          "Pre-money valuation: $7M  ·  Target close: May 2026"
        )
      ),
      React.createElement(Text, { style: styles.label }, "Use of funds"),
      React.createElement(Text, { style: styles.bullet }, "• 50% Engineering (3 senior hires: backend, ML, integrations)"),
      React.createElement(Text, { style: styles.bullet }, "• 25% Sales & Marketing (SDR team, content, demand gen)"),
      React.createElement(Text, { style: styles.bullet }, "• 15% Infrastructure & cloud costs (supporting growth to $1M ARR)"),
      React.createElement(Text, { style: styles.bullet }, "• 10% Operations & G&A"),
      React.createElement(View, { style: styles.divider }),
      React.createElement(Text, { style: styles.label }, "18-month targets"),
      React.createElement(Text, { style: styles.bullet }, "• $1M ARR (5x from current $180K)"),
      React.createElement(Text, { style: styles.bullet }, "• 60+ paying customers"),
      React.createElement(Text, { style: styles.bullet }, "• Launch 3 new vertical-specific product packages"),
      React.createElement(Text, { style: styles.bullet }, "• Series A ready at $1M+ ARR with clear path to $4M ARR")
    ),
    // Slide 8: Contact
    React.createElement(
      Slide,
      { cover: true, pageNumber: 8 },
      React.createElement(
        Text,
        { style: { ...styles.h1Cover, fontSize: 28 } },
        "Let's build the data infrastructure layer for mid-market."
      ),
      React.createElement(View, { style: { ...styles.divider, borderBottomColor: "#334155", marginVertical: 32 } }),
      React.createElement(
        Text,
        { style: { fontSize: 13, color: "#cbd5e1", marginBottom: 8 } },
        "Alex Chen · CEO"
      ),
      React.createElement(
        Text,
        { style: { fontSize: 13, color: "#94a3b8", marginBottom: 4 } },
        "alex@datasyncai.io"
      ),
      React.createElement(
        Text,
        { style: { fontSize: 13, color: "#94a3b8", marginBottom: 24 } },
        "linkedin.com/in/alexchen-datasync"
      ),
      React.createElement(
        Text,
        { style: { fontSize: 11, color: "#64748b" } },
        "datasyncai.io"
      )
    )
  );
}

async function main() {
  const fixturesDir = path.join(process.cwd(), "fixtures");
  if (!fs.existsSync(fixturesDir)) fs.mkdirSync(fixturesDir, { recursive: true });

  const outputPath = path.join(fixturesDir, "dummy-pitch-deck.pdf");

  console.log("Generating dummy pitch deck PDF…");
  const buffer = await renderToBuffer(React.createElement(Doc));
  fs.writeFileSync(outputPath, buffer);
  console.log(`✓ Written to ${outputPath}`);
  console.log("\nTest fixtures ready:");
  console.log("  fixtures/dummy-firm-context.txt  — upload to Settings → Internal Documents");
  console.log("  fixtures/dummy-pitch-deck.pdf    — submit as a deal via 'Pitch Deck PDF' tab");
}

main().catch(console.error);
