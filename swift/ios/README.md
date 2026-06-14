# EmotionalOS iOS — SwiftUI App

SwiftUI implementation of EmotionalOS for iPhone and iPad. The analysis engine
(`SignalProcessor`, `ToneManager`, `Analytics`) is ported from the test-covered
[console prototype](../console) so both share identical behavior.

## Architecture

```
project.yml                  — XcodeGen spec (source of truth for the Xcode project)
Sources/EmotionalOS/
  EmotionalOSApp.swift       — @main App entry point
  ContentView.swift          — Root TabView shell
  SignalProcessor.swift      — Signal generation + averaging
  ToneManager.swift          — Average → emotional tone mapping
  Analytics.swift            — Coherence (stability) + trend direction
  SessionRecord.swift        — Codable per-session record
  SessionViewModel.swift     — ObservableObject driving the pipeline + state
  WaveformView.swift         — Session screen: waveform + Run Session
  HistoryView.swift          — Chronological session list
  AnalyticsView.swift        — Latest readouts + aggregates
  VaultView.swift            — Append-only sealed session records
  SettingsView.swift         — Sample count + privacy posture
SupportingFiles/
  PrivacyInfo.xcprivacy      — Apple privacy manifest (no tracking, no collection)
Assets/
  Transparency.pdf           — Ethical compliance transparency document
Tests/EmotionalOSTests/
  EmotionalOSTests.swift      — XCTest: engine + view-model unit tests
fastlane/
  Fastfile                   — CI/CD lanes: verify_merkle, testflight
```

The Xcode project is **not committed** — it is generated from `project.yml` by
[XcodeGen](https://github.com/yonsm/XcodeGen), keeping the spec as the single
source of truth.

## Requirements

- Xcode 15+
- iOS 17+
- Swift 5.9+
- [XcodeGen](https://github.com/yonsm/XcodeGen) (`brew install xcodegen`)

## Build, run, test

```bash
cd swift/ios
xcodegen generate          # produces EmotionalOS.xcodeproj
open EmotionalOS.xcodeproj # run in Xcode, or:
xcodebuild test -scheme EmotionalOS \
  -destination 'platform=iOS Simulator,name=iPhone 15' CODE_SIGNING_ALLOWED=NO
```

## CI/CD

`.github/workflows/ios.yml` (macOS runner) lints the privacy manifest, installs
XcodeGen, generates the project, and runs `xcodebuild test` on the iOS Simulator.
Fastlane lanes (`fastlane/Fastfile`) provide `verify_merkle` (test) and
`testflight` (build + upload) for release automation.

## Privacy

`PrivacyInfo.xcprivacy` declares zero collected data types and
`NSPrivacyTracking = false`, and is bundled as an app resource so Xcode ships it
in the privacy report.
