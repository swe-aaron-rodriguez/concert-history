import { ProcessedSetlist } from '@/types/setlistfm';

interface ScrapbookTemplateProps {
  setlist: ProcessedSetlist;
}

export default function ScrapbookTemplate({ setlist }: ScrapbookTemplateProps) {
  return (
    <div
      style={{
        width: '1000px',
        height: '1400px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f9f6e8',
        padding: '60px',
        position: 'relative',
        backgroundImage: 'linear-gradient(45deg, #f9f6e8 25%, #f5f0d8 25%, #f5f0d8 50%, #f9f6e8 50%, #f9f6e8 75%, #f5f0d8 75%, #f5f0d8)',
        backgroundSize: '20px 20px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginBottom: '40px',
          borderBottom: '2px solid #8b7355',
          paddingBottom: '30px',
        }}
      >
        <div
          style={{
            fontSize: '52px',
            fontWeight: '700',
            color: '#2c1810',
            marginBottom: '12px',
            fontFamily: 'system-ui',
          }}
        >
          {setlist.artist.name}
        </div>
        <div
          style={{
            fontSize: '28px',
            color: '#5c4a3a',
            marginBottom: '8px',
            fontFamily: 'system-ui',
          }}
        >
          {setlist.venue.name}
        </div>
        <div
          style={{
            fontSize: '24px',
            color: '#6b5a4a',
            fontFamily: 'system-ui',
          }}
        >
          {setlist.venue.location}
        </div>
        <div
          style={{
            fontSize: '24px',
            color: '#6b5a4a',
            marginTop: '8px',
            fontFamily: 'system-ui',
          }}
        >
          {setlist.displayDate}
        </div>
        {setlist.tour && (
          <div
            style={{
              fontSize: '22px',
              color: '#8b7355',
              marginTop: '12px',
              fontStyle: 'italic',
              fontFamily: 'system-ui',
            }}
          >
            {setlist.tour}
          </div>
        )}
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
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#5c4a3a',
                  marginBottom: '16px',
                  textTransform: 'uppercase',
                  fontFamily: 'system-ui',
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
                  marginBottom: '10px',
                  fontSize: '22px',
                  color: '#2c1810',
                  fontFamily: 'system-ui',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    marginRight: '12px',
                    color: '#8b7355',
                    minWidth: '40px',
                  }}
                >
                  {songIndex + 1}.
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ display: 'flex' }}>{song.name}</div>
                    {song.isTape && (
                      <div
                        style={{
                          display: 'flex',
                          marginLeft: '8px',
                          fontSize: '18px',
                          color: '#8b7355',
                        }}
                      >
                        [tape]
                      </div>
                    )}
                  </div>
                  {song.isCover && song.coverArtist && (
                    <div
                      style={{
                        display: 'flex',
                        fontSize: '18px',
                        color: '#8b7355',
                        marginTop: '4px',
                        fontStyle: 'italic',
                      }}
                    >
                      ({song.coverArtist} cover)
                    </div>
                  )}
                  {song.info && (
                    <div
                      style={{
                        display: 'flex',
                        fontSize: '18px',
                        color: '#8b7355',
                        marginTop: '4px',
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
          paddingTop: '20px',
          borderTop: '2px solid #8b7355',
          fontSize: '18px',
          color: '#8b7355',
          fontFamily: 'system-ui',
        }}
      >
        Concert History · setlist.fm
      </div>
    </div>
  );
}
