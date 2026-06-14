// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "EmotionalOSConsole",
    platforms: [.macOS(.v13)],
    targets: [
        .executableTarget(
            name: "EmotionalOSConsole",
            path: "Sources/EmotionalOSConsole"
        ),
        .testTarget(
            name: "EmotionalOSConsoleTests",
            dependencies: ["EmotionalOSConsole"],
            path: "Tests"
        ),
    ]
)
