import React, { useState } from 'react';
import { X, Copy, Terminal, FileCode, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';

interface AndroidCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ANDROID_FILES: { name: string; path: string; lang: string; content: string }[] = [
  {
    name: 'AndroidManifest.xml',
    path: 'app/src/main/AndroidManifest.xml',
    lang: 'xml',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="ai.manobal.mobile">

    <!-- Android Health Connect permissions -->
    <uses-permission android:name="android.permission.health.READ_HEART_RATE"/>
    <uses-permission android:name="android.permission.health.READ_RESTING_HEART_RATE"/>
    <uses-permission android:name="android.permission.health.READ_HEART_RATE_VARIABILITY"/>
    <uses-permission android:name="android.permission.health.READ_SLEEP"/>
    <uses-permission android:name="android.permission.health.READ_STEPS"/>
    <uses-permission android:name="android.permission.health.READ_TOTAL_CALORIES_BURNED"/>

    <application
        android:name=".ManobalApp"
        android:allowBackup="false"
        android:icon="@mipmap/ic_launcher"
        android:label="Manobal Mobile"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.ManobalMobile">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:screenOrientation="portrait"
            android:theme="@style/Theme.ManobalMobile">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Health Connect Privacy / Permission Rationale Activity Alias -->
        <activity-alias
            android:name="ViewPermissionUsageActivity"
            android:exported="true"
            android:targetActivity=".MainActivity"
            android:permission="android.permission.START_VIEW_PERMISSION_USAGE">
            <intent-filter>
                <action android:name="android.intent.action.VIEW_PERMISSION_USAGE" />
                <category android:name="android.intent.category.HEALTH_PERMISSIONS" />
            </intent-filter>
        </activity-alias>

    </application>
</manifest>`,
  },
  {
    name: 'app/build.gradle.kts',
    path: 'app/build.gradle.kts',
    lang: 'kotlin',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "ai.manobal.mobile"
    compileSdk = 35

    defaultConfig {
        applicationId = "ai.manobal.mobile"
        minSdk = 28
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0-mvp"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildFeatures {
        compose = true
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    // Jetpack Compose & Material 3
    implementation(platform(libs.androidx.compose.bom))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.navigation:navigation-compose:2.8.5")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.7")

    // Android Health Connect Client
    implementation("androidx.health.connect:connect-client:1.1.0-alpha11")

    // Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.1")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-guava:1.8.1")

    // Local DataStore
    implementation("androidx.datastore:datastore-preferences:1.1.1")
}`,
  },
  {
    name: 'HealthConnectManager.kt',
    path: 'app/src/main/java/ai/manobal/mobile/health/HealthConnectManager.kt',
    lang: 'kotlin',
    content: `package ai.manobal.mobile.health

import android.content.Context
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.*
import androidx.health.connect.client.request.ReadRecordsRequest
import androidx.health.connect.client.time.TimeRangeFilter
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import java.time.Instant
import java.time.temporal.ChronoUnit

class HealthConnectManager(private val context: Context) {

    val healthConnectClient by lazy {
        if (HealthConnectClient.getSdkStatus(context) == HealthConnectClient.SDK_AVAILABLE) {
            HealthConnectClient.getOrCreate(context)
        } else null
    }

    val permissions = setOf(
        HealthPermission.getReadPermission(HeartRateRecord::class),
        HealthPermission.getReadPermission(RestingHeartRateRecord::class),
        HealthPermission.getReadPermission(HeartRateVariabilityRmssdRecord::class),
        HealthPermission.getReadPermission(SleepSessionRecord::class),
        HealthPermission.getReadPermission(StepsRecord::class)
    )

    suspend fun hasAllPermissions(): Boolean {
        val client = healthConnectClient ?: return false
        val granted = client.permissionController.getGrantedPermissions()
        return granted.containsAll(permissions)
    }

    suspend fun readHeartRateSignals(): List<HeartRateRecord> {
        val client = healthConnectClient ?: return emptyList()
        val startTime = Instant.now().minus(24, ChronoUnit.HOURS)
        val response = client.readRecords(
            ReadRecordsRequest(
                recordType = HeartRateRecord::class,
                timeRangeFilter = TimeRangeFilter.after(startTime)
            )
        )
        return response.records
    }

    suspend fun readSleepSessions(): List<SleepSessionRecord> {
        val client = healthConnectClient ?: return emptyList()
        val startTime = Instant.now().minus(48, ChronoUnit.HOURS)
        val response = client.readRecords(
            ReadRecordsRequest(
                recordType = SleepSessionRecord::class,
                timeRangeFilter = TimeRangeFilter.after(startTime)
            )
        )
        return response.records
    }

    suspend fun readTodaySteps(): Long {
        val client = healthConnectClient ?: return 0L
        val startOfDay = Instant.now().truncatedTo(ChronoUnit.DAYS)
        val response = client.readRecords(
            ReadRecordsRequest(
                recordType = StepsRecord::class,
                timeRangeFilter = TimeRangeFilter.after(startOfDay)
            )
        )
        return response.records.sumOf { it.count }
    }
}`,
  },
  {
    name: 'Theme.kt',
    path: 'app/src/main/java/ai/manobal/mobile/ui/theme/Theme.kt',
    lang: 'kotlin',
    content: `package ai.manobal.mobile.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// Manobal-AI Visual Identity: Deep Forest Green + Mint + Soft Cream
val ForestBackground = Color(0xFF06110C)
val ForestCard = Color(0xFF0D2017)
val ForestBorder = Color(0xFF18382A)
val MintAccent = Color(0xFF2FE4A6)
val MintAccentHover = Color(0xFF4EF2BB)
val SageMuted = Color(0xFF8EA898)
val CreamText = Color(0xFFF4F7F4)
val ErrorCommission = Color(0xFFF28B82)

private val ManobalColorScheme = darkColorScheme(
    primary = MintAccent,
    onPrimary = ForestBackground,
    background = ForestBackground,
    onBackground = CreamText,
    surface = ForestCard,
    onSurface = CreamText,
    surfaceVariant = ForestBorder,
    onSurfaceVariant = SageMuted,
    outline = ForestBorder
)

@Composable
fun ManobalMobileTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = ManobalColorScheme,
        typography = ManobalTypography,
        content = content
    )
}`,
  },
  {
    name: 'GoNoGoGame.kt',
    path: 'app/src/main/java/ai/manobal/mobile/games/GoNoGoGame.kt',
    lang: 'kotlin',
    content: `package ai.manobal.mobile.games

import androidx.compose.runtime.*
import kotlinx.coroutines.*
import kotlin.random.Random

enum class StimulusType { GO, NO_GO }

data class GoNoGoResult(
    val meanReactionTimeMs: Double,
    val goAccuracy: Double,
    val noGoAccuracy: Double,
    val commissionErrors: Int, // Pressed on NO_GO
    val omissionErrors: Int,   // Failed to press on GO
    val totalTrials: Int
)

class GoNoGoEngine {
    private val trials = mutableListOf<Trial>()
    
    fun recordResponse(stimulus: StimulusType, reacted: Boolean, reactionTimeMs: Long) {
        trials.add(Trial(stimulus, reacted, reactionTimeMs))
    }

    fun computeResults(): GoNoGoResult {
        val goTrials = trials.filter { it.stimulus == StimulusType.GO }
        val noGoTrials = trials.filter { it.stimulus == StimulusType.NO_GO }

        val correctGo = goTrials.count { it.reacted }
        val omissionErrors = goTrials.count { !it.reacted }
        val commissionErrors = noGoTrials.count { it.reacted }
        val correctNoGo = noGoTrials.count { !it.reacted }

        val validReactionTimes = goTrials.filter { it.reacted }.map { it.reactionTimeMs }
        val meanRt = if (validReactionTimes.isNotEmpty()) validReactionTimes.average() else 0.0

        val goAcc = if (goTrials.isNotEmpty()) (correctGo.toDouble() / goTrials.size) * 100 else 100.0
        val noGoAcc = if (noGoTrials.isNotEmpty()) (correctNoGo.toDouble() / noGoTrials.size) * 100 else 100.0

        return GoNoGoResult(
            meanReactionTimeMs = meanRt,
            goAccuracy = goAcc,
            noGoAccuracy = noGoAcc,
            commissionErrors = commissionErrors,
            omissionErrors = omissionErrors,
            totalTrials = trials.size
        )
    }

    data class Trial(val stimulus: StimulusType, val reacted: Boolean, val reactionTimeMs: Long)
}`,
  },
];

export const AndroidCodeModal: React.FC<AndroidCodeModalProps> = ({ isOpen, onClose }) => {
  const { colors, isDark } = useTheme();
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentFile = ANDROID_FILES[selectedFileIdx];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 backdrop-blur-md animate-fadeIn"
      style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.85)' : 'rgba(15,23,42,0.5)' }}
    >
      <div
        id="android-code-modal"
        className="w-full max-w-2xl rounded-3xl border shadow-2xl flex flex-col max-h-[92vh] overflow-hidden theme-fade-transition"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
          color: colors.primaryText,
        }}
      >
        {/* Modal Top Bar */}
        <div
          className="flex items-center justify-between px-5 py-3.5 border-b"
          style={{
            backgroundColor: colors.surfaceSunken,
            borderColor: colors.borderSubtle,
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl border flex items-center justify-center"
              style={{
                backgroundColor: colors.accentSoft,
                borderColor: colors.accent,
                color: colors.accentText,
              }}
            >
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold" style={{ color: colors.primaryText }}>
                  Native Android Jetpack Compose
                </h3>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-mono border"
                  style={{
                    backgroundColor: colors.accentSoft,
                    borderColor: colors.accent,
                    color: colors.accentText,
                  }}
                >
                  Kotlin
                </span>
              </div>
              <p className="text-[11px]" style={{ color: colors.secondaryText }}>
                Clean Architecture • Health Connect • Local Signals
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full transition-colors"
            style={{ color: colors.secondaryText }}
            aria-label="Close code dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* File Tabs */}
        <div
          className="flex items-center gap-1 px-4 py-2 border-b overflow-x-auto text-xs"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.borderSubtle,
          }}
        >
          {ANDROID_FILES.map((file, idx) => {
            const isSelected = selectedFileIdx === idx;
            return (
              <button
                key={file.name}
                onClick={() => setSelectedFileIdx(idx)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap font-mono transition-colors border"
                style={{
                  backgroundColor: isSelected ? colors.accentSoft : 'transparent',
                  borderColor: isSelected ? colors.accent : 'transparent',
                  color: isSelected ? colors.accentText : colors.secondaryText,
                }}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{file.name}</span>
              </button>
            );
          })}
        </div>

        {/* Code Content Container */}
        <div
          className="relative flex-1 p-4 overflow-y-auto font-mono text-xs leading-relaxed"
          style={{
            backgroundColor: isDark ? '#0B0E11' : '#F1F5F9',
            color: isDark ? '#D8E0E8' : '#0F172A',
          }}
        >
          <div
            className="flex items-center justify-between pb-2 mb-2 border-b text-[11px]"
            style={{ borderColor: colors.borderSubtle, color: colors.secondaryText }}
          >
            <span className="font-mono">{currentFile.path}</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs transition-colors"
              style={{
                backgroundColor: colors.surfaceSunken,
                borderColor: colors.border,
                color: colors.accentText,
              }}
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>

          <pre
            className="overflow-x-auto whitespace-pre font-mono text-[11.5px] p-3 rounded-2xl border"
            style={{
              backgroundColor: isDark ? '#0E1216' : '#FFFFFF',
              borderColor: colors.borderSubtle,
            }}
          >
            <code>{currentFile.content}</code>
          </pre>
        </div>

        {/* Footer with CLI instructions */}
        <div
          className="px-5 py-3 border-t flex items-center justify-between text-xs"
          style={{
            backgroundColor: colors.surfaceSunken,
            borderColor: colors.borderSubtle,
            color: colors.secondaryText,
          }}
        >
          <span className="truncate max-w-sm text-[11px]">
            To build in Android Studio:{' '}
            <code
              className="px-1.5 py-0.5 rounded border"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.accentText,
              }}
            >
              ./gradlew assembleDebug
            </code>
          </span>
          <button
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all shadow-sm active:scale-[0.98]"
            style={{
              backgroundColor: colors.accent,
              color: colors.accentContrast,
            }}
          >
            Copy File
          </button>
        </div>
      </div>
    </div>
  );
};
