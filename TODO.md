# TODO: Fixes for OurStory.jsx

## Step 1: Add Audio Play/Pause Button
- [x] Add `audioPlaying` state variable
- [x] Add floating play/pause button UI (appears when revealed)
- [x] Wire button to audioRef to toggle play/pause

## Step 2: Add useNarrow Hook for Responsive Inline Styles
- [x] Add `useNarrow()` custom hook (matches max-width: 420px)
- [x] Use `narrow` boolean to conditionally adjust inline styles

## Step 3: Fix Overlapping & Content Overflow on iPhone 16
- [x] Reduce cover photo slot size on narrow screens (12rem → 7rem)
- [x] Reduce page padding on narrow (2.25rem → 1.1rem)
- [x] Reduce body text font-size via media queries
- [x] Reduce cover title font-size via media queries
- [x] Reduce page title font-size via media queries
- [x] Reduce prev trip items on narrow (6.5rem → 4rem)
- [x] Gallery grid goes single column on narrow
- [x] Reduce cover body font-size via media queries
- [x] Fix ticket stub width on narrow (3.6rem)
- [x] Reduce hero emoji tag size on narrow
- [x] Reduce nameplate size on narrow
- [x] Add CSS class names for media query targeting
- [x] Adjust nav button positioning on narrow
- [x] Adjust gold corner size on narrow
- [x] Ensure all content fits without overflow

## Step 4: Test
- [x] Build passes without errors
- [x] Dev server running at http://localhost:5173/

