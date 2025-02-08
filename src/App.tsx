import React from 'react';
import './FormBuilderElement';

interface FormBuilderProps {
    fbmsBaseUrl: string;
}

function App(props: FormBuilderProps) {
    const { fbmsBaseUrl } = props;
    console.log(fbmsBaseUrl);
    return <form-builder fbmsBaseUrl={fbmsBaseUrl}></form-builder>;
}

export default App;
