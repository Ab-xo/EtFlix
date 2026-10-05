import { useState, useRef, useEffect } from 'react';
import '../styles/VideoPlayer.css';

function VideoPlayer({ movie, onClose }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const progressBarRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [buffered, setBuffered] = useState(0);
  
  // Settings
  const [showSettings, setShowSettings] = useState(false);
  const [activeSettingPanel, setActiveSettingPanel] = useState(null);
  const [selectedQuality, setSelectedQuality] = useState('1080p');
  const [selectedSubtitle, setSelectedSubtitle] = useState('off');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  
  // Available options
  const qualityOptions = ['4K', '1080p', '720p', '480p', '360p', 'Auto'];
  const subtitleOptions = ['Off', 'English', 'Spanish', 'French', 'German', 'Japanese', 'Korean'];
  const speedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  // Demo video URL (replace with actual video source)
  const videoSource = movie?.trailer 
    ? `https://www.youtube.com/watch?v=${movie.trailer.key}`
    : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  // Auto-hide controls
  useEffect(() => {
    let timeout;
    const resetTimer = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (isPlaying && !showSettings) {
          setShowControls(false);
        }
      }, 3000);
    };

    const handleMouseMove = () => resetTimer();
    const handleMouseLeave = () => {
      if (isPlaying && !showSettings) {
        setShowControls(false);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      clearTimeout(timeout);
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [isPlaying, showSettings]);

  // Video event handlers
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      // Update buffered
      if (videoRef.current.buffered.length > 0) {
        const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
        setBuffered((bufferedEnd / videoRef.current.duration) * 100);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleProgressClick = (e) => {
    if (progressBarRef.current && videoRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * duration;
    }
  };

  const handleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const handleQualityChange = (quality) => {
    setSelectedQuality(quality);
    setShowSettings(false);
    setActiveSettingPanel(null);
    // In production, this would change the video source
    console.log(`Quality changed to: ${quality}`);
  };

  const handleSubtitleChange = (subtitle) => {
    setSelectedSubtitle(subtitle);
    setShowSettings(false);
    setActiveSettingPanel(null);
    // In production, this would toggle subtitle tracks
    console.log(`Subtitle changed to: ${subtitle}`);
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSettings(false);
    setActiveSettingPanel(null);
  };

  const skipTime = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'f':
          e.preventDefault();
          handleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          handleMute();
          break;
        case 'arrowleft':
          e.preventDefault();
          skipTime(-10);
          break;
        case 'arrowright':
          e.preventDefault();
          skipTime(10);
          break;
        case 'arrowup':
          e.preventDefault();
          setVolume(prev => Math.min(1, prev + 0.1));
          if (videoRef.current) videoRef.current.volume = Math.min(1, volume + 0.1);
          break;
        case 'arrowdown':
          e.preventDefault();
          setVolume(prev => Math.max(0, prev - 0.1));
          if (videoRef.current) videoRef.current.volume = Math.max(0, volume - 0.1);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, volume]);

  return (
    <div 
      className={`video-player ${isFullscreen ? 'video-player--fullscreen' : ''}`}
      ref={containerRef}
    >
      {/* Close Button */}
      <button 
        className="video-player__close"
        onClick={onClose}
        aria-label="Close player"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
        </svg>
      </button>

      {/* Video Element */}
      <video
        ref={videoRef}
        className="video-player__video"
        src={videoSource}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onClick={handlePlayPause}
        playsInline
      >
        {/* Subtitle tracks would be added here */}
        <track kind="captions" src="" label="English" />
      </video>

      {/* Center Play Button Overlay */}
      {!isPlaying && (
        <div className="video-player__play-overlay" onClick={handlePlayPause}>
          <button className="video-player__play-big" aria-label="Play video">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      )}

      {/* Movie Info Overlay */}
      <div className={`video-player__info ${showControls ? 'is-visible' : ''}`}>
        <h2 className="video-player__title">{movie?.title || 'Now Playing'}</h2>
        {movie?.year && movie?.rating && (
          <div className="video-player__meta">
            <span>{movie.year}</span>
            <span className="video-player__meta-divider">•</span>
            <span>⭐ {movie.rating}</span>
            {selectedQuality !== 'Auto' && (
              <>
                <span className="video-player__meta-divider">•</span>
                <span className="video-player__quality-badge">{selectedQuality}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className={`video-player__controls ${showControls ? 'is-visible' : ''}`}>
        {/* Progress Bar */}
        <div 
          className="video-player__progress"
          ref={progressBarRef}
          onClick={handleProgressClick}
        >
          <div className="video-player__progress-buffered" style={{ width: `${buffered}%` }} />
          <div 
            className="video-player__progress-played" 
            style={{ width: `${(currentTime / duration) * 100}%` }}
          >
            <div className="video-player__progress-handle" />
          </div>
        </div>

        {/* Control Buttons */}
        <div className="video-player__controls-row">
          <div className="video-player__controls-left">
            {/* Play/Pause */}
            <button 
              className="video-player__btn"
              onClick={handlePlayPause}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Skip Backward */}
            <button 
              className="video-player__btn"
              onClick={() => skipTime(-10)}
              aria-label="Rewind 10 seconds"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2.5 2v6h6M2.66 15.57a10 10 0 1 0 .57-8.38" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="video-player__skip-time">10</span>
            </button>

            {/* Skip Forward */}
            <button 
              className="video-player__btn"
              onClick={() => skipTime(10)}
              aria-label="Forward 10 seconds"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="video-player__skip-time">10</span>
            </button>

            {/* Volume */}
            <div className="video-player__volume-container">
              <button 
                className="video-player__btn"
                onClick={handleMute}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  </svg>
                ) : volume < 0.5 ? (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 9v6h4l5 5V4l-5 5H7z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                )}
              </button>
              <input
                type="range"
                className="video-player__volume-slider"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
              />
            </div>

            {/* Time */}
            <div className="video-player__time">
              <span>{formatTime(currentTime)}</span>
              <span className="video-player__time-separator">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="video-player__controls-right">
            {/* Settings */}
            <div className="video-player__settings">
              <button 
                className="video-player__btn"
                onClick={() => setShowSettings(!showSettings)}
                aria-label="Settings"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                </svg>
              </button>

              {/* Settings Menu */}
              {showSettings && (
                <div className="video-player__settings-menu">
                  {activeSettingPanel === null ? (
                    <>
                      <button 
                        className="video-player__setting-item"
                        onClick={() => setActiveSettingPanel('quality')}
                      >
                        <span>Quality</span>
                        <div className="video-player__setting-value">
                          <span>{selectedQuality}</span>
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                          </svg>
                        </div>
                      </button>
                      <button 
                        className="video-player__setting-item"
                        onClick={() => setActiveSettingPanel('subtitles')}
                      >
                        <span>Subtitles</span>
                        <div className="video-player__setting-value">
                          <span>{selectedSubtitle}</span>
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                          </svg>
                        </div>
                      </button>
                      <button 
                        className="video-player__setting-item"
                        onClick={() => setActiveSettingPanel('speed')}
                      >
                        <span>Speed</span>
                        <div className="video-player__setting-value">
                          <span>{playbackSpeed === 1 ? 'Normal' : `${playbackSpeed}x`}</span>
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                          </svg>
                        </div>
                      </button>
                    </>
                  ) : activeSettingPanel === 'quality' ? (
                    <>
                      <button 
                        className="video-player__setting-back"
                        onClick={() => setActiveSettingPanel(null)}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                        </svg>
                        <span>Quality</span>
                      </button>
                      {qualityOptions.map(quality => (
                        <button
                          key={quality}
                          className={`video-player__setting-option ${selectedQuality === quality ? 'is-active' : ''}`}
                          onClick={() => handleQualityChange(quality)}
                        >
                          <span>{quality}</span>
                          {selectedQuality === quality && (
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </>
                  ) : activeSettingPanel === 'subtitles' ? (
                    <>
                      <button 
                        className="video-player__setting-back"
                        onClick={() => setActiveSettingPanel(null)}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                        </svg>
                        <span>Subtitles</span>
                      </button>
                      {subtitleOptions.map(subtitle => (
                        <button
                          key={subtitle}
                          className={`video-player__setting-option ${selectedSubtitle === subtitle ? 'is-active' : ''}`}
                          onClick={() => handleSubtitleChange(subtitle)}
                        >
                          <span>{subtitle}</span>
                          {selectedSubtitle === subtitle && (
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </>
                  ) : (
                    <>
                      <button 
                        className="video-player__setting-back"
                        onClick={() => setActiveSettingPanel(null)}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                        </svg>
                        <span>Playback Speed</span>
                      </button>
                      {speedOptions.map(speed => (
                        <button
                          key={speed}
                          className={`video-player__setting-option ${playbackSpeed === speed ? 'is-active' : ''}`}
                          onClick={() => handleSpeedChange(speed)}
                        >
                          <span>{speed === 1 ? 'Normal' : `${speed}x`}</span>
                          {playbackSpeed === speed && (
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button 
              className="video-player__btn"
              onClick={handleFullscreen}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="video-player__shortcuts-hint">
        <span>Space</span> Play/Pause • <span>F</span> Fullscreen • <span>M</span> Mute • <span>← →</span> Skip 10s
      </div>
    </div>
  );
}

export default VideoPlayer;
