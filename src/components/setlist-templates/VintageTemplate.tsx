import { ProcessedSetlist } from '@/types/setlistfm';

interface VintageTemplateProps {
  setlist: ProcessedSetlist;
}

const VINTAGE_FONT_FAMILY = '"Special Elite", "Courier New", monospace';

export default function VintageTemplate({ setlist }: VintageTemplateProps) {
  // Split songs into two columns if there are many
  const allSongs = setlist.sets.flatMap((set, setIndex) =>
    set.songs.map((song, songIndex) => ({
      ...song,
      setName: set.name,
      setIndex,
      globalIndex: setlist.sets.slice(0, setIndex).reduce((acc, s) => acc + s.songs.length, 0) + songIndex,
    }))
  );

  const useColumns = allSongs.length > 15;
  const midpoint = Math.ceil(allSongs.length / 2);
  const column1 = useColumns ? allSongs.slice(0, midpoint) : allSongs;
  const column2 = useColumns ? allSongs.slice(midpoint) : [];

  return (
    <div
      style={{
        width: '1000px',
        height: '1400px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f5e6d3',
        padding: '50px',
        position: 'relative',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '40px',
          borderBottom: '4px solid #8b4513',
          paddingBottom: '30px',
        }}
      >
        <div
          style={{
            fontSize: '64px',
            fontWeight: '900',
            color: '#8b4513',
            textAlign: 'center',
            marginBottom: '20px',
            fontFamily: VINTAGE_FONT_FAMILY,
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}
        >
          {setlist.artist.name}
        </div>

        <div
          style={{
            fontSize: '24px',
            color: '#654321',
            textAlign: 'center',
            marginBottom: '12px',
            fontFamily: VINTAGE_FONT_FAMILY,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          • • •
        </div>

        <div
          style={{
            fontSize: '28px',
            color: '#654321',
            textAlign: 'center',
            marginBottom: '8px',
            fontFamily: VINTAGE_FONT_FAMILY,
          }}
        >
          {setlist.venue.name}
        </div>

        <div
          style={{
            fontSize: '24px',
            color: '#8b7355',
            textAlign: 'center',
            fontFamily: VINTAGE_FONT_FAMILY,
          }}
        >
          {setlist.venue.location}
        </div>

        <div
          style={{
            fontSize: '26px',
            color: '#654321',
            marginTop: '12px',
            fontWeight: '700',
            textAlign: 'center',
            fontFamily: VINTAGE_FONT_FAMILY,
          }}
        >
          {setlist.displayDate}
        </div>

        {setlist.tour && (
          <div
            style={{
              fontSize: '22px',
              color: '#8b7355',
              marginTop: '16px',
              textAlign: 'center',
              fontStyle: 'italic',
              fontFamily: VINTAGE_FONT_FAMILY,
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
          flex: 1,
          gap: useColumns ? '40px' : '0',
        }}
      >
        {/* Column 1 (or single column) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
          }}
        >
          {column1.map((song, index) => {
            const showSetName = index === 0 || column1[index - 1]?.setName !== song.setName;
            return (
              <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
                {showSetName && song.setName && (
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#8b4513',
                      marginTop: index === 0 ? '0' : '20px',
                      marginBottom: '12px',
                      textTransform: 'uppercase',
                      fontFamily: VINTAGE_FONT_FAMILY,
                    }}
                  >
                    {song.setName}
                  </div>
                )}
                <div
                  style={{
                    display: 'flex',
                    marginBottom: '8px',
                    fontSize: '20px',
                    color: '#2c1810',
                    fontFamily: VINTAGE_FONT_FAMILY,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      marginRight: '10px',
                      color: '#8b7355',
                      minWidth: '35px',
                    }}
                  >
                    {song.globalIndex + 1}.
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ display: 'flex' }}>{song.name}</div>
                      {song.isTape && (
                        <div
                          style={{
                            display: 'flex',
                            marginLeft: '8px',
                            fontSize: '16px',
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
                          fontSize: '16px',
                          color: '#8b7355',
                          marginTop: '2px',
                          fontStyle: 'italic',
                        }}
                      >
                        ({song.coverArtist})
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Column 2 */}
        {useColumns && column2.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
            }}
          >
            {column2.map((song, index) => {
              const showSetName = index === 0 || column2[index - 1]?.setName !== song.setName;
              return (
                <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
                  {showSetName && song.setName && (
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#8b4513',
                        marginTop: index === 0 ? '0' : '20px',
                        marginBottom: '12px',
                        textTransform: 'uppercase',
                        fontFamily: VINTAGE_FONT_FAMILY,
                      }}
                    >
                      {song.setName}
                    </div>
                  )}
                  <div
                    style={{
                      display: 'flex',
                      marginBottom: '8px',
                      fontSize: '20px',
                      color: '#2c1810',
                      fontFamily: VINTAGE_FONT_FAMILY,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        marginRight: '10px',
                        color: '#8b7355',
                        minWidth: '35px',
                      }}
                    >
                      {song.globalIndex + 1}.
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ display: 'flex' }}>{song.name}</div>
                        {song.isTape && (
                          <div
                            style={{
                              display: 'flex',
                              marginLeft: '8px',
                              fontSize: '16px',
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
                            fontSize: '16px',
                            color: '#8b7355',
                            marginTop: '2px',
                            fontStyle: 'italic',
                          }}
                        >
                          ({song.coverArtist})
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '20px',
          borderTop: '3px solid #8b4513',
          fontSize: '18px',
          color: '#8b7355',
          marginTop: '30px',
          fontFamily: VINTAGE_FONT_FAMILY,
        }}
      >
        Concert History · setlist.fm
      </div>
    </div>
  );
}
