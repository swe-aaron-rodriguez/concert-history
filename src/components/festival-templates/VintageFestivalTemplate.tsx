import { FestivalLineup } from '@/lib/wrapped-stats';

interface VintageFestivalTemplateProps {
  lineup: FestivalLineup;
  width: number;
  height: number;
}

const VINTAGE_FONT = '"Courier New", Courier, monospace';

export default function VintageFestivalTemplate({
  lineup,
  width,
  height,
}: VintageFestivalTemplateProps) {
  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #f4e4c1 0%, #e8d4a8 100%)',
        padding: '50px 40px',
        position: 'relative',
        fontFamily: VINTAGE_FONT,
        border: '12px solid #8b4513',
      }}
    >
      {/* Decorative corner elements */}
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          top: '30px',
          left: '30px',
          width: '80px',
          height: '80px',
          border: '4px solid #8b4513',
          borderRight: 'none',
          borderBottom: 'none',
        }}
      />
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          top: '30px',
          right: '30px',
          width: '80px',
          height: '80px',
          border: '4px solid #8b4513',
          borderLeft: 'none',
          borderBottom: 'none',
        }}
      />
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          bottom: '30px',
          left: '30px',
          width: '80px',
          height: '80px',
          border: '4px solid #8b4513',
          borderRight: 'none',
          borderTop: 'none',
        }}
      />
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          bottom: '30px',
          right: '30px',
          width: '80px',
          height: '80px',
          border: '4px solid #8b4513',
          borderLeft: 'none',
          borderTop: 'none',
        }}
      />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '45px',
          paddingBottom: '25px',
          borderBottom: '3px solid #8b4513',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: '42px',
            color: '#654321',
            textAlign: 'center',
            fontWeight: '700',
            letterSpacing: '6px',
            marginBottom: '15px',
          }}
        >
          ★ ★ ★
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: '80px',
            color: '#8b4513',
            textAlign: 'center',
            fontWeight: '900',
            letterSpacing: '6px',
            textTransform: 'uppercase',
            lineHeight: '1',
          }}
        >
          FESTIVAL
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: '48px',
            color: '#654321',
            textAlign: 'center',
            fontWeight: '700',
            letterSpacing: '4px',
            marginTop: '15px',
          }}
        >
          2025
        </div>
      </div>

      {/* Headliners */}
      {lineup.headliners.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '35px',
          }}
        >
          {lineup.headliners.map((artist) => (
            <div
              key={artist.id}
              style={{
                display: 'flex',
                fontSize: '58px',
                color: '#8b4513',
                textAlign: 'center',
                fontWeight: '900',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                marginBottom: '18px',
              }}
            >
              {artist.name}
            </div>
          ))}
        </div>
      )}

      {/* Decorative divider */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '30px',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: '32px',
            color: '#654321',
            letterSpacing: '8px',
          }}
        >
          • • •
        </div>
      </div>

      {/* Sub-headliners */}
      {lineup.subHeadliners.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '12px 35px',
            marginBottom: '30px',
          }}
        >
          {lineup.subHeadliners.map((artist) => (
            <div
              key={artist.id}
              style={{
                display: 'flex',
                fontSize: '36px',
                color: '#654321',
                textAlign: 'center',
                fontWeight: '700',
                letterSpacing: '2px',
                width: '48%',
              }}
            >
              {artist.name}
            </div>
          ))}
        </div>
      )}

      {/* Supporting lineup */}
      {lineup.lineup.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '8px 30px',
            marginBottom: '25px',
          }}
        >
          {lineup.lineup.map((artist) => (
            <div
              key={artist.id}
              style={{
                display: 'flex',
                fontSize: '24px',
                color: '#654321',
                textAlign: 'center',
                fontWeight: '600',
                letterSpacing: '1px',
                width: '48%',
              }}
            >
              {artist.name}
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          marginTop: 'auto',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '20px',
          borderTop: '3px solid #8b4513',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: '20px',
            color: '#654321',
            textAlign: 'center',
            fontWeight: '600',
            letterSpacing: '4px',
          }}
        >
          {lineup.totalArtists} ARTISTS
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: '28px',
            color: '#8b4513',
            textAlign: 'center',
            fontWeight: '700',
            letterSpacing: '2px',
            marginTop: '8px',
          }}
        >
          ★ ★ ★
        </div>
      </div>
    </div>
  );
}
