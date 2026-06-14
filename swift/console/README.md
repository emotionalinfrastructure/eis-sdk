# EmotionalOS Console — Swift Prototype

Swift console implementation of the EmotionalOS emotional analytics kernel.
This is the reference prototype that drives the logic later used in the iOS app.

## Modules

| File | Purpose |
|---|---|
| `SignalProcessor.swift` | Generates and averages biosignal samples |
| `ToneManager.swift` | Maps average signal to a human-readable tone |
| `Analytics.swift` | Coherence (signal stability) and trend direction |
| `Vault.swift` | In-memory append-only entry store |
| `SessionLog.swift` | Codable session records with summary output |
| `Report.swift` | Formatted console session summary |
| `SessionExporterJSON.swift` | ISO-8601 JSON export to temp directory |
| `main.swift` | Entry point — runs a full session pipeline |

## Requirements

- Swift 5.9+
- macOS 13+ (or Linux with Swift Foundation)

## Build & Run

```bash
cd swift/console
swift run
```

## Test

```bash
swift test
```
