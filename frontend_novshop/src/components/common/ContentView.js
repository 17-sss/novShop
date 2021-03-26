import React from 'react';
import 'quill/dist/quill.core.css';

// with Quill 
const ContentView = (props) => {
    const { content, style } = props;
    return (
        <div
            className={'ql-editor'}
            dangerouslySetInnerHTML={{
                __html: content,
            }}
            style={style && style}
        />
    );
};

export default ContentView;
