import SwiftUI

@main
struct EmotionalOSApp: App {
    @StateObject private var model = SessionViewModel()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(model)
        }
    }
}
