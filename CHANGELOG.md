# Change Log

## 0.1.2 - 2023-05-23

### BREAKING CHANGES
- [Chart] Removed slider

### Added
- [Chart] canvasEndPoints, chartConfig

### Changed
- [Chart] drawPath() moved into utils
- [Chart] getCanvasAndContext() moved into Chart.utils
- [Chart] drawYSteps(), drawXSteps() moved into Chart.utils
- [Chart] isOver() moved into Chart.utils

## 0.1.1 - 2023-05-13

### Added
- [Chart] Chart component
- [Chart] Rendering of few lines
- [Chart] getCanvasContext()
- [Chart] drawPath()
- [Chart] proxy for mouse
- [Chart] x indicator and pointer
- [Chart] getCanvasContext
- [Chart] getMaxCoordValueByAxis
- [Chart] story for component
- Mock for CoordsOfChart
- Rollup
- Storybook
- SASS

### Changed
- [Chart] Algorithm of x steps rendering
- [Chart] Moved into specific directory
- updated prettier settings
- mock renamed
- rollup config
- ES target version

### Fixed
- [Chart] Chart and axis rendering

### Removed
- [App] input for debugging