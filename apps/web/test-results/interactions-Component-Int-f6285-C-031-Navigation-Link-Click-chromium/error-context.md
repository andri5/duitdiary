# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]: "[plugin:vite:oxc] Unexpected token"
  - generic [ref=e5]: D:/duitdiary/apps/web/src/components/ui/Card.tsx:111:7
  - generic [ref=e6]: "117 | 118 | // Card Header 119 | export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {} | ^ 120 | 121 | export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>("
  - generic [ref=e7]: at transformWithOxc (file:///D:/duitdiary/apps/web/node_modules/vite/dist/node/chunks/node.js:5148:19) at async TransformPluginContext.transform (file:///D:/duitdiary/apps/web/node_modules/vite/dist/node/chunks/node.js:5227:20) at async EnvironmentPluginContainer.transform (file:///D:/duitdiary/apps/web/node_modules/vite/dist/node/chunks/node.js:30468:14) at async loadAndTransform (file:///D:/duitdiary/apps/web/node_modules/vite/dist/node/chunks/node.js:21586:26) at async viteTransformMiddleware (file:///D:/duitdiary/apps/web/node_modules/vite/dist/node/chunks/node.js:26148:20)
  - generic [ref=e8]:
    - text: Click outside, press Esc key, or fix the code to dismiss.
    - text: You can also disable this overlay by setting
    - code [ref=e9]: server.hmr.overlay
    - text: to
    - code [ref=e10]: "false"
    - text: in
    - code [ref=e11]: vite.config.ts
    - text: .
```