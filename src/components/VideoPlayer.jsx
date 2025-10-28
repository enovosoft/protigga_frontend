import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { useStoreState } from "easy-peasy";
import {
  FastForward,
  Maximize,
  Minimize,
  Pause,
  Play,
  Rewind,
  Settings,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactPlayer from "react-player";

const VideoPlayer = ({ url, title, courseSlug, topicId, onProgressUpdate }) => {
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [watermarkPosition, setWatermarkPosition] = useState({
    top: 10,
    left: 10,
  });

  const { profile } = useStoreState((store) => store.student);

  // Shuffle watermark position every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const videoRect = containerRef.current?.getBoundingClientRect();
      if (videoRect) {
        const maxTop = videoRect.height - 50;
        const maxLeft = videoRect.width - 150;
        setWatermarkPosition({
          top: Math.random() * maxTop,
          left: Math.random() * maxLeft,
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Convert youtu.be URL to standard youtube.com format (stricly checking)
  const normalizedUrl = useMemo(() => {
    if (!url) return null;

    // Handle youtu.be format
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/watch?v=${videoId}`;
    }

    return url;
  }, [url]);

  // Load saved progress when topic changes
  useEffect(() => {
    if (courseSlug && topicId) {
      const savedProgress = localStorage.getItem(
        `video_progress_${courseSlug}_${topicId}`
      );
      if (savedProgress) {
        const { progress, completed } = JSON.parse(savedProgress);
        setPlayed(progress);
        // If video was completed, don't autoplay
        if (completed) {
          setPlaying(false);
        }
      } else {
        setPlayed(0);
        setPlaying(true);
      }
    }
  }, [courseSlug, topicId]);

  // Save progress periodically and on video end
  const saveProgress = (progress, completed = false) => {
    if (courseSlug && topicId) {
      const progressData = {
        progress,
        completed,
        lastWatched: Date.now(),
      };
      localStorage.setItem(
        `video_progress_${courseSlug}_${topicId}`,
        JSON.stringify(progressData)
      );

      // Call the callback if provided
      if (onProgressUpdate) {
        onProgressUpdate(topicId, progress, completed);
      }
    }
  };

  // Handle video end
  const handleEnded = () => {
    setPlaying(false);
    saveProgress(1, true); // Mark as completed
  };
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Prevent default behavior and handle shortcuts only when video player is focused
      if (
        !containerRef.current?.contains(document.activeElement) &&
        !containerRef.current?.matches(":hover")
      ) {
        return;
      }

      switch (e.code) {
        case "Space":
          e.preventDefault();
          setPlaying((prev) => !prev);
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (playerRef.current) {
            const currentTime = playerRef.current.currentTime || 0;
            playerRef.current.currentTime = Math.max(0, currentTime - 10);
          }
          break;
        case "ArrowRight":
          e.preventDefault();
          if (playerRef.current) {
            const currentTime = playerRef.current.currentTime || 0;
            playerRef.current.currentTime = Math.min(
              duration,
              currentTime + 10
            );
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          setVolume((prev) => Math.min(1, prev + 0.1));
          setMuted(false);
          break;
        case "ArrowDown":
          e.preventDefault();
          setVolume((prev) => Math.max(0, prev - 0.1));
          break;
        case "KeyM":
          e.preventDefault();
          setMuted((prev) => !prev);
          break;
        case "KeyF":
          e.preventDefault();
          if (!isFullscreen && containerRef.current) {
            if (containerRef.current.requestFullscreen) {
              containerRef.current.requestFullscreen();
            }
          } else if (document.exitFullscreen) {
            document.exitFullscreen();
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [duration, isFullscreen]);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    // Add all possible fullscreen change event listeners
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, []);

  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  // Inject CSS to hide YouTube overlays
  useEffect(() => {
    const styleId = "youtube-overlay-hider";
    let style = document.getElementById(styleId);

    if (!style) {
      style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .ytp-chrome-top, .ytp-chrome-bottom, .ytp-gradient-top, .ytp-gradient-bottom,
        .ytp-progress-bar-container, .ytp-chrome-controls, .ytp-cards-teaser,
        .ytp-endscreen-content, .ytp-ce-element, .ytp-watermark, .ytp-pause-overlay,
        .ytp-scroll-min, .ytp-suggested-action, .ytp-videowall-still, .ytp-endscreen-next,
        .ytp-info-panel-compact, .ytp-title, .ytp-title-channel, .ytp-title-expanded-overlay,
        .ytp-share-panel, .ytp-watch-later-title, .ytp-watch-later-button, .ytp-share-button,
        .ytp-more-button, .ytp-impression-link, .ytp-videowall-still-info-content,
        .ytp-videowall-still-info-title, .ytp-cards-button, .ytp-cards-teaser,
        .ytp-info-panel, .ytp-hover-progress, .ytp-cued-thumbnail-overlay,
        .ytp-paid-content-overlay, .ytp-ad-overlay-container, .ytp-ad-text,
        .ytp-ad-skip-button-container, .ytp-ad-skip-button, .ytp-flyout-cta,
        .ytp-suggested-action-badge, .iv-drawer, .iv-click-target, .iv-close-button,
        .video-ads, .ytp-contextmenu, .ytp-player-content .ytp-swatch-background-color {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  useEffect(() => {
    let timeout;
    if (playing && showControls) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [playing, showControls]);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleProgress = (state) => {
    if (!seeking) {
      // For ReactPlayer v3, check different progress state formats
      let currentProgress = 0;
      if (state.played !== undefined && !isNaN(state.played)) {
        currentProgress = state.played;
        setPlayed(state.played);
      } else if (state.playedSeconds !== undefined && duration > 0) {
        currentProgress = state.playedSeconds / duration;
        setPlayed(currentProgress);
      }

      // Save progress every 5 seconds if playing
      if (
        playing &&
        duration > 0 &&
        Math.floor(currentProgress * duration) % 5 === 0
      ) {
        saveProgress(currentProgress);
      }

      // Mark as completed when 90% watched
      if (currentProgress >= 0.9 && courseSlug && topicId) {
        const savedData = localStorage.getItem(
          `video_progress_${courseSlug}_${topicId}`
        );
        if (!savedData || !JSON.parse(savedData).completed) {
          saveProgress(currentProgress, true);
        }
      }
    }
  };

  const handleDuration = (newDuration) => {
    // Handle different possible formats for duration
    let durationValue = newDuration;

    // If it's an event object, try to extract duration
    if (newDuration && typeof newDuration === "object" && newDuration.target) {
      durationValue = newDuration.target.duration;
    }

    if (durationValue && !isNaN(durationValue) && durationValue > 0) {
      setDuration(durationValue);
    }
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekChange = (value) => {
    if (Array.isArray(value) && value.length > 0) {
      setPlayed(value[0] / 100);
    }
  };

  const handleSeekMouseUp = (value) => {
    setSeeking(false);
    if (playerRef.current && Array.isArray(value) && value.length > 0) {
      const seekTime = (value[0] / 100) * duration;
      playerRef.current.currentTime = seekTime;
    }
  };

  // navigation (next/previous) is handled by the parent (CoursePage)
  // VideoPlayer no longer renders next/previous controls in its control bar.

  const handleSkipBack = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.currentTime || 0;
      playerRef.current.currentTime = Math.max(0, currentTime - 10);
    }
  };

  const handleSkipForward = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.currentTime || 0;
      playerRef.current.currentTime = Math.min(duration, currentTime + 10);
    }
  };

  const handleVolumeChange = (value) => {
    setVolume(value[0] / 100);
    setMuted(value[0] === 0);
  };

  const handleMute = () => {
    setMuted(!muted);
  };

  const handleFullscreen = () => {
    if (!isFullscreen && containerRef.current) {
      // Try different fullscreen methods for better mobile support
      const element = containerRef.current;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      // Try different exit fullscreen methods
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds) || seconds < 0) {
      return "0:00";
    }

    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    } else {
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    }
  };

  if (!normalizedUrl) {
    return (
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/25">
        <div className="text-center">
          <Play className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Select a video to play</p>
        </div>
      </div>
    );
  }

  // Check if ReactPlayer can handle this URL
  if (!ReactPlayer.canPlay(normalizedUrl)) {
    return (
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/25">
        <div className="text-center">
          <Play className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Unsupported video format</p>
          <p className="text-xs text-muted-foreground mt-2">{normalizedUrl}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative bg-black overflow-hidden w-full ${
        isFullscreen
          ? "fixed inset-0 z-50 w-screen h-screen"
          : "aspect-video min-h-60 sm:min-h-72 md:min-h-auto"
      }`}
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => playing && setShowControls(false)}
      style={{
        minHeight: isFullscreen ? "100vh" : "auto",
        height: isFullscreen ? "100vh" : "auto",
      }}
    >
      {/* Debug info */}
      {!playerReady && (
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs p-2 rounded z-50">
          Loading: {title}
        </div>
      )}

      <div className="w-full h-full">
        <ReactPlayer
          ref={playerRef}
          src={normalizedUrl}
          width="100%"
          height="100%"
          playing={playing}
          volume={volume}
          muted={muted}
          playbackRate={playbackRate}
          onProgress={handleProgress}
          onDurationChange={handleDuration}
          onEnded={handleEnded}
          onTimeUpdate={(e) => {
            if (!seeking && e.target) {
              const currentTime = e.target.currentTime || 0;
              const totalDuration = e.target.duration || duration;
              if (totalDuration > 0) {
                setPlayed(currentTime / totalDuration);
              }
            }
          }}
          onReady={(player) => {
            setPlayerReady(true);
            setShowControls(true);
            // Try to get duration from the player directly
            if (player && player.duration) {
              setDuration(player.duration);
            }
          }}
          onError={() => {
            setPlayerReady(false);
          }}
          config={{
            youtube: {
              playerVars: {
                controls: 0,
                modestbranding: 1,
                rel: 0,
                autoplay: 1,
                fs: 0,
                disablekb: 1,
                iv_load_policy: 3,
                cc_load_policy: 0,
                origin: window.location.origin,
                widget_referrer: window.location.origin,
                enablejsapi: 1,
                playsinline: 1,
                end: undefined,
              },
              embedOptions: {
                host: "https://www.youtube-nocookie.com",
              },
            },
          }}
        />
      </div>

      {/* Watermark */}
      {profile?.phone && playing && (
        <div
          className="absolute pointer-events-none select-none z-40 text-secondary/30 text-lg font-medium "
          style={{
            top: `${watermarkPosition.top}px`,
            left: `${watermarkPosition.left}px`,
          }}
        >
          {profile.phone}
        </div>
      )}

      {/* Custom Controls */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Play/Pause Overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer mb-20 sm:mb-0"
          onClick={handlePlayPause}
        >
          {!playing && (
            <div className="bg-black/50 rounded-full p-4">
              <Play className="w-12 h-12 text-white fill-white" />
            </div>
          )}
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 sm:p-4">
          {/* Progress Bar */}
          <div className="mb-2 sm:mb-3">
            <Slider
              value={[played * 100]}
              onValueChange={handleSeekChange}
              onPointerDown={handleSeekMouseDown}
              onValueCommit={handleSeekMouseUp}
              max={100}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-white/70 mt-2">
              <span>{formatTime(played * duration)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between gap-2">
            {/* Left Controls - Play, Skip, Next/Prev Topic */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Rewind 10 seconds */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkipBack}
                className="text-white hover:bg-white/20 relative w-10 h-10 sm:w-11 sm:h-11 p-1 flex-shrink-0"
                title="Rewind 10 seconds"
              >
                <Rewind className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="absolute text-[11px] md:text-xs  font-bold -bottom-0.5 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  10
                </span>
              </Button>
              {/* Play/Pause */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePlayPause}
                className="text-white hover:bg-white/20 w-11 h-11 sm:w-12 sm:h-12 p-1 flex-shrink-0"
              >
                {playing ? (
                  <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5" />
                )}
              </Button>

              {/* Fast Forward 10 seconds */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkipForward}
                className="text-white hover:bg-white/20 relative w-10 h-10 sm:w-11 sm:h-11 p-1 flex-shrink-0"
                title="Fast forward 10 seconds"
              >
                <FastForward className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="absolute text-[11px] md:text-xs  font-bold -bottom-0.5 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  10
                </span>
              </Button>
            </div>

            {/* Right Controls - Volume, Settings, Fullscreen */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Volume Slider - Hidden on mobile, shown on larger screens */}
              <div className="w-16 sm:w-20 md:w-24 hidden md:block">
                <Slider
                  value={[muted ? 0 : volume * 100]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Volume - Always visible */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMute}
                className="text-white hover:bg-white/20 w-9 h-9 sm:w-10 sm:h-10 p-1 flex-shrink-0"
              >
                {muted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </Button>

              {/* Speed control  */}
              {!isFullscreen && (
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20 w-auto min-w-[48px] h-8 px-2 flex-shrink-0"
                      title="Playback Speed"
                    >
                      <Settings className="w-4 h-4 mr-1" />
                      <span className="text-xs font-medium">
                        {playbackRate}x
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className={`z-[999999] min-w-[120px] ${
                      isFullscreen
                        ? "bg-black/90 border-white/20 text-white"
                        : "bg-popover/95 backdrop-blur-sm"
                    }`}
                    side="top"
                    align="center"
                    sideOffset={12}
                    avoidCollisions={true}
                    sticky="always"
                    onCloseAutoFocus={(e) => e.preventDefault()}
                  >
                    {playbackRates.map((rate) => (
                      <DropdownMenuItem
                        key={rate}
                        onClick={() => setPlaybackRate(rate)}
                        className={`cursor-pointer text-center justify-center ${
                          isFullscreen
                            ? `hover:bg-white/20 ${
                                rate === playbackRate
                                  ? "bg-white/30 text-white font-semibold"
                                  : "text-white/80"
                              }`
                            : `hover:bg-accent/50 ${
                                rate === playbackRate
                                  ? "bg-accent text-accent-foreground font-semibold"
                                  : "text-popover-foreground"
                              }`
                        }`}
                      >
                        {rate}x
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Fullscreen */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFullscreen}
                className="text-white hover:bg-white/20 w-9 h-9 sm:w-10 sm:h-10 p-1 flex-shrink-0"
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Title Overlay */}
      {title && showControls && (
        <div className="hidden lg:block absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4">
          <h3 className="text-white font-medium">{title}</h3>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
