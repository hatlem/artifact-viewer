# @getplatform/artifact-viewer

Themeable public renderer for GetPlatform artifacts (presentation / offer / agreement).
Consumed by platform domains (Tenderen et al.) as a private git dependency.

```tsx
import { ArtifactViewer } from '@getplatform/artifact-viewer'
<ArtifactViewer payload={payload} theme={theme} onRespond={onRespond} />
```

`dist/` is built on install via the `prepare` script (git-dependency consumers build it automatically).
