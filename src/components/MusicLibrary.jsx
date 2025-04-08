import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../css/MusicLibrary.css';
import playButton from '../assets/play-buttton.png';
import pauseButton from '../assets/pause.png';

const BACKEND_URL = 'http://localhost:5001'; // Your backend server URL

function MusicLibrary() {
  const [recentTracks, setRecentTracks] = useState([]); // State for all recent tracks
  const [mostRecentTrack, setMostRecentTrack] = useState(null); // State for the most recent track
  const [albums, setAlbums] = useState([]);
  const [loadingRecentTracks, setLoadingRecentTracks] = useState(true);
  const [loadingAlbums, setLoadingAlbums] = useState(true);
  const [errorRecentTracks, setErrorRecentTracks] = useState(null);
  const [errorAlbums, setErrorAlbums] = useState(null);
  const [needsLogin, setNeedsLogin] = useState(false);
  // Audio player states
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [playerInstance, setPlayerInstance] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [playbackError, setPlaybackError] = useState(null);
  const audioRef = useRef(null);

  // State for the album wheel
  const [focusedIndex, setFocusedIndex] = useState(0);
  const wheelContainerRef = useRef(null);
  const albumItemsRef = useRef([]);
  const isWheeling = useRef(false);
  const wheelTimeout = useRef(null);

  const [albumColor, setAlbumColor] = useState(null);
  const canvasRef = useRef(null);

  // Fetch Spotify access token on component mount
  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/token`);
        if (response.ok) {
          const data = await response.json();
          setAccessToken(data.accessToken);
        } else {
          setNeedsLogin(true);
          console.warn('Failed to get access token. User may need to log in.');
        }
      } catch (error) {
        console.error('Error fetching access token:', error);
      }
    };

    getAccessToken();
  }, []);

  // Initialize Spotify Web Playback SDK when access token is available
  useEffect(() => {
    if (!accessToken) return;
    
    // Load Spotify Web Player script
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Portfolio Web Player',
        getOAuthToken: cb => { cb(accessToken); },
        volume: 0.5
      });

      // Error handling
      player.addListener('initialization_error', ({ message }) => {
        console.error('Initialization error:', message);
        setPlaybackError('Failed to initialize Spotify player');
      });

      player.addListener('authentication_error', ({ message }) => {
        console.error('Authentication error:', message);
        setPlaybackError('Authentication failed with Spotify');
        setNeedsLogin(true);
      });

      player.addListener('account_error', ({ message }) => {
        console.error('Account error:', message);
        setPlaybackError('Spotify Premium is required for playback');
      });

      player.addListener('playback_error', ({ message }) => {
        console.error('Playback error:', message);
        setPlaybackError('Error during playback');
      });

      // Playback status updates
      player.addListener('player_state_changed', state => {
        if (state) {
          setIsPlaying(!state.paused);
          // Update current track if it has changed
          if (state.track_window.current_track) {
            const currentTrack = state.track_window.current_track;
            setCurrentlyPlaying({
              id: currentTrack.id,
              name: currentTrack.name,
              artist: currentTrack.artists.map(artist => artist.name).join(', '),
              albumImageUrl: currentTrack.album.images[0]?.url || '',
              albumName: currentTrack.album.name
            });
          }
        }
      });

      // Ready
      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        setDeviceId(device_id);
        setPlayerReady(true);
        setPlayerInstance(player);
      });

      // Not Ready
      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
        setPlayerReady(false);
      });

      // Connect to the player
      player.connect();

      return () => {
        player.disconnect();
      };
    };

    return () => {
      // Cleanup script when component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [accessToken]);

  useEffect(() => {
    const fetchAlbums = async () => {
      setLoadingAlbums(true);
      setErrorAlbums(null);
      try {
        const response = await fetch(`${BACKEND_URL}/api/albums`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAlbums(data);
        if (data.length > 0) {
          setFocusedIndex(Math.floor(data.length / 2));
        }
      } catch (error) {
        console.error("Error fetching albums:", error);
        setErrorAlbums(`Failed to load albums: ${error.message}`);
      } finally {
        setLoadingAlbums(false);
      }
    };

    const fetchRecentTracks = async () => {
        setLoadingRecentTracks(true);
        setErrorRecentTracks(null);
        if (needsLogin) {
            setErrorRecentTracks('Spotify authentication required.');
            setLoadingRecentTracks(false);
            return;
        }
        try {
            // We'll fetch 5 tracks for both the Now Playing and Recently Played sections
            const response = await fetch(`${BACKEND_URL}/api/recent-tracks?limit=5`);
            if (!response.ok) {
                 if (response.status === 401) {
                    const errorData = await response.json();
                    if (errorData.needsLogin) {
                      setNeedsLogin(true);
                      setErrorRecentTracks('Spotify authentication required.');
                      setLoadingRecentTracks(false);
                      return;
                    }
                  }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // Make sure data is an array of tracks
            const trackArray = Array.isArray(data) ? data : [data].filter(Boolean);
            
            if (trackArray.length > 0) {
              // Set the first track as the most recent one for Now Playing
              setMostRecentTrack(trackArray[0]);
              // Keep all tracks for the list display
              setRecentTracks(trackArray);
            } else {
              setMostRecentTrack(null);
              setRecentTracks([]);
            }
        } catch (error) {
            console.error("Error fetching recent tracks:", error);
             if (!needsLogin) {
                 setErrorRecentTracks(`Failed to load recent tracks: ${error.message}`);
             }
        } finally {
             if (!needsLogin) {
                 setLoadingRecentTracks(false);
             }
        }
    };

    fetchAlbums();
    fetchRecentTracks();
  }, [needsLogin]);

  // Filter out the most recently played track from the recent tracks list for Recently Played section
  const filteredRecentTracks = recentTracks.length > 1 
    ? recentTracks.slice(1, 5) // Take tracks 2-5 (skip the most recent one)
    : [];

  // Function to extract dominant color from an image
  const extractDominantColor = useCallback((imageUrl) => {
    if (!imageUrl) return;
    
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Allows CORS for images from different domains
    
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0, img.width, img.height);
      
      try {
        // Get the image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Calculate average color (simple approach)
        let r = 0, g = 0, b = 0;
        let pixelCount = 0;
        
        // Skip pixels to improve performance
        const skipFactor = 4; // Only look at every 4th pixel
        
        for (let i = 0; i < data.length; i += 4 * skipFactor) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          pixelCount++;
        }
        
        // Calculate the average
        r = Math.floor(r / pixelCount);
        g = Math.floor(g / pixelCount);
        b = Math.floor(b / pixelCount);
        
        // Create a slightly darker version for better aesthetics
        const darkenFactor = 0.8; // 80% of the original brightness
        const darkR = Math.floor(r * darkenFactor);
        const darkG = Math.floor(g * darkenFactor);
        const darkB = Math.floor(b * darkenFactor);
        
        // Calculate text color (black for light backgrounds, white for dark)
        const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
        const textColor = brightness > 0.6 ? '#000000' : '#ffffff';
        
        // Set the color in state
        setAlbumColor({
          background: `rgb(${darkR}, ${darkG}, ${darkB})`,
          text: textColor,
          gradient: `linear-gradient(135deg, rgb(${darkR}, ${darkG}, ${darkB}), rgb(${Math.floor(darkR*0.7)}, ${Math.floor(darkG*0.7)}, ${Math.floor(darkB*0.7)}))`
        });
      } catch (error) {
        console.error("Error extracting color:", error);
        setAlbumColor(null);
      }
    };
    
    img.onerror = () => {
      console.error("Error loading image for color extraction");
      setAlbumColor(null);
    };
    
    img.src = imageUrl;
  }, []);
  
  // Update color when most recent track changes
  useEffect(() => {
    if (mostRecentTrack?.albumImageUrl) {
      extractDominantColor(mostRecentTrack.albumImageUrl);
    }
  }, [mostRecentTrack?.albumImageUrl, extractDominantColor]);

  // --- Audio Player Logic ---
  const playTrack = (track) => {
    // Check if player is ready
    if (!playerReady || !deviceId) {
      setPlaybackError("Spotify player isn't ready yet. Please wait or refresh the page.");
      return;
    }

    setPlaybackError(null);

    // If clicking the currently playing track, toggle play/pause
    if (currentlyPlaying && currentlyPlaying.id === track.id) {
      togglePlayPause();
      return;
    }

    // Set the currently playing track immediately for better UI feedback
    setCurrentlyPlaying(track);
    
    // Play the selected track
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        uris: [`spotify:track:${track.id}`]
      })
    })
    .then(response => {
      if (!response.ok) {
        // Roll back UI state since play failed
        if (currentlyPlaying && currentlyPlaying.id !== track.id) {
          setCurrentlyPlaying(currentlyPlaying);
        } else {
          setCurrentlyPlaying(null);
        }
        
        if (response.status === 401) {
          throw new Error('Spotify access token expired. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('You need Spotify Premium to play tracks.');
        } else {
          throw new Error(`Error playing track: ${response.status}`);
        }
      }
      // The player state will update via the state_changed listener
      // but we've already updated currentlyPlaying above
    })
    .catch(error => {
      console.error("Error playing track:", error);
      setPlaybackError(error.message);
      
      // Instead of immediately opening Spotify, ask user to retry or try Spotify
      const shouldOpenSpotify = window.confirm(`Could not play track in browser: ${error.message}. Would you like to open Spotify instead?`);
      
      // Only fall back to opening Spotify if user confirms
      if (shouldOpenSpotify && track.spotifyUrl) {
        window.open(track.spotifyUrl, '_blank');
      }
    });
  };

  const togglePlayPause = () => {
    if (!playerInstance) return;
    
    playerInstance.togglePlay()
      .then(() => {
        // Player state will update via the state_changed listener
      })
      .catch(error => {
        console.error("Error toggling playback:", error);
        setPlaybackError("Failed to control playback. Try again.");
      });
  };

  // Handle audio ended event
  useEffect(() => {
    const audioElement = audioRef.current;
    
    const handleEnded = () => {
      setIsPlaying(false);
    };
    
    if (audioElement) {
      audioElement.addEventListener('ended', handleEnded);
    }
    
    return () => {
      if (audioElement) {
        audioElement.removeEventListener('ended', handleEnded);
      }
    };
  }, []);

  // --- Album Wheel Logic ---
  const handleWheel = useCallback((event) => {
    event.preventDefault();
    if (isWheeling.current || albums.length === 0) return;

    isWheeling.current = true;

    const direction = Math.sign(event.deltaY);
    setFocusedIndex(prevIndex => {
      // Use modulo for infinite scrolling
      const nextIndexRaw = prevIndex + direction;
      // Ensure the result is always positive before modulo
      return (nextIndexRaw % albums.length + albums.length) % albums.length;
    });

    // Debounce wheel events
    clearTimeout(wheelTimeout.current);
    wheelTimeout.current = setTimeout(() => {
      isWheeling.current = false;
    }, 50); // Slightly faster debounce for smoother feel maybe

  }, [albums.length]);

  // Effect to apply transforms based on focusedIndex
  useEffect(() => {
    if (!wheelContainerRef.current || albums.length === 0 || !albumItemsRef.current.length) return;

    const items = albumItemsRef.current;
    const containerWidth = wheelContainerRef.current.offsetWidth;
    // Ensure we have a valid item to measure, otherwise use default
    const itemWidth = items[focusedIndex]?.offsetWidth || items[0]?.offsetWidth || 150;
    // const centerOffset = (containerWidth / 2) - (itemWidth / 2); // Likely not needed
    const numAlbums = albums.length;

    items.forEach((item, index) => {
      if (!item) return;

      // Calculate difference, considering wrap-around for shortest distance
      let diff = index - focusedIndex;
      const half = numAlbums / 2;
      if (Math.abs(diff) > half) {
        diff = diff > 0 ? diff - numAlbums : diff + numAlbums;
      }

      const distanceFactor = Math.abs(diff);

      // Determine if this item is far enough away to be considered wrapping around
      const isWrapping = distanceFactor >= Math.floor(numAlbums / 2) - 1; // Include items just about to wrap
      const shouldShow = !isWrapping;

      // Calculate position, scale, opacity based on distance from focus
      // --- ADJUST SPACING HERE ---
      const translateX = diff * (itemWidth * 0.65); // Increased multiplier from 0.5 to 0.6
      const scale = Math.max(0.6, 1 - distanceFactor * 0.15);
      const opacity = shouldShow ? Math.max(0.3, 1 - distanceFactor * 0.30) : 0; // Hide completely if wrapping
      const zIndex = numAlbums - distanceFactor;

      // Set duration for properties that transition (transform, opacity)
      item.style.transitionDuration = isWrapping ? '0s' : '0.4s'; // Use '0.4s' or sync with CSS var(--transition-speed)

      // Apply styles
      item.style.transform = `translateX(${translateX}px) scale(${scale})`;
      item.style.opacity = `${opacity}`;
      item.style.zIndex = `${zIndex}`;
      item.style.visibility = shouldShow ? 'visible' : 'hidden'; // Hide from rendering if wrapping
      item.style.pointerEvents = 'auto'; // Always allow clicks, handle logic in JS
      // --- REMOVE DYNAMIC DELAY ---
      // item.style.transitionDelay = `${distanceFactor * 0.03}s`; // Remove this line
      item.style.transitionDelay = '0s'; // Explicitly set delay to 0 or remove property

    });

     const itemContainer = wheelContainerRef.current.querySelector('.album-wheel-items');
     if (itemContainer) {
        // Shift the container left by half the item width to center the focused item
        const centeringShift = itemWidth / 2;
        itemContainer.style.transform = `translateX(-${centeringShift}px)`;
     }

  }, [focusedIndex, albums, albums.length]); // Rerun when albums data changes too

  // ADD useEffect for wheel listener only
  useEffect(() => {
    const container = wheelContainerRef.current;
    if (container) {
        container.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
        if (container) {
            container.removeEventListener('wheel', handleWheel);
        }
        clearTimeout(wheelTimeout.current);
    };
  }, [handleWheel]); // Only depends on handleWheel callback

  const handleLoginClick = () => {
    // Opens the backend login route in a new tab/window
    window.open(`${BACKEND_URL}/login`, '_blank');
    // Optionally, you could add logic here to poll the backend
    // or provide a button to manually refresh after login.
  };

  // --- Click Handler for Album Items ---
  const handleAlbumClick = (index, event) => {
    if (index !== focusedIndex) {
        event.preventDefault(); // Prevent link navigation if not focused
        setFocusedIndex(index); // Rotate wheel to the clicked item
    }
    // If index === focusedIndex, do nothing and allow the default anchor tag behavior
  };

  return (
    <div className="music-library">
      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      {/* Spotify Web Player mount point (invisible) */}
      <div id="spotify-player"></div>
      
      {/* Error message for playback issues */}
      {playbackError && (
        <div className="playback-error-message">
          <p>{playbackError}</p>
          <button onClick={() => setPlaybackError(null)} className="dismiss-btn">Dismiss</button>
        </div>
      )}
      
      {/* Top Section: Now Playing (Left) + Recently Played History (Right) */}
      <div className="top-section">
        {/* Recently Played Section (Left) - Now renamed to Now Playing */}
        <div className="recently-played-section">
          <h2>Now Playing</h2>
          {loadingRecentTracks && <p>Loading last track...</p>}
          {errorRecentTracks && (
            <div className="error-message">
              <p>{errorRecentTracks}</p>
              {needsLogin && (
                <button onClick={handleLoginClick} className="login-button">
                  Connect to Spotify
                </button>
              )}
            </div>
          )}
          {!loadingRecentTracks && !errorRecentTracks && mostRecentTrack && (
                <div 
                  className="now-playing-track-info" 
                  style={albumColor ? {
                    background: albumColor.gradient,
                    color: albumColor.text
                  } : {}}
                >
                  <div className="now-playing-album-container">
                    <img src={mostRecentTrack.albumImageUrl} alt={`${mostRecentTrack.albumName} cover`} className="now-playing-album-art" />
                  </div>
                  <div className="now-playing-track-details">
                    <div className="now-playing-track-text">
                      <p 
                        className="now-playing-track-name"
                        style={albumColor ? { color: albumColor.text } : {}}
                      >
                        {mostRecentTrack.name}
                      </p>
                      <p 
                        className="now-playing-track-artist"
                        style={albumColor ? { color: albumColor.text } : {}}
                      >
                        {mostRecentTrack.artist}
                      </p>
                      <p 
                        className="now-playing-track-album"
                        style={albumColor ? { color: `${albumColor.text}CC` } : {}}
                      >
                        {mostRecentTrack.albumName}
                      </p>
                    </div>
                    <button 
                      className={`play-btn ${currentlyPlaying && currentlyPlaying.id === mostRecentTrack.id && isPlaying ? 'pause' : 'play'}`}
                      onClick={() => playTrack(mostRecentTrack)}
                      disabled={!playerReady}
                      style={albumColor ? {
                        backgroundColor: albumColor.text,
                        color: albumColor.background
                      } : {}}
                    >
                      {currentlyPlaying && currentlyPlaying.id === mostRecentTrack.id && isPlaying ? 'Pause' : 'Play'}
                      {!playerReady && ' (connecting...)'}
                    </button>
                  </div>
                </div>
          )}
          {!loadingRecentTracks && !errorRecentTracks && !mostRecentTrack && (
            <p>No recent track data found.</p>
          )}
        </div>

        {/* Other Recently Played Tracks Section (Right) */}
        <div className="recent-tracks-list-section">
          <h2>Recently Played</h2>
          <div className="recent-tracks-list-content">
            {loadingRecentTracks && <p>Loading recent tracks...</p>}
            {/* Show login button here too if needed */}
            {errorRecentTracks && !needsLogin && <p className="error-message">{errorRecentTracks}</p>}
            {errorRecentTracks && needsLogin && (
               <div className="error-message">
                 <p>{errorRecentTracks}</p>
               </div>
             )}
            {!loadingRecentTracks && !errorRecentTracks && filteredRecentTracks.length > 0 && (
              <ul>
                {filteredRecentTracks.map((track) => (
                  <li key={track.id || track.played_at}>
                    <img src={track.albumImageUrl} alt={track.albumName} width="40" height="40" />
                    <div>
                      <p>{track.name}</p>
                      <p>{track.artist}</p>
                    </div>
                    <button 
                      className={`play-btn-small ${currentlyPlaying && currentlyPlaying.id === track.id && isPlaying ? 'pause' : 'play'}`}
                      onClick={() => playTrack(track)}
                      disabled={!playerReady}
                    >
                      <img 
                        src={currentlyPlaying && currentlyPlaying.id === track.id && isPlaying ? pauseButton : playButton} 
                        alt={currentlyPlaying && currentlyPlaying.id === track.id && isPlaying ? 'Pause' : 'Play'}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            )}
             {!loadingRecentTracks && !errorRecentTracks && filteredRecentTracks.length === 0 && (
               <p>No recent tracks found.</p>
             )}
             
             {/* Move Now Playing bar under Recently Played list */}
             {currentlyPlaying && (
                <div className="now-playing-bar recently-played-bottom">
                  <div className="now-playing-info">
                    <img src={currentlyPlaying.albumImageUrl} alt="Album art" className="now-playing-img" />
                    <div className="now-playing-details">
                      <p className="now-playing-name">{currentlyPlaying.name}</p>
                      <p className="now-playing-artist">{currentlyPlaying.artist}</p>
                    </div>
                  </div>
                  <div className="player-controls">
                    <button 
                      className={`play-pause-btn ${isPlaying ? 'pause' : 'play'}`} 
                      onClick={togglePlayPause}
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                      disabled={!playerReady}
                    >
                      <img 
                        src={isPlaying ? pauseButton : playButton} 
                        alt={isPlaying ? 'Pause' : 'Play'}
                      />
                    </button>
                    {!playerReady && <span className="player-status">Connecting to Spotify...</span>}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>


      {/* Album Collection Section (Bottom - Full Width) */}
      <div className="album-collection-section">
        <h2>Album Collection</h2>
        {loadingAlbums && <p>Loading albums...</p>}
        {errorAlbums && <p className="error-message">{errorAlbums}</p>}
        {!loadingAlbums && !errorAlbums && albums.length > 0 && (
          <div className="album-wheel-container" ref={wheelContainerRef}>
            <div className="album-wheel-items">
              {albums.map((album, index) => (
                 <div
                   key={`${album.id}-${index}`} // Ensure key is unique if albums reload
                   className={`album-item ${index === focusedIndex ? 'focused' : ''}`} // Add focused class
                   ref={el => albumItemsRef.current[index] = el}
                   onClick={(e) => handleAlbumClick(index, e)} // Add click handler here
                   // Remove inline transition delay, use class or useEffect calculation
                   style={{ /* remove transitionDelay here if set by useEffect */ }}
                 >
                    {/* Anchor tag handles navigation ONLY when focused (due to handleAlbumClick logic) */}
                    <a href={album.spotifyUrl} target="_blank" rel="noopener noreferrer" className="album-link" draggable="false">
                       <img src={album.imageUrl} alt={`${album.name} cover`} className="album-cover" draggable="false"/>
                       <div className="album-info">
                           <p className="album-name">{album.name}</p>
                           <p className="album-artist">{album.artist}</p>
                       </div>
                    </a>
                 </div>
              ))}
            </div>
          </div>
        )}
        {!loadingAlbums && !errorAlbums && albums.length === 0 && (
          <p>No albums found.</p>
        )}
      </div>
    </div>
  );
}

export default MusicLibrary;
