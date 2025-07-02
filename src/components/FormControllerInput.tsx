// src/components/FormControllerInput.tsx
"use client";

import React from "react";
import { Controller, Control, FieldError } from "react-hook-form";

interface Props {
  label: string;
  name: string;
  control: Control<any>;
  rules?: any;
  error?: FieldError;
  placeholder?: string;
  maxLength?: number;
  mask?: (value: string) => string;
}

export function FormControllerInput({
  label,
  name,
  control,
  rules,
  error,
  placeholder,
  maxLength,
  mask,
}: Props) {
  return (
    <div>
      <label htmlFor={name} className="label-base">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <input
            id={name}
            {...field}
            placeholder={placeholder}
            maxLength={maxLength}
            onChange={(e) => {
              const v = mask ? mask(e.target.value) : e.target.value;
              field.onChange(v);
            }}
            className="input-base"
          />
        )}
      />
      {error && (
        <p className="text-red-600 text-sm mt-1">{error.message}</p>
      )}
    </div>
  );
}
