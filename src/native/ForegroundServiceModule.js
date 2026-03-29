import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const { ForegroundServiceModule } = NativeModules;

const eventEmitter =
  Platform.OS === 'android'
    ? new NativeEventEmitter(ForegroundServiceModule)
    : null;

/**
 * ForegroundService Native Module
 * Manages a persistent foreground service that monitors app usage in the background
 */
const ForegroundService = {
  /**
   * Start the foreground service
   * Shows a persistent notification and begins polling for foreground app changes
   * @returns {Promise<boolean>} True if service started successfully
   */
  startService: async () => {
    if (Platform.OS !== 'android') {
      console.warn('ForegroundService is only available on Android');
      return false;
    }
    return ForegroundServiceModule.startService();
  },

  /**
   * Stop the foreground service
   * @returns {Promise<boolean>} True if service stopped successfully
   */
  stopService: async () => {
    if (Platform.OS !== 'android') {
      console.warn('ForegroundService is only available on Android');
      return false;
    }
    return ForegroundServiceModule.stopService();
  },

  /**
   * Check if the foreground service is currently running
   * @returns {Promise<boolean>} True if service is running
   */
  isServiceRunning: async () => {
    if (Platform.OS !== 'android') {
      console.warn('ForegroundService is only available on Android');
      return false;
    }
    return ForegroundServiceModule.isServiceRunning();
  },

  /**
   * Subscribe to foreground app change events
   * The service polls every 1 second and emits the current foreground app package name
   * @param {function} callback - Called with { packageName: string } when foreground app changes
   * @returns {object} Subscription object - call .remove() to unsubscribe
   */
  addForegroundAppListener: callback => {
    if (Platform.OS !== 'android' || !eventEmitter) {
      console.warn('ForegroundService is only available on Android');
      return { remove: () => {} };
    }
    return eventEmitter.addListener('onForegroundAppChanged', callback);
  },

  /**
   * Remove all foreground app listeners
   */
  removeAllListeners: () => {
    if (eventEmitter) {
      eventEmitter.removeAllListeners('onForegroundAppChanged');
    }
  },
};

export default ForegroundService;
