# Migration Notes

## Benefits of Moving to a Fixed, Full-Viewport Canvas with Overlays

1. **Full-Screen Responsiveness**:
   - The canvas now occupies the entire viewport (`100vw x 100vh`), ensuring a consistent and immersive 3D experience across all devices.
   - Resizing and orientation changes are handled seamlessly, maintaining the aspect ratio and avoiding scrollbars.

2. **Decoupled UI and Canvas**:
   - The sidebar and app bar are implemented as overlays (`position: fixed`), ensuring they do not affect the canvas size or layout.
   - This approach avoids the common issue where a sidebar constrains the canvas dimensions in a grid or flex layout.

3. **Mobile-Friendly Design**:
   - On smaller screens, the sidebar transforms into a slide-in drawer, toggled by a button in the app bar.
   - This ensures the UI remains accessible without compromising the canvas's visibility.

4. **Improved Pointer Events Handling**:
   - The overlay containers use `pointer-events: none`, allowing interactions with the 3D scene (e.g., orbit controls).
   - Inner controls within the overlays explicitly enable pointer events (`pointer-events: auto`).

5. **Accessibility Enhancements**:
   - The sidebar includes a focus trap and keyboard navigation, ensuring usability for all users.

6. **Performance Optimization**:
   - By relying on React Three Fiber's internal resize handling, the canvas updates efficiently without manual width/height adjustments.

This migration ensures a modern, responsive, and user-friendly design while maintaining the integrity of the 3D rendering experience.