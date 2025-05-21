import { ImageResponse } from '@vercel/og';
import type { NextRequest } from 'next/server';
import { siteConfig } from '@/config/site';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #18181b 60%, #22223b 100%)',
          color: 'white',
          fontFamily: 'Inter, Arial, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Sol üst logo */}
        <img
          src={siteConfig.url + '/logo.png'}
          width={90}
          height={90}
          alt="Logo"
          style={{ position: 'absolute', top: 48, left: 60, borderRadius: 24, background: '#fff1', padding: 8, boxShadow: '0 4px 24px #0003' }}
        />
        {/* Arka plan noise efekti */}
        <img
          src={siteConfig.url + '/images/noise.svg'}
          width={1200}
          height={630}
          alt="Noise"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.18, zIndex: 0 }}
        />
        {/* Başlık */}
        <div style={{ fontSize: 64, fontWeight: 800, marginTop: 100, textAlign: 'center', letterSpacing: '-2px', lineHeight: 1.1, zIndex: 2, background: 'linear-gradient(90deg, #60a5fa 30%, #818cf8 100%)', WebkitBackgroundClip: 'text', color: 'transparent', backgroundClip: 'text' }}>
          {siteConfig.name}
        </div>
        {/* Açıklama */}
        <div style={{ fontSize: 32, fontWeight: 400, marginTop: 36, textAlign: 'center', maxWidth: 800, opacity: 0.92, lineHeight: 1.3, zIndex: 2 }}>
          {siteConfig.description}
        </div>
        {/* Kod snippet */}
        <div style={{
          position: 'absolute',
          left: 60,
          bottom: 120,
          fontSize: 22,
          fontFamily: 'Fira Mono, monospace',
          color: '#60a5fa',
          opacity: 0.18,
          zIndex: 1,
          maxWidth: 600,
          whiteSpace: 'pre-line',
        }}>
{`// Portfolio
function TalhaYuce() {
  return "Web, Oyun, AI Developer";
}`}
        </div>
        {/* Alt marka */}
        <div style={{
          position: 'absolute',
          bottom: 48,
          right: 60,
          fontSize: 28,
          opacity: 0.7,
          fontWeight: 600,
          letterSpacing: 1,
          zIndex: 2,
        }}>
          talha-yuce.site
        </div>
        {/* Sosyal medya ikonları */}
        <div style={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 32,
          zIndex: 3,
        }}>
          {/* X (Twitter) */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="#18181b"/>
            <path d="M10 10L22 22M22 10L10 22" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          {/* Slack */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="#18181b"/>
            <circle cx="16" cy="16" r="6" fill="#fff"/>
            <rect x="14" y="7" width="4" height="18" rx="2" fill="#611f69"/>
            <rect x="7" y="14" width="18" height="4" rx="2" fill="#36c5f0"/>
          </svg>
          {/* Facebook */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="#18181b"/>
            <path d="M18 10h2V7h-2a5 5 0 0 0-5 5v2h-2v3h2v7h3v-7h2.1l.4-3H16v-2a1 1 0 0 1 1-1z" fill="#1877f3"/>
          </svg>
          {/* LinkedIn */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="#18181b"/>
            <rect x="8" y="13" width="3" height="11" fill="#0a66c2"/>
            <rect x="14" y="13" width="3" height="11" fill="#0a66c2"/>
            <circle cx="9.5" cy="10" r="1.5" fill="#0a66c2"/>
            <rect x="20" y="17" width="3" height="7" fill="#0a66c2"/>
          </svg>
          {/* Discord */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="#18181b"/>
            <ellipse cx="16" cy="16" rx="8" ry="8" fill="#5865f2"/>
            <circle cx="13" cy="16" r="1.5" fill="#fff"/>
            <circle cx="19" cy="16" r="1.5" fill="#fff"/>
          </svg>
          {/* WhatsApp */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="#18181b"/>
            <circle cx="16" cy="16" r="8" fill="#25d366"/>
            <path d="M12 16c1.5 2.5 4.5 2.5 6 0" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
} 