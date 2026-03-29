import { NativeModules, Platform } from 'react-native';

const { AccessibilityModule } = NativeModules;

/**
 * Accessibility Native Module
 * Manages the AccessibilityService for real-time app switch detection
 */
const Accessibility = {
  /**
   * Check if the accessibility service is enabled
   * @returns {Promise<boolean>} True if accessibility service is enabled
   */
  isAccessibilityEnabled: async () => {
    if (Platform.OS !== 'android') {
      console.warn('AccessibilityModule is only available on Android');
      return false;
    }
    return AccessibilityModule.isAccessibilityEnabled();
  },

  /**
   * Open the Accessibility settings screen for the user to enable the service
   * @returns {Promise<boolean>} True if settings screen was opened successfully
   */
  openAccessibilitySettings: async () => {
    if (Platform.OS !== 'android') {
      console.warn('AccessibilityModule is only available on Android');
      return false;
    }
    return AccessibilityModule.openAccessibilitySettings();
  },

  /**
   * Set the list of blocked app package names
   * When any of these apps come to foreground, the blocker overlay will be shown
   * @param {string[]} apps - Array of package names to block (e.g., ['com.instagram.android', 'com.twitter.android'])
   * @returns {Promise<boolean>} True if blocked apps were set successfully
   */
  setBlockedApps: async apps => {
    if (Platform.OS !== 'android') {
      console.warn('AccessibilityModule is only available on Android');
      return false;
    }
    if (!Array.isArray(apps)) {
      throw new Error('apps must be an array of package names');
    }
    return AccessibilityModule.setBlockedApps(apps);
  },

  /**
   * Get the current list of blocked app package names
   * @returns {Promise<string[]>} Array of blocked package names
   */
  getBlockedApps: async () => {
    if (Platform.OS !== 'android') {
      console.warn('AccessibilityModule is only available on Android');
      return [];
    }
    return AccessibilityModule.getBlockedApps();
  },

  /**
   * Get the list of installed user apps
   * @returns {Promise<Array>} Array of app objects with package name, name, etc.
   */
  getInstalledApps: async () => {
    if (Platform.OS !== 'android') {
      console.warn('AccessibilityModule is only available on Android');
      return [];
    }
    return AccessibilityModule.getInstalledApps();
  },
};

export default Accessibility;
