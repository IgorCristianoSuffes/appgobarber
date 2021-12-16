import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { TextInputProps } from "react-native";
import { Container, TextInput, Icon } from "./styles";
import { useField } from '@unform/core';

interface InputProps extends TextInputProps {
    name: string;
    icon: string;
}

interface InputValueReference {
    value: string;
}

interface InputRef {
    focus(): void;
}

const Input: React.ForwardRefRenderFunction<InputRef, InputProps> = ({ name, icon, ...rest }, ref) => {
    const inputElementRef = useRef<any>(null);

    const { registerField, defaultValue = '', fieldName, error } = useField(name);
    const inputValueRed = useRef<InputValueReference>({ value: defaultValue });

    useImperativeHandle(ref, () => ({
        focus() {
            inputElementRef.current.focus();
        }
    }));

    useEffect(()=> {
        registerField<string>({
            name: fieldName,
            ref: inputValueRed.current,
            path: 'value',
            setValue(ref: any, value) {
                inputValueRed.current.value = value;
                inputElementRef.current.setNativeProps({ text: value });
            },
            clearValue() {
                inputValueRed.current.value = '';
                inputElementRef.current.clear();
            }
        })
    }, [fieldName, registerField]);

    return (
        <Container>
            <Icon name={icon} size={20} color="#666360" />
            <TextInput
                ref={inputElementRef}
                keyboardAppearance="dark"
                placeholderTextColor="#666360"
                defaultValue={defaultValue}
                onChangeText={(value) => {
                    inputValueRed.current.value = value;
                }}
                {...rest}
            />
        </Container>
    );
};

export default forwardRef(Input);