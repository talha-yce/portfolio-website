import { useEffect, useCallback } from 'react'

interface UseAdminRefreshProps {
  onRefresh: () => void
  dependencies?: any[]
}

export function useAdminRefresh({ onRefresh, dependencies = [] }: UseAdminRefreshProps) {
  const handleRefresh = useCallback(() => {
    console.log('[useAdminRefresh] Triggering refresh...')
    onRefresh()
  }, [onRefresh])

  useEffect(() => {
    // Listen for window focus (when user returns from another tab/window)
    const handleFocus = () => {
      console.log('[useAdminRefresh] Window focused, refreshing...')
      handleRefresh()
    }

    // Listen for visibility change (when page becomes visible)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('[useAdminRefresh] Page visible, refreshing...')
        handleRefresh()
      }
    }

    // Listen for storage events (if multiple admin tabs are open)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'admin-data-changed') {
        console.log('[useAdminRefresh] Data changed in another tab, refreshing...')
        handleRefresh()
      }
    }

    // Add event listeners
    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('storage', handleStorageChange)

    // Cleanup
    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [handleRefresh])

  // Trigger refresh when dependencies change
  useEffect(() => {
    if (dependencies.length > 0) {
      handleRefresh()
    }
  }, dependencies)

  return { triggerRefresh: handleRefresh }
}

// Helper function to signal data changes across tabs
export function signalAdminDataChange() {
  localStorage.setItem('admin-data-changed', Date.now().toString())
  localStorage.removeItem('admin-data-changed')
} 