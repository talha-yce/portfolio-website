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
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
} 