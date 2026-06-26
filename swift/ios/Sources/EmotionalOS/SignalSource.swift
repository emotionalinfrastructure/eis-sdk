import Foundation
import CoreMotion

/// A source of biosignal samples in the canonical range `-1...1`.
protocol SignalSource {
    /// Whether the source is backed by live device sensors (vs. synthetic fallback).
    var isLive: Bool { get }

    /// Returns `count` samples, using the most recent live readings when available
    /// and topping up with synthetic values when live data is insufficient.
    func sample(count: Int) -> [Double]
}

/// CoreMotion-backed signal source.
///
/// Streams gravity-removed device-motion magnitude into a bounded ring buffer and
/// maps it into the `-1...1` signal range (at rest → calm, in motion → energized).
/// When device motion is unavailable — the iOS Simulator, CI, or hardware without a
/// motion sensor — it transparently falls back to the synthetic `SignalProcessor`
/// generator so the analysis pipeline always produces data.
final class MotionSignalSource: SignalSource {
    private let motionManager = CMMotionManager()
    private let fallback: SignalProcessor
    private let capacity: Int
    private let lock = NSLock()
    private var buffer: [Double] = []

    var isLive: Bool { motionManager.isDeviceMotionAvailable }

    init(fallback: SignalProcessor = SignalProcessor(),
         updateInterval: TimeInterval = 0.1,
         capacity: Int = 256) {
        self.fallback = fallback
        self.capacity = max(1, capacity)

        guard motionManager.isDeviceMotionAvailable else { return }
        motionManager.deviceMotionUpdateInterval = updateInterval
        let queue = OperationQueue()
        queue.name = "org.emotionalinfrastructure.MotionSignalSource"
        motionManager.startDeviceMotionUpdates(to: queue) { [weak self] motion, _ in
            guard let self, let motion else { return }
            let a = motion.userAcceleration
            let magnitude = (a.x * a.x + a.y * a.y + a.z * a.z).squareRoot()
            let signal = min(1.0, max(-1.0, magnitude * 2.0 - 1.0))
            self.append(signal)
        }
    }

    deinit {
        motionManager.stopDeviceMotionUpdates()
    }

    private func append(_ value: Double) {
        lock.lock()
        defer { lock.unlock() }
        buffer.append(value)
        if buffer.count > capacity {
            buffer.removeFirst(buffer.count - capacity)
        }
    }

    func sample(count: Int) -> [Double] {
        let n = max(0, count)
        guard n > 0 else { return [] }

        lock.lock()
        let recent = Array(buffer.suffix(n))
        lock.unlock()

        guard recent.count < n else { return recent }
        // Not enough live samples yet: prepend synthetic values to fill the request.
        return fallback.generateSignals(count: n - recent.count) + recent
    }
}
