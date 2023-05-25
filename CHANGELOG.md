# Change Log

## 0.1.7 - 2023-05-26

### Added
- [Chart] xRatio
- [Chart.utils] dynamic squeezing and stretching of chart by x axis

### Changed
- [Chart] now you shouldn't move mouse over chart for its update if lines was changed

## 0.1.6 - 2023-05-25
- package.json

### Fixed
- build

## 0.1.5 - 2023-05-25

### Changed
- [Chart] renamed initAxis &#8594; drawAxis and moved into Chart.utils
- [Chart] drawLine() moved into Chart.utils
- [Chart.types] some refactoring

### Removed
- [Chart] unnecessary div from component layout

## 0.1.4 - 2023-05-25

### Added
- [Chart.types] interface PointerParameter
- [Chart.utils] separate comments for more lightly understanding

### Changed
- [Chart] renamed initCanvas &#8594; setupCanvasDimensions and moved into Chart.utils
- [Chart] drawPointer() moved into Chart.utils
- [Chart] getCanvasX(), getCanvasY() moved into Chart.utils
- [Chart.types] new field in ChartParameters - yRatio

- [utils] renamed drawPath &#8594; canvasPath

### Removed
- [Chart] drawChart()

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