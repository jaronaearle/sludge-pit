import { useRef, useState, useEffect } from "react";
import { ModeType, StringNumber } from "../../types/music";
import {
  MODE_TRACK_ROOTS,
  MODE_TYPES,
  MODE_LABELS,
  getNoteDisplay,
} from "../../utils/music";
import styles from "./ModePlayer.module.css";

const MODE_TRACKS: Record<Exclude<ModeType, "none">, string> = {
  ionian: "/modes/Ionian.m4a",
  dorian: "/modes/Dorian.m4a",
  phrygian: "/modes/Phrygian.m4a",
  lydian: "/modes/Lydian.m4a",
  mixolydian: "/modes/Mixolydian.m4a",
  aeolian: "/modes/Aeolian.m4a",
  locrian: "/modes/Locrian.m4a",
};

const ALL_STRINGS: StringNumber[] = [1, 2, 3, 4, 5, 6];

function pickRandom<T>(arr: T[], exclude?: T): T {
  const pool = exclude !== undefined ? arr.filter((x) => x !== exclude) : arr;
  return pool[Math.floor(Math.random() * pool.length)];
}

type PracticeMode = "off" | "single" | "random";

interface ModePlayerProps {
  modeType: Exclude<ModeType, "none">;
  selectedString: StringNumber;
  onModeTypeChange: (mode: ModeType) => void;
  onSingleStringModeChange: (enabled: boolean) => void;
  onSelectedStringChange: (string: StringNumber) => void;
  onPracticeModeChange: (active: boolean) => void;
}

export function ModePlayer({
  modeType,
  selectedString,
  onModeTypeChange,
  onSingleStringModeChange,
  onSelectedStringChange,
  onPracticeModeChange,
}: ModePlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [practiceMode, setPracticeMode] = useState<PracticeMode>("off");
  const pendingAutoPlay = useRef(false);

  // Reload audio when modeType changes; auto-play if practice mode triggered the change
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.load();
    setCurrentTime(0);
    setDuration(0);
    if (!pendingAutoPlay.current) {
      setIsPlaying(false);
    }
  }, [modeType]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleCanPlay = () => {
    if (pendingAutoPlay.current && audioRef.current) {
      pendingAutoPlay.current = false;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleEnded = () => {
    if (practiceMode === "single") {
      const newStr = pickRandom(ALL_STRINGS, selectedString);
      onSelectedStringChange(newStr);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      setCurrentTime(0);
      setIsPlaying(true);
    } else if (practiceMode === "random") {
      const newMode = pickRandom(MODE_TYPES, modeType);
      const newStr = pickRandom(ALL_STRINGS, selectedString);
      pendingAutoPlay.current = true;
      onSelectedStringChange(newStr);
      onModeTypeChange(newMode); // triggers useEffect → audio.load() → onCanPlay → play
    } else {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    audioRef.current.currentTime =
      ((e.clientX - rect.left) / rect.width) * duration;
  };

  const startSinglePractice = () => {
    const str = pickRandom(ALL_STRINGS);
    onSingleStringModeChange(true);
    onSelectedStringChange(str);
    setPracticeMode("single");
    onPracticeModeChange(true);
    if (!isPlaying && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const startRandomPractice = () => {
    const newMode = pickRandom(MODE_TYPES, modeType);
    const str = pickRandom(ALL_STRINGS);
    pendingAutoPlay.current = true;
    onSingleStringModeChange(true);
    onSelectedStringChange(str);
    setPracticeMode("random");
    onPracticeModeChange(true);
    onModeTypeChange(newMode);
  };

  const stopPractice = () => {
    setPracticeMode("off");
    pendingAutoPlay.current = false;
    onSingleStringModeChange(false);
    onPracticeModeChange(false);
    if (audioRef.current) audioRef.current.pause();
    setIsPlaying(false);
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${Math.floor(s % 60)
      .toString()
      .padStart(2, "0")}`;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={styles.player}>
      <audio
        ref={audioRef}
        src={MODE_TRACKS[modeType]}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onCanPlay={handleCanPlay}
      />

      <div className={styles.transport}>
        <button
          className={styles.playButton}
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "⏸" : "▶"}
        </button>
        <div className={styles.progressTrack} onClick={handleProgressClick}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className={styles.time}>
          {formatTime(currentTime)}
          {duration > 0 && ` / ${formatTime(duration)}`}
        </span>
        <span className={styles.key}>
          Key: {getNoteDisplay(MODE_TRACK_ROOTS[modeType])}
        </span>
      </div>

      {practiceMode === "off" ? (
        <div className={styles.practiceButtons}>
          <button
            className={styles.practiceButton}
            onClick={startSinglePractice}
          >
            Single Mode
          </button>
          <button
            className={styles.practiceButton}
            onClick={startRandomPractice}
          >
            Random Mode
          </button>
        </div>
      ) : (
        <div className={styles.practiceActive}>
          <span className={styles.practiceInfo}>
            {practiceMode === "random"
              ? `${MODE_LABELS[modeType]}  ·  String ${selectedString}`
              : `String ${selectedString}`}
          </span>
          <button className={styles.stopButton} onClick={stopPractice}>
            Stop
          </button>
        </div>
      )}
    </div>
  );
}
