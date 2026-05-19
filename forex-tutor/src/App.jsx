import React from 'react';

const data = {
  balance: '$10 000',
  lessonsCompleted: 0,
  totalLessons: 5,
  progress: '0%',
  averageScore: '0%',
  liveMarket: [
    { label: 'EUR/USD', value: '1.0836', trend: 'down' },
    { label: 'GBP/USD', value: '1.2659', trend: 'down' },
    { label: 'USD/JPY', value: '149.3207', trend: 'down' },
    { label: 'AUD/USD', value: '0.6518', trend: 'up' },
    { label: 'USD/CHF', value: '0.8943', trend: 'down' },
  ],
  lessons: [
    { title: 'Forex bozori nima?', category: 'Asoslar', duration: '8 daq' },
    { title: 'Pip va Lot tushunchalari', category: 'Asoslar', duration: '10 daq' },
    { title: 'Support va Resistance', category: 'Texnik Tahlil', duration: '12 daq' },
  ],
};

const App = () => {
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <p style={styles.tagline}>Forex Academy</p>
          <p style={styles.subtitle}>AI-powered • O'zbek tilida</p>
        </div>
        <div style={styles.balanceBadge}>💰 {data.balance}</div>
      </header>

      <section style={styles.cardSection}>
        <div style={styles.summaryCard}>
          <p style={styles.cardTitle}>Dashboard</p>
          <p style={styles.cardValue}>{data.lessonsCompleted}/{data.totalLessons} dars</p>
        </div>
        <div style={styles.summaryCard}>
          <p style={styles.cardTitle}>AI Ustoz</p>
          <p style={styles.cardValue}>Xush kelibsiz! 🎓</p>
        </div>
      </section>

      <section style={styles.overviewSection}>
        <div style={styles.overviewCard}>
          <p style={styles.overviewTitle}>Umumiy progress</p>
          <p style={styles.overviewValue}>{data.progress}</p>
        </div>
        <div style={styles.overviewCard}>
          <p style={styles.overviewTitle}>Tugatilgan</p>
          <p style={styles.overviewValue}>✅ 0</p>
        </div>
        <div style={styles.overviewCard}>
          <p style={styles.overviewTitle}>O'rt. ball</p>
          <p style={styles.overviewValue}>{data.averageScore}</p>
        </div>
        <div style={styles.overviewCard}>
          <p style={styles.overviewTitle}>Balans</p>
          <p style={styles.overviewValue}>{data.balance}</p>
        </div>
      </section>

      <section style={styles.marketSection}>
        <h2 style={styles.sectionTitle}>Jonli bozor</h2>
        <div style={styles.marketList}>
          {data.liveMarket.map((item) => (
            <div key={item.label} style={styles.marketItem}>
              <span>{item.label}</span>
              <span>
                {item.value} {item.trend === 'up' ? '▲' : '▼'}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.coursesSection}>
        <div style={styles.coursesHeader}>
          <h2 style={styles.sectionTitle}>⚡ Tez boshlash</h2>
        </div>
        {data.lessons.map((lesson) => (
          <div key={lesson.title} style={styles.lessonCard}>
            <div>
              <p style={styles.lessonTitle}>{lesson.title}</p>
              <p style={styles.lessonMeta}>{lesson.category} • {lesson.duration}</p>
            </div>
            <span style={styles.arrow}>→</span>
          </div>
        ))}
      </section>
    </div>
  );
};

const styles = {
  page: {
    fontFamily: 'Inter, system-ui, sans-serif',
    padding: '24px',
    maxWidth: '900px',
    margin: '0 auto',
    color: '#111827',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  tagline: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 700,
  },
  subtitle: {
    margin: '4px 0 0',
    color: '#6b7280',
  },
  balanceBadge: {
    backgroundColor: '#111827',
    color: '#fff',
    padding: '12px 16px',
    borderRadius: '16px',
    fontWeight: 600,
  },
  cardSection: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '24px',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '20px',
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.08)',
  },
  cardTitle: {
    margin: 0,
    color: '#6b7280',
    fontSize: '14px',
  },
  cardValue: {
    margin: '12px 0 0',
    fontSize: '20px',
    fontWeight: 700,
  },
  overviewSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  overviewCard: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '18px',
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.08)',
  },
  overviewTitle: {
    margin: 0,
    color: '#6b7280',
    fontSize: '13px',
  },
  overviewValue: {
    margin: '10px 0 0',
    fontSize: '18px',
    fontWeight: 700,
  },
  marketSection: {
    marginBottom: '24px',
  },
  sectionTitle: {
    margin: '0 0 14px',
    fontSize: '18px',
    fontWeight: 700,
  },
  marketList: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '18px',
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.08)',
  },
  marketItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '16px',
  },
  coursesSection: {
    marginBottom: '24px',
  },
  coursesHeader: {
    marginBottom: '14px',
  },
  lessonCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '18px',
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.08)',
    marginBottom: '12px',
  },
  lessonTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 600,
  },
  lessonMeta: {
    margin: '6px 0 0',
    color: '#6b7280',
    fontSize: '14px',
  },
  arrow: {
    fontSize: '18px',
    color: '#6b7280',
  },
};

export default App;
