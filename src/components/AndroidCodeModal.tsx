import React, { useState } from 'react';
import { X, Copy, Check, Terminal, FileCode, CheckCircle2 } from 'lucide-react';

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
    package="ai.manobah.mobile">

    <!-- Android Health Connect permissions -->
    <uses-permission android:name="android.permission.health.READ_HEART_RATE"/>
    <uses-permission android:name="android.permission.health.READ_RESTING_HEART_RATE"/>
    <uses-permission android:name="android.permission.health.READ_HEART_RATE_VARIABILITY"/>
    <uses-permission android:name="android.permission.health.READ_SLEEP"/>
    <uses-permission android:name="android.permission.health.READ_STEPS"/>
    <uses-permission android:name="android.permission.health.READ_TOTAL_CALORIES_BURNED"/>

    <application
        android:name=".ManobahApp"
        android:allowBackup="false"
        android:icon="@mipmap/ic_launcher"
        android:label="Manobah Mobile"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.ManobahMobile">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:screenOrientation="portrait"
            android:theme="@style/Theme.ManobahMobile">
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
    namespace = "ai.manobah.mobile"
    compileSdk = 35

    defaultConfig {
        applicationId = "ai.manobah.mobile"
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
    path: 'app/src/main/java/ai/manobah/mobile/health/HealthConnectManager.kt',
    lang: 'kotlin',
    content: `package ai.manobah.mobile.health

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
    path: 'app/src/main/java/ai/manobah/mobile/ui/theme/Theme.kt',
    lang: 'kotlin',
    content: `package ai.manobah.mobile.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// Manobah-AI Visual Identity: Deep Forest Green + Mint + Soft Cream
val ForestBackground = Color(0xFF06110C)
val ForestCard = Color(0xFF0D2017)
val ForestBorder = Color(0xFF18382A)
val MintAccent = Color(0xFF2FE4A6)
val MintAccentHover = Color(0xFF4EF2BB)
val SageMuted = Color(0xFF8EA898)
val CreamText = Color(0xFFF4F7F4)
val ErrorCommission = Color(0xFFF28B82)

private val ManobahColorScheme = darkColorScheme(
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
fun ManobahMobileTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = ManobahColorScheme,
        typography = ManobahTypography,
        content = content
    )
}`,
  },
  {
    name: 'GoNoGoGame.kt',
    path: 'app/src/main/java/ai/manobah/mobile/games/GoNoGoGame.kt',
    lang: 'kotlin',
    content: `package ai.manobah.mobile.games

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div
        id="android-code-modal"
        className="w-full max-w-2xl rounded-3xl bg-[#07150E] border border-[#173F2D] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-[#F4F7F4]"
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#143324] bg-[#0A1C13]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#102C1E] border border-[#1F543A] flex items-center justify-center text-[#2FE4A6]">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-[#F4F7F4]">Native Android Jetpack Compose</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#173A29] text-[10px] text-[#2FE4A6] font-mono">
                  Kotlin
                </span>
              </div>
              <p className="text-[11px] text-[#8EA898]">Clean Architecture • Health Connect • Local Signals</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#8EA898] hover:text-[#F4F7F4] hover:bg-[#142F22] transition-colors"
            aria-label="Close code dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* File Tabs */}
        <div className="flex items-center gap-1 px-4 py-2 bg-[#05110B] border-b border-[#132E20] overflow-x-auto text-xs">
          {ANDROID_FILES.map((file, idx) => (
            <button
              key={file.name}
              onClick={() => setSelectedFileIdx(idx)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap font-mono transition-colors ${
                selectedFileIdx === idx
                  ? 'bg-[#122F20] text-[#2FE4A6] border border-[#1F5339]'
                  : 'text-[#8EA898] hover:text-[#D7E8DC] hover:bg-[#0A1D13]'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>{file.name}</span>
            </button>
          ))}
        </div>

        {/* Code Content Container */}
        <div className="relative flex-1 p-4 overflow-y-auto bg-[#040C08] font-mono text-xs text-[#D8E6DC] leading-relaxed">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#122B1E] text-[11px] text-[#7A9985]">
            <span>{currentFile.path}</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0F281B] hover:bg-[#153826] border border-[#1A432F] text-xs text-[#2FE4A6] transition-colors"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>

          <pre className="overflow-x-auto whitespace-pre font-mono text-[11.5px] p-2 bg-[#07130D] rounded-xl border border-[#112A1D]">
            <code>{currentFile.content}</code>
          </pre>
        </div>

        {/* Footer with CLI instructions */}
        <div className="px-5 py-3 bg-[#081810] border-t border-[#133022] flex items-center justify-between text-xs text-[#8EA898]">
          <span className="truncate max-w-sm text-[11px]">
            To build in Android Studio or CLI: <code className="text-[#2FE4A6]">./gradlew assembleDebug</code>
          </span>
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-xl bg-[#2FE4A6] text-[#06110C] font-semibold text-xs hover:bg-[#4EF2BB] transition-colors"
          >
            Copy File
          </button>
        </div>
      </div>
    </div>
  );
};
