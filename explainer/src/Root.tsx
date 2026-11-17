import { Composition } from 'remotion'
import { Explainer } from './Explainer'
import { DURATION, FPS, HEIGHT, WIDTH } from './script'

export function Root() {
  return <Composition id="Explainer" component={Explainer} durationInFrames={DURATION * FPS} fps={FPS} width={WIDTH} height={HEIGHT} />
}
