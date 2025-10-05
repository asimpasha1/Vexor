// Performance monitoring utility
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number> = new Map()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  startTiming(key: string): void {
    this.metrics.set(key, performance.now())
  }

  endTiming(key: string): number {
    const startTime = this.metrics.get(key)
    if (!startTime) {
      console.warn(`No start time found for key: ${key}`)
      return 0
    }

    const duration = performance.now() - startTime
    this.metrics.delete(key)

    // Log slow operations (over 3 seconds)
    if (duration > 3000) {
      console.warn(`Slow operation detected: ${key} took ${duration.toFixed(2)}ms`)
    }

    return duration
  }

  // Monitor API call performance
  static async monitorApiCall<T>(
    key: string,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const monitor = PerformanceMonitor.getInstance()
    
    monitor.startTiming(key)
    try {
      const result = await apiCall()
      const duration = monitor.endTiming(key)
      
      // Log performance metrics
      if (duration > 5000) {
        console.warn(`API call ${key} took ${duration.toFixed(2)}ms - consider optimization`)
      }
      
      return result
    } catch (error) {
      monitor.endTiming(key)
      throw error
    }
  }
}

// Quick performance helper
export const measurePerformance = (key: string) => {
  const monitor = PerformanceMonitor.getInstance()
  
  return {
    start: () => monitor.startTiming(key),
    end: () => monitor.endTiming(key)
  }
}