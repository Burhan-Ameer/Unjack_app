package com.unjack

import android.accessibilityservice.AccessibilityServiceInfo
import android.content.Context
import android.content.Intent
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.provider.Settings
import android.view.accessibility.AccessibilityManager
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap

class AccessibilityModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "AccessibilityModule"

    @ReactMethod
    fun isAccessibilityEnabled(promise: Promise) {
        try {
            val am = reactApplicationContext.getSystemService(Context.ACCESSIBILITY_SERVICE) as AccessibilityManager
            val enabledServices = am.getEnabledAccessibilityServiceList(AccessibilityServiceInfo.FEEDBACK_GENERIC)
            
            val isEnabled = enabledServices.any { 
                it.resolveInfo.serviceInfo.packageName == reactApplicationContext.packageName &&
                it.resolveInfo.serviceInfo.name == BlockerAccessibilityService::class.java.name
            }
            promise.resolve(isEnabled)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun openAccessibilitySettings(promise: Promise) {
        try {
            val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            reactApplicationContext.startActivity(intent)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun setBlockedApps(apps: ReadableArray, promise: Promise) {
        try {
            BlockerAccessibilityService.blockedApps.clear()
            for (i in 0 until apps.size()) {
                apps.getString(i)?.let {
                    BlockerAccessibilityService.blockedApps.add(it)
                }
            }
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun getBlockedApps(promise: Promise) {
        try {
            val apps = BlockerAccessibilityService.blockedApps.toList()
            val result = com.facebook.react.bridge.Arguments.createArray()
            apps.forEach { result.pushString(it) }
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun getInstalledApps(promise: Promise) {
        try {
            val pm = reactApplicationContext.packageManager
            val packages = pm.getInstalledApplications(PackageManager.GET_META_DATA)
            val result = Arguments.createArray()
            
            packages.forEach { appInfo ->
                if ((appInfo.flags and ApplicationInfo.FLAG_SYSTEM) == 0) { // Only user apps
                    val app = Arguments.createMap()
                    app.putString("app", appInfo.packageName)
                    app.putString("name", pm.getApplicationLabel(appInfo).toString())
                    app.putString("iconURI", null) // Icon handling would be more complex
                    app.putBoolean("system", false)
                    app.putBoolean("isSystemApp", false)
                    
                    val info = Arguments.createMap()
                    info.putString("CFBundleIdentifier", appInfo.packageName)
                    info.putString("CFBundleDisplayName", pm.getApplicationLabel(appInfo).toString())
                    app.putMap("info", info)
                    
                    result.pushMap(app)
                }
            }
            
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }
}
