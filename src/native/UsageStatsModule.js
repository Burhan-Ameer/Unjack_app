import { NativeModules, Platform } from 'react-native';

const { UsageStatsModule } = NativeModules;

/**
 * UsageStats Native Module
 * Provides access to Android's UsageStatsManager for detecting foreground apps
 */
const UsageStats = {
  /**
   * Check if the app has PACKAGE_USAGE_STATS permission
   * @returns {Promise<boolean>} True if permission is granted
   */
  hasUsagePermission: async () => {
    if (Platform.OS !== 'android') {
      console.warn('UsageStats is only available on Android');
      return false;
    }
    return UsageStatsModule.hasUsagePermission();
  },

  /**
   * Open the Usage Access settings screen for the user to grant permission
   * @returns {Promise<boolean>} True if settings screen was opened successfully
   */
  openUsageSettings: async () => {
    if (Platform.OS !== 'android') {
      console.warn('UsageStats is only available on Android');
      return false;
    }
    return UsageStatsModule.openUsageSettings();
  },

    /**
     * Get a list of installed apps with their package names and app names
     * @returns {Promise<Array<{ packageName: string, appName: string }>>} Array of installed apps
     */
  getInstalledApps: async () => {
    if (Platform.OS !== 'android') {
      console.warn('UsageStats is only available on Android');
      return [];
    }
    return UsageStatsModule.getInstalledApps();
  },

  /**
   * Get the package name of the currently foreground app
   * @returns {Promise<string>} Package name of the foreground app, or "unknown"
   * @throws Will throw if usage permission is not granted
   */
  getForegroundApp: async () => {
    if (Platform.OS !== 'android') {
      console.warn('UsageStats is only available on Android');
      return 'unknown';
    }
    return UsageStatsModule.getForegroundApp();
  },
};

export default UsageStats;
