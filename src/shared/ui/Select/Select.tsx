import { Mods, classNames } from 'shared/lib/classNames/classNames';
import React, {
    ChangeEvent,
    SelectHTMLAttributes, memo, useEffect, useMemo, useRef, useState,
} from 'react';
import cls from './Select.module.scss';

type HTMLSelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'| 'readOnly'>

export interface SelectOption {
    value: string;
    content: string;
}

interface SelectProps extends HTMLSelectProps {
    className?: string;
    label?: string;
    options?: SelectOption[];
    value?: string;
    onChange?: (value: string) => void;
    readonly?: boolean
}

export const Select = memo(({
    className, label, options, value, onChange, readonly,
}: SelectProps) => {
    const optionsLists = useMemo(() => options?.map((list) => (
        <option
            className={cls.option}
            value={list.value}
            key={list.value}
        >
            {list.content}
        </option>
    )), [options]);

    const onChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
        onChange?.(e.target.value);
    };

    const mods: Mods = {

    };

    return (
        <div className={classNames(cls.SelectWrapper, mods, [className])}>
            {label && <span className={cls.label}>{`${label}>`}</span>}
            <select
                disabled={readonly}
                className={cls.select}
                value={value}
                onChange={onChangeHandler}
            >
                {optionsLists}
            </select>
        </div>
    );
});
