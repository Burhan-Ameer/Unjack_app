import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundTimer from 'react-native-background-timer';

interface SessionState {
  isActive: boolean;
  targetDuration: number; // in seconds
  elapsedSeconds: number;
  scheduleId: string | null;
  startTime: number | null; // timestamp when session started
}

interface FocusModeState {
  enabled: boolean;
  blockedApps: string[];
  dailyGoalMinutes: number;
  weeklyGoalMinutes: number;
}

interface SessionContextType {
  session: SessionState;
  focusMode: FocusModeState;
  startSession: (duration: number, scheduleId?: string | null) => void;
  stopSession: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  resetSession: () => void;
  toggleFocusMode: (enabled: boolean) => void;
  setFocusBlockedApps: (apps: string[]) => void;
  setFocusDailyGoal: (minutes: number) => void;
  setFocusWeeklyGoal: (minutes: number) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

const SESSION_STORAGE_KEY = 'session_state';
const FOCUS_MODE_STORAGE_KEY = 'focus_mode_state';

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionState>({
    isActive: false,
    targetDuration: 0,
    elapsedSeconds: 0,
    scheduleId: null,
    startTime: null,
  });

  const [focusMode, setFocusMode] = useState<FocusModeState>({
    enabled: false,
    blockedApps: [],
    dailyGoalMinutes: 60,
    weeklyGoalMinutes: 420,
  });

  const intervalRef = useRef<ReturnType<
    typeof BackgroundTimer.setInterval
  > | null>(null);

  // Load session from storage on mount
  useEffect(() => {
    const loadSession = async () => {
      try {
        const stored = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          // If session was active, check if it's still valid (within last 24 hours)
          if (parsed.isActive && parsed.startTime) {
            const now = Date.now();
            const elapsedSinceStart = Math.floor(
              (now - parsed.startTime) / 1000,
            );
            const newElapsed = Math.min(
              parsed.elapsedSeconds + elapsedSinceStart,
              parsed.targetDuration,
            );
            parsed.elapsedSeconds = newElapsed;
            if (newElapsed >= parsed.targetDuration) {
              parsed.isActive = false;
              parsed.elapsedSeconds = parsed.targetDuration;
            }
          }
          setSession(parsed);
        }
      } catch (error) {
        console.error('Failed to load session state:', error);
      }
    };
    loadSession();
  }, []);

  // Load focus mode from storage on mount
  useEffect(() => {
    const loadFocusMode = async () => {
      try {
        const stored = await AsyncStorage.getItem(FOCUS_MODE_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setFocusMode(prev => ({ ...prev, ...parsed }));
        }
      } catch (error) {
        console.error('Failed to load focus mode state:', error);
      }
    };
    loadFocusMode();
  }, []);

  // Save session to storage whenever it changes
  useEffect(() => {
    const saveSession = async () => {
      try {
        await AsyncStorage.setItem(
          SESSION_STORAGE_KEY,
          JSON.stringify(session),
        );
      } catch (error) {
        console.error('Failed to save session state:', error);
      }
    };
    saveSession();
  }, [session]);

  // Save focus mode to storage whenever it changes
  useEffect(() => {
    const saveFocusMode = async () => {
      try {
        await AsyncStorage.setItem(
          FOCUS_MODE_STORAGE_KEY,
          JSON.stringify(focusMode),
        );
      } catch (error) {
        console.error('Failed to save focus mode state:', error);
      }
    };
    saveFocusMode();
  }, [focusMode]);

  // Timer logic
  useEffect(() => {
    if (session.isActive && session.elapsedSeconds < session.targetDuration) {
      intervalRef.current = BackgroundTimer.setInterval(() => {
        setSession(prev => {
          const newElapsed = prev.elapsedSeconds + 1;
          if (newElapsed >= prev.targetDuration) {
            // Session ended
            return {
              ...prev,
              isActive: false,
              elapsedSeconds: prev.targetDuration,
            };
          }
          return { ...prev, elapsedSeconds: newElapsed };
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        BackgroundTimer.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        BackgroundTimer.clearInterval(intervalRef.current);
      }
    };
  }, [session.isActive, session.elapsedSeconds, session.targetDuration]);

  const startSession = (duration: number, scheduleId: string | null = null) => {
    setSession({
      isActive: true,
      targetDuration: duration * 60, // convert minutes to seconds
      elapsedSeconds: 0,
      scheduleId,
      startTime: Date.now(),
    });
  };

  const stopSession = () => {
    setSession(prev => ({
      ...prev,
      isActive: false,
    }));
  };

  const pauseSession = () => {
    // For now, just stop; could add paused state later
    stopSession();
  };

  const resumeSession = () => {
    // For now, restart from current elapsed
    if (session.elapsedSeconds < session.targetDuration) {
      setSession(prev => ({
        ...prev,
        isActive: true,
        startTime: Date.now() - prev.elapsedSeconds * 1000,
      }));
    }
  };

  const resetSession = () => {
    setSession({
      isActive: false,
      targetDuration: 0,
      elapsedSeconds: 0,
      scheduleId: null,
      startTime: null,
    });
  };

  const toggleFocusMode = (enabled: boolean) => {
    setFocusMode(prev => ({ ...prev, enabled }));
  };

  const setFocusBlockedApps = (apps: string[]) => {
    setFocusMode(prev => ({ ...prev, blockedApps: apps }));
  };

  const setFocusDailyGoal = (minutes: number) => {
    setFocusMode(prev => ({ ...prev, dailyGoalMinutes: Math.max(30, minutes) }));
  };

  const setFocusWeeklyGoal = (minutes: number) => {
    setFocusMode(prev => ({
      ...prev,
      weeklyGoalMinutes: Math.max(60, minutes),
    }));
  };

  return (
    <SessionContext.Provider
      value={{
        session,
        focusMode,
        startSession,
        stopSession,
        pauseSession,
        resumeSession,
        resetSession,
        toggleFocusMode,
        setFocusBlockedApps,
        setFocusDailyGoal,
        setFocusWeeklyGoal,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
