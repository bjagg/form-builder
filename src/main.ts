// import polyfill to support older browswers
import '@webcomponents/custom-elements';
// import custom element for external use
import './FormBuilderElement';

export { FormBuilderElement } from './FormBuilderElement';

// Re-export types for external use
export type { FormBuilderConfig, ShowErrorListOptions } from './types/shared';

// * * * * IF INSTANTIATING AS NORMAL REACT COMPONENT * * * *

// import React from 'react';

// const FormBuilder = () => {
//     return (
//         <div id="component-container">
//             <form-builder
//                 oidc-url="some-oidc-url"
//                 fbms-base-url="/some-fbms-url"
//                 fbms-form-fname="Some Form Name"
//                 styles="form {max-width: 500px}"
//             ></form-builder>
//         </div>
//     );
// };

// export default FormBuilder;
