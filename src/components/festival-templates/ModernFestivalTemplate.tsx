import { FestivalLineup } from '@/lib/wrapped-stats';

interface ModernFestivalTemplateProps {
  lineup: FestivalLineup;
  width: number;
  height: number;
}

export default function ModernFestivalTemplate({
  lineup,
  width,
  height,
}: ModernFestivalTemplateProps) {
  // Hide artist names in preview/thumbnail sizes (only show in full size)
  const isFullSize = width >= 1200;

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        padding: '60px 40px',
        position: 'relative',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '50px',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: '48px',
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            fontWeight: '700',
            letterSpacing: '4px',
            marginBottom: '10px',
          }}
        >
          {lineup.festivalName.split("'S")[0]}&apos;S
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: '90px',
            color: 'white',
            textAlign: 'center',
            fontWeight: '900',
            letterSpacing: '8px',
            textTransform: 'uppercase',
          }}
        >
          2025
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: '54px',
            color: 'white',
            textAlign: 'center',
            fontWeight: '900',
            letterSpacing: '6px',
            marginTop: '10px',
          }}
        >
          FESTIVAL
        </div>
      </div>

      {/* Headliners - only show in full size */}
      {isFullSize && lineup.headliners.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          {lineup.headliners.map((artist) => (
            <div
              key={artist.id}
              style={{
                display: 'flex',
                fontSize: '62px',
                color: 'white',
                textAlign: 'center',
                fontWeight: '900',
                letterSpacing: '4px',
                textTransform: 'uppercase',
                marginBottom: '20px',
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              }}
            >
              {artist.name}
            </div>
          ))}
        </div>
      )}

      {/* Sub-headliners - only show in full size */}
      {isFullSize && lineup.subHeadliners.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '14px 40px',
            marginBottom: '35px',
          }}
        >
          {lineup.subHeadliners.map((artist) => (
            <div
              key={artist.id}
              style={{
                display: 'flex',
                fontSize: '38px',
                color: 'white',
                textAlign: 'center',
                fontWeight: '700',
                letterSpacing: '2px',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                flexBasis: '48%',
                minWidth: '0',
              }}
            >
              {artist.name}
            </div>
          ))}
        </div>
      )}

      {/* Supporting lineup - only show in full size */}
      {isFullSize && lineup.lineup.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px 30px',
            marginBottom: '30px',
          }}
        >
          {lineup.lineup.map((artist) => (
            <div
              key={artist.id}
              style={{
                display: 'flex',
                fontSize: '26px',
                color: 'rgba(255, 255, 255, 0.95)',
                textAlign: 'center',
                fontWeight: '600',
                letterSpacing: '1px',
                flexBasis: '48%',
                minWidth: '0',
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
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: '22px',
            color: 'rgba(255, 255, 255, 0.8)',
            textAlign: 'center',
            fontWeight: '600',
            letterSpacing: '3px',
          }}
        >
          {lineup.totalArtists} ARTISTS • 2025
        </div>
      </div>
    </div>
  );
}
