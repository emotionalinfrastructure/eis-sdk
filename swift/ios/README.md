# EmotionalOS iOS — SwiftUI App

Full SwiftUI implementation of EmotionalOS for iPhone and iPad.

## Architecture

```
Sources/EmotionalOS/
  ContentView.swift        — Root tab view and app shell
  SignalProcessor.swift    — Core NSSI signal engine
  ToneManager.swift        — Tone localization and mapping
  WaveformView.swift       — Waveform visualization + haptic feedback
  VaultView.swift          — Immutable proof-of-sovereignty Vault
  HistoryView.swift        — Multi-day NSSI charting + events overlay
  AnalyticsView.swift      — Insights and analytics dashboard
  SettingsView.swift       — User settings and privacy controls
  Models/
    CoreDataModels.xcdatamodeld  — Core Data schema
SupportingFiles/
  Info.plist               — App bundle configuration
  PrivacyInfo.xcprivacy    — Apple Privacy Nutrition Label (no tracking)
Assets/
  Transparency.pdf         — Ethical compliance transparency document
Tests/EmotionalOSTests/
  EmotionalOSTests.swift   — Unit tests (NSSI, Merkle, haptics, analytics)
fastlane/
  Fastfile                 — CI/CD lanes: verify_merkle, testflight
```

## Requirements

- Xcode 15+
- iOS 17+
- Swift 5.9+

## CI/CD

Automated via Fastlane + GitHub Actions (`.github/workflows/ios.yml`):

- `verify_merkle` lane: runs `xcodebuild test`
- `testflight` lane: builds and uploads to TestFlight

## Privacy

`PrivacyInfo.xcprivacy` declares zero tracked data types and `NSPrivacyTracking: false`,
in full compliance with Apple's privacy manifest requirements.
