import React, { useState, useCallback } from 'react';
import {
    CreateInput,
    CreateInputBtn,
    CreateInputResult,
} from '../components/CreateInputTemplate';

const CreateInputContainer = (props) => {
    const { inputopt, btnopt, resultopt } = props;

    const [items, setItems] = useState([]);
    const [value, setValue] = useState('');

    const onChange = useCallback((e) => {
        setValue(e.target.value);
    }, []);

    const onInsert = useCallback(() => {
        setItems(items.concat(value));
        setValue('');
        console.log(items); /* 테스트용 추후제거*/
    }, [items, value]);

    // console.log(Object.keys(inputopt.defineInput).length);

    // ** render **
    return (
        <>
            <>
                {inputopt.hasOwnProperty('defineInput') ? (
                    inputopt.defineInput.map((v, i) => {
                        return (
                            <CreateInput
                                key={i}
                                inputopt={{
                                    ...inputopt,
                                    name: v.name,
                                    placeholder: v.placeholder,
                                    width: v.width,
                                }}
                                value={value}
                                onChange={onChange}
                            />
                        );
                    })
                ) : (
                    <CreateInput
                        inputopt={inputopt}
                        value={value}
                        onChange={onChange}
                    />
                )}

                <CreateInputBtn btnopt={btnopt} onClick={onInsert} />
            </>
            <CreateInputResult resultopt={resultopt} />
        </>
    );
};

export default CreateInputContainer;
