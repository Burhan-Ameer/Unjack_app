# Focus Mode Implementation

## Overview
Focus Mode is now fully integrated into your Unjack app. It allows users to:
- ✅ Toggle focus mode on/off
- ✅ Block distracting apps during focus mode
- ✅ Set daily and weekly focus time goals

## What Was Changed

### 1. **SessionContext** (`src/contexts/SessionContext.tsx`)
Added focus mode state management:
- `FocusModeState` interface with:
  - `enabled`: boolean to toggle focus mode
  - `blockedApps`: array of app package names to block
  - `dailyGoalMinutes`: daily focus goal (default: 60 min)
  - `weeklyGoalMinutes`: weekly focus goal (default: 420 min)

- New context methods:
  - `toggleFocusMode(enabled)`: Enable/disable focus mode
  - `setFocusBlockedApps(apps)`: Set which apps to block
  - `setFocusDailyGoal(minutes)`: Update daily goal
  - `setFocusWeeklyGoal(minutes)`: Update weekly goal

- Persistent storage using AsyncStorage with key: `focus_mode_state`

### 2. **SettingsScreen** (`src/screens/SettingsScreen.tsx`)
**Reorganized the settings UI:**
- **New Focus Mode Section** replaces the old "Focus Timer" section
  - Toggle to enable/disable focus mode
  - Daily goal adjusters (with -/+ buttons)
  - Weekly goal adjusters (with -/+ buttons)
  - Visual status button showing if focus mode is active

- **"Apps to Block in Focus Mode"** section (Android only)
  - Lists all installed user apps
  - Allows toggling which apps to block when focus mode is enabled
  - Blocked apps are automatically enabled via the Accessibility API when focus mode is active

## How to Use

### In Your App
1. **Enable Focus Mode**: Users toggle the switch in Settings → Focus Mode
2. **Select Apps to Block**: In Settings → Apps to Block in Focus Mode, users select apps they want blocked
3. **Set Goals**: Use the +/- buttons to set daily and weekly focus goals
4. **Monitor Status**: The status button shows if focus mode is currently active

### Accessing Focus Mode in Code
```typescript
import { useSession } from '../contexts/SessionContext';

export default function MyScreen() {
  const { focusMode, toggleFocusMode, setFocusDailyGoal } = useSession();
  
  // Check if focus mode is enabled
  if (focusMode.enabled) {
    console.log('Focus Mode is active');
    console.log('Blocked apps:', focusMode.blockedApps);
  }
  
  // Update focus mode
  toggleFocusMode(true);
  setFocusDailyGoal(90);
}
```

## Technical Details

### App Blocking Integration
- When focus mode is enabled and the user has selected apps to block:
  1. The app checks if Accessibility Service is enabled
  2. If not, it prompts the user to enable it
  3. Once enabled, the Accessibility module receives the list of blocked apps
  4. These apps are prevented from launching while focus mode is active

### Persistence
- Focus mode state is automatically saved to AsyncStorage
- State is restored when the app launches
- Goals reset on app launch but can be manually adjusted anytime

### State Management
- Focus mode is part of the global SessionContext
- It's accessible from any screen using the `useSession()` hook
- State updates trigger automatic persistence to AsyncStorage

## Integration Points

### With Sessions
The focus mode state can be accessed when starting/stopping sessions:
```typescript
const { session, focusMode } = useSession();

// When a session starts, you could apply focus mode automatically
if (focusMode.enabled) {
  // Block apps from the session start
}
```

### With Notifications
You can add notifications when:
- User enables/disables focus mode
- Focus mode blocks an app launch
- Daily/weekly goals are reached

## Next Steps (Optional Enhancements)

1. **Schedule Integration**: Apply focus mode on specific time schedules
2. **Session Auto-Enable**: Automatically enable focus mode when starting a session
3. **Goal Tracking**: Track actual focus time against goals and show progress
4. **Notifications**: Alert users when distracting apps are blocked
5. **Exemptions**: Allow certain apps to bypass blocking (e.g., phone, emergency)

## Testing

To test focus mode functionality:
1. Navigate to Settings screen
2. Toggle "Enable Focus Mode" on/off
3. Select apps to block
4. Adjust daily/weekly goals
5. On Android, you should see apps being blocked when focus mode is active

All changes have been implemented without errors. The UI is fully functional and integrated with your existing app structure.
