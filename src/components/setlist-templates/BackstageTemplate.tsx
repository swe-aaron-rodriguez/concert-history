import { ProcessedSetlist } from '@/types/setlistfm';

interface BackstageTemplateProps {
  setlist: ProcessedSetlist;
  width: number;
  height: number;
}

const BACKSTAGE_HEADER_FONT = '"Bebas Neue", sans-serif';
const BACKSTAGE_MONO_FONT = '"Roboto Mono", monospace';

export default function BackstageTemplate({ setlist, width, height }: BackstageTemplateProps) {
  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#1a1a1a',
        padding: '0',
        position: 'relative',
      }}
    >
      {/* Main white card */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff',
          margin: '50px',
          padding: '50px',
          flex: 1,
          border: '3px solid #000000',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '40px',
            paddingBottom: '30px',
            borderBottom: '4px solid #000000',
          }}
        >
          <div
            style={{
              fontSize: '60px',
              color: '#000000',
              marginBottom: '16px',
              fontFamily: BACKSTAGE_HEADER_FONT,
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}
          >
            {setlist.artist.name}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: '24px',
                color: '#333333',
                fontFamily: BACKSTAGE_MONO_FONT,
              }}
            >
              VENUE: {setlist.venue.name}
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '24px',
                color: '#333333',
                fontFamily: BACKSTAGE_MONO_FONT,
              }}
            >
              LOCATION: {setlist.venue.location}
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '24px',
                color: '#333333',
                fontFamily: BACKSTAGE_MONO_FONT,
              }}
            >
              DATE: {setlist.displayDate}
            </div>
            {setlist.tour && (
              <div
                style={{
                  display: 'flex',
                  fontSize: '24px',
                  color: '#333333',
                  fontFamily: BACKSTAGE_MONO_FONT,
                }}
              >
                TOUR: {setlist.tour}
              </div>
            )}
          </div>
        </div>

        {/* Setlist */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
          }}
        >
          {setlist.sets.map((set, setIndex) => (
            <div
              key={setIndex}
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginBottom: '30px',
              }}
            >
              {/* Set name */}
              {set.name && (
                <div
                  style={{
                    fontSize: '34px',
                    color: '#000000',
                    marginBottom: '16px',
                    fontFamily: BACKSTAGE_HEADER_FONT,
                    textTransform: 'uppercase',
                    letterSpacing: '3px',
                    backgroundColor: '#ffff00',
                    padding: '8px 16px',
                    display: 'flex',
                    alignSelf: 'flex-start',
                  }}
                >
                  {set.name}
                </div>
              )}

              {/* Songs */}
              {set.songs.map((song, songIndex) => (
                <div
                  key={songIndex}
                  style={{
                    display: 'flex',
                    marginBottom: '12px',
                    fontSize: '22px',
                    color: '#000000',
                    fontFamily: BACKSTAGE_MONO_FONT,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      marginRight: '16px',
                      color: '#666666',
                      minWidth: '45px',
                      fontWeight: '700',
                    }}
                  >
                    {String(songIndex + 1).padStart(2, '0')}.
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ display: 'flex' }}>{song.name}</div>
                      {song.isTape && (
                        <div
                          style={{
                            display: 'flex',
                            marginLeft: '12px',
                            fontSize: '18px',
                            color: '#ff0000',
                            fontWeight: '700',
                          }}
                        >
                          [TAPE]
                        </div>
                      )}
                    </div>
                    {song.isCover && song.coverArtist && (
                      <div
                        style={{
                          display: 'flex',
                          fontSize: '18px',
                          color: '#666666',
                          marginTop: '4px',
                        }}
                      >
                        Cover: {song.coverArtist}
                      </div>
                    )}
                    {song.info && (
                      <div
                        style={{
                          display: 'flex',
                          fontSize: '18px',
                          color: '#666666',
                          marginTop: '4px',
                        }}
                      >
                        Note: {song.info}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '20px',
            borderTop: '3px solid #000000',
            marginTop: '50px',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: '18px',
              color: '#666666',
              fontFamily: BACKSTAGE_MONO_FONT,
            }}
          >
            Concert History · setlist.fm
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '36px',
              color: '#000000',
              fontFamily: BACKSTAGE_HEADER_FONT,
              backgroundColor: '#ffff00',
              padding: '4px 12px',
              letterSpacing: '2px',
            }}
          >
            ALL ACCESS
          </div>
        </div>
      </div>
    </div>
  );
}
