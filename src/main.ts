// import polyfill to support older browswers
import '@webcomponents/custom-elements';
import 'regenerator-runtime/runtime.js';
// import custom element for external use
import './FormBuilderElement';

export { FormBuilderElement } from './FormBuilderElement';

// Re-export types for external use
export type { FormBuilderConfig, ShowErrorListOptions } from './types/shared';
