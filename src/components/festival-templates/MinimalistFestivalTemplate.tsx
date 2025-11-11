import { FestivalLineup } from '@/lib/wrapped-stats';

interface MinimalistFestivalTemplateProps {
  lineup: FestivalLineup;
  width: number;
  height: number;
}

export default function MinimalistFestivalTemplate({
  lineup,
  width,
  height,
}: MinimalistFestivalTemplateProps) {
  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#0a0a0a',
        padding: '70px 50px',
        position: 'relative',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Minimal accent line at top */}
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          height: '4px',
          background: 'linear-gradient(90deg, #ffffff 0%, #666666 100%)',
        }}
      />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginBottom: '60px',
        }}
      >
        <div
          style={{
            fontSize: '36px',
            color: '#888888',
            fontWeight: '400',
            letterSpacing: '12px',
            textTransform: 'uppercase',
            marginBottom: '10px',
          }}
        >
          {lineup.festivalName.split("'S")[0]}&apos;S
        </div>
        <div
          style={{
            fontSize: '120px',
            color: '#ffffff',
            fontWeight: '200',
            letterSpacing: '20px',
            lineHeight: '1',
            marginBottom: '5px',
          }}
        >
          2025
        </div>
        <div
          style={{
            fontSize: '28px',
            color: '#666666',
            fontWeight: '300',
            letterSpacing: '8px',
            textTransform: 'uppercase',
          }}
        >
          Festival
        </div>
      </div>

      {/* Minimal divider */}
      <div
        style={{
          width: '100px',
          height: '1px',
          backgroundColor: '#333333',
          marginBottom: '50px',
        }}
      />

      {/* Headliners */}
      {lineup.headliners.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '45px',
          }}
        >
          {lineup.headliners.map((artist, index) => (
            <div
              key={artist.id}
              style={{
                fontSize: '64px',
                color: '#ffffff',
                fontWeight: '300',
                letterSpacing: '4px',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'baseline',
                gap: '20px',
              }}
            >
              <span
                style={{
                  fontSize: '32px',
                  color: '#444444',
                  fontWeight: '200',
                  minWidth: '50px',
                }}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>{artist.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Sub-headliners */}
      {lineup.subHeadliners.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '40px',
          }}
        >
          {lineup.subHeadliners.map((artist, index) => (
            <div
              key={artist.id}
              style={{
                fontSize: '40px',
                color: '#cccccc',
                fontWeight: '300',
                letterSpacing: '2px',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'baseline',
                gap: '20px',
              }}
            >
              <span
                style={{
                  fontSize: '24px',
                  color: '#444444',
                  fontWeight: '200',
                  minWidth: '50px',
                }}
              >
                {String(lineup.headliners.length + index + 1).padStart(2, '0')}
              </span>
              <span>{artist.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Supporting lineup */}
      {lineup.lineup.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '30px',
          }}
        >
          {lineup.lineup.map((artist, index) => (
            <div
              key={artist.id}
              style={{
                fontSize: '28px',
                color: '#888888',
                fontWeight: '300',
                letterSpacing: '1px',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'baseline',
                gap: '20px',
              }}
            >
              <span
                style={{
                  fontSize: '18px',
                  color: '#333333',
                  fontWeight: '200',
                  minWidth: '50px',
                }}
              >
                {String(
                  lineup.headliners.length + lineup.subHeadliners.length + index + 1
                ).padStart(2, '0')}
              </span>
              <span>{artist.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          marginTop: 'auto',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <div
          style={{
            fontSize: '18px',
            color: '#444444',
            fontWeight: '300',
            letterSpacing: '4px',
          }}
        >
          {lineup.totalArtists} ARTISTS
        </div>
        <div
          style={{
            fontSize: '18px',
            color: '#444444',
            fontWeight: '300',
            letterSpacing: '4px',
          }}
        >
          2025
        </div>
      </div>

      {/* Minimal accent line at bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          height: '4px',
          background: 'linear-gradient(90deg, #666666 0%, #ffffff 100%)',
        }}
      />
    </div>
  );
}
