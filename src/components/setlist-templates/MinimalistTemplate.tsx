import { ProcessedSetlist } from '@/types/setlistfm';

interface MinimalistTemplateProps {
  setlist: ProcessedSetlist;
}

export default function MinimalistTemplate({ setlist }: MinimalistTemplateProps) {
  return (
    <div
      style={{
        width: '1000px',
        height: '1400px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#0a0a0a',
        padding: '80px',
        position: 'relative',
      }}
    >
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
            fontSize: '64px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '24px',
            fontFamily: 'system-ui',
            letterSpacing: '-1px',
          }}
        >
          {setlist.artist.name}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div
            style={{
              fontSize: '24px',
              color: '#a0a0a0',
              fontFamily: 'system-ui',
              fontWeight: '400',
            }}
          >
            {setlist.venue.name}
          </div>
          <div
            style={{
              fontSize: '22px',
              color: '#808080',
              fontFamily: 'system-ui',
              fontWeight: '300',
            }}
          >
            {setlist.venue.location}
          </div>
          <div
            style={{
              fontSize: '22px',
              color: '#808080',
              fontFamily: 'system-ui',
              fontWeight: '300',
            }}
          >
            {setlist.displayDate}
          </div>
          {setlist.tour && (
            <div
              style={{
                fontSize: '20px',
                color: '#606060',
                marginTop: '8px',
                fontFamily: 'system-ui',
                fontWeight: '300',
                fontStyle: 'italic',
              }}
            >
              {setlist.tour}
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
              marginBottom: '40px',
            }}
          >
            {/* Set name */}
            {set.name && (
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: '600',
                  color: '#ffffff',
                  marginBottom: '20px',
                  fontFamily: 'system-ui',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
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
                  marginBottom: '14px',
                  fontSize: '22px',
                  color: '#e0e0e0',
                  fontFamily: 'system-ui',
                  fontWeight: '300',
                }}
              >
                <div
                  style={{
                    marginRight: '20px',
                    color: '#606060',
                    minWidth: '50px',
                    fontWeight: '400',
                  }}
                >
                  {String(songIndex + 1).padStart(2, '0')}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div>{song.name}</div>
                    {song.isTape && (
                      <div
                        style={{
                          marginLeft: '12px',
                          fontSize: '16px',
                          color: '#808080',
                          fontWeight: '400',
                        }}
                      >
                        · tape
                      </div>
                    )}
                  </div>
                  {song.isCover && song.coverArtist && (
                    <div
                      style={{
                        fontSize: '18px',
                        color: '#808080',
                        marginTop: '6px',
                        fontWeight: '300',
                      }}
                    >
                      {song.coverArtist} cover
                    </div>
                  )}
                  {song.info && (
                    <div
                      style={{
                        fontSize: '18px',
                        color: '#808080',
                        marginTop: '6px',
                        fontWeight: '300',
                      }}
                    >
                      {song.info}
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
          justifyContent: 'center',
          paddingTop: '30px',
          marginTop: '30px',
          borderTop: '1px solid #303030',
        }}
      >
        <div
          style={{
            fontSize: '16px',
            color: '#606060',
            fontFamily: 'system-ui',
            fontWeight: '300',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}
        >
          Concert History · setlist.fm
        </div>
      </div>
    </div>
  );
}
