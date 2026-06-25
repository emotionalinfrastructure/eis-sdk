import SwiftUI

/// Primary session screen: renders the latest signal waveform and runs sessions.
struct WaveformView: View {
    @EnvironmentObject private var model: SessionViewModel

    var body: some View {
        NavigationStack {
            VStack(spacing: 24) {
                WaveformShape(samples: model.signals)
                    .stroke(Color.accentColor, lineWidth: 2)
                    .frame(height: 160)
                    .frame(maxWidth: .infinity)
                    .background(Color(uiColor: .secondarySystemBackground))
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                    .padding(.horizontal)

                VStack(spacing: 8) {
                    Text(model.tone)
                        .font(.title2).bold()
                    Text("Average \(model.average, format: .number.precision(.fractionLength(2)))")
                    Text("Coherence \(model.coherence, format: .number.precision(.fractionLength(2)))")
                    Text("Trend: \(model.trend)")
                        .foregroundStyle(.secondary)
                }

                Button {
                    model.runSession()
                } label: {
                    Label("Run Session", systemImage: "play.fill")
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.borderedProminent)
                .padding(.horizontal)

                Spacer()
            }
            .padding(.vertical)
            .navigationTitle("EmotionalOS")
        }
    }
}

/// Draws a polyline through the sample values, centered on the vertical midline.
private struct WaveformShape: Shape {
    let samples: [Double]

    func path(in rect: CGRect) -> Path {
        var path = Path()
        guard samples.count > 1 else {
            path.move(to: CGPoint(x: rect.minX, y: rect.midY))
            path.addLine(to: CGPoint(x: rect.maxX, y: rect.midY))
            return path
        }
        let stepX = rect.width / CGFloat(samples.count - 1)
        for (index, value) in samples.enumerated() {
            let x = rect.minX + CGFloat(index) * stepX
            let y = rect.midY - CGFloat(value) * (rect.height / 2)
            let point = CGPoint(x: x, y: y)
            if index == 0 {
                path.move(to: point)
            } else {
                path.addLine(to: point)
            }
        }
        return path
    }
}
