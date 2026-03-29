package com.unjack

import android.app.AppOpsManager
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Process
import android.provider.Settings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class UsageStatsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "UsageStatsModule"

    @ReactMethod
    fun hasUsagePermission(promise: Promise) {
        try {
            promise.resolve(checkUsageStatsPermission())
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun openUsageSettings(promise: Promise) {
        try {
            val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS)
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            reactApplicationContext.startActivity(intent)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }


    @ReactMethod
    fun getInstalledApps(promise: Promise) {
        try {
            val pm = reactApplicationContext.packageManager
            val apps = pm.getInstalledApplications(PackageManager.GET_META_DATA)

            val result = WritableNativeArray()

            for (app in apps) {
                val isSystemApp = (app.flags and ApplicationInfo.FLAG_SYSTEM) != 0
                if (!isSystemApp) {
                    val map = WritableNativeMap()
                    map.putString("packageName", app.packageName)
                    map.putString("appName", pm.getApplicationLabel(app).toString())
                    map.putBoolean("isSystemApp", false)
                    result.pushMap(map)
                }
            }

            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }





    @ReactMethod
    fun getForegroundApp(promise: Promise) {
        try {
            if (!checkUsageStatsPermission()) {
                promise.reject("PERMISSION_DENIED", "Usage stats permission not granted")
                return
            }
            promise.resolve(getCurrentForegroundApp() ?: "unknown")
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    private fun checkUsageStatsPermission(): Boolean {
        val appOps = reactApplicationContext.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
        val mode = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            appOps.unsafeCheckOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS, Process.myUid(), reactApplicationContext.packageName)
        } else {
            @Suppress("DEPRECATION")
            appOps.checkOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS, Process.myUid(), reactApplicationContext.packageName)
        }   
        return mode == AppOpsManager.MODE_ALLOWED
    }

    fun getCurrentForegroundApp(): String? {
        val usm = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        val now = System.currentTimeMillis()
        val stats = usm.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, now - 1000, now)
        return stats?.maxByOrNull { it.lastTimeUsed }?.packageName
    }
}
