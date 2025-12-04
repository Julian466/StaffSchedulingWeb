import * as React from "react"

/** Breakpoint for mobile devices in pixels */
const MOBILE_BREAKPOINT = 768

/**
 * Hook to detect if the current viewport is mobile-sized.
 * 
 * This hook listens to window resize events and updates the mobile state
 * when the viewport width crosses the mobile breakpoint (768px).
 * 
 * The hook returns undefined initially (during SSR), then updates to
 * a boolean value once mounted on the client.
 * 
 * @returns Boolean indicating if viewport is mobile-sized (< 768px)
 * 
 * @example
 * function ResponsiveComponent() {
 *   const isMobile = useIsMobile();
 *   
 *   return (
 *     <div>
 *       {isMobile ? (
 *         <MobileView />
 *       ) : (
 *         <DesktopView />
 *       )}
 *     </div>
 *   );
 * }
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Create a media query listener
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    // Listen for viewport changes
    mql.addEventListener("change", onChange)
    // Set initial value
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    // Cleanup listener on unmount
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
