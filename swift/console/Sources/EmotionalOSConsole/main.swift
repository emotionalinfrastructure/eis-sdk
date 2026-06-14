import Foundation

let processor = SignalProcessor()
let toneManager = ToneManager()
let vault = Vault()
let analytics = Analytics()
let report = Report()
let log = SessionLog()
let jsonExporter = SessionExporterJSON()

let signals = processor.generateSignals(count: 10)
let avg = processor.average(of: signals)
let tone = toneManager.interpretTone(from: avg)
let coherence = analytics.coherence(of: signals)
let trend = analytics.trend(of: signals)

report.printSessionSummary(signals: signals, avg: avg, tone: tone, coherence: coherence, trend: trend)
log.recordSession(tone: tone, avg: avg, coherence: coherence, trend: trend)
log.summary()
jsonExporter.exportJSON(log.sessions)
