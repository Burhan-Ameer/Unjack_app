package com.unjack

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.AccessibilityServiceInfo
import android.content.Intent
import android.view.accessibility.AccessibilityEvent

class BlockerAccessibilityService : AccessibilityService() {

    companion object {
        var blockedApps: MutableSet<String> = mutableSetOf()
        var isServiceRunning = false
        var instance: BlockerAccessibilityService? = null
    }

    override fun onServiceConnected() {
        super.onServiceConnected()
        isServiceRunning = true
        instance = this

        val info = AccessibilityServiceInfo().apply {
            eventTypes = AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED
            feedbackType = AccessibilityServiceInfo.FEEDBACK_GENERIC
            flags = AccessibilityServiceInfo.FLAG_INCLUDE_NOT_IMPORTANT_VIEWS
            notificationTimeout = 100
        }
        serviceInfo = info
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event?.eventType == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) {
            val packageName = event.packageName?.toString() ?: return
            
            // Don't block our own app or the blocker overlay
            if (packageName == "com.unjack") return
            
            if (blockedApps.contains(packageName)) {
                launchBlockerOverlay(packageName)
            }
        }
    }

    override fun onInterrupt() {
        // Required override
    }

    override fun onDestroy() {
        super.onDestroy()
        isServiceRunning = false
        instance = null
    }

    private fun launchBlockerOverlay(blockedPackage: String) {
        val intent = packageManager.getLaunchIntentForPackage("com.unjack")?.apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
            putExtra("blocked_package", blockedPackage)
            putExtra("show_blocker", true)
        }
        intent?.let { startActivity(it) }
    }
}
