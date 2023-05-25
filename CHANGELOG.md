# Change Log

## 0.1.3 - 2023-05-24

### Changed
- [Chart] refactoring of drawLine()
- [Chart] props renamed: options &#8594; config
- [Chart.types] renamed 
    1. ChartConfig &#8594; ChartParameters
    2. ChartOptions &#8594; ChartConfig
- [Chart] defaultConfig moved into separate file
- [Chart] updated story

### Removed
- [Chart] constants canvasXStart, canvasXEnd, canvasYStart, canvasYEnd

- [Chart.types] removed prop "line" from ChartConfig

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