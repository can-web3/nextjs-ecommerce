// src/components/FormInput.tsx
"use client";

import React from "react";
import { FieldError, UseFormRegister } from "react-hook-form";

interface Props {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  rules?: any;
  error?: FieldError;
  type?: string;
  textarea?: boolean;
}

export function FormInput({
  label,
  name,
  register,
  rules,
  error,
  type = "text",
  textarea = false,
}: Props) {
  const Tag = textarea ? "textarea" : "input";
  return (
    <div>
      <label htmlFor={name} className="label-base">
        {label}
      </label>
      <Tag
        id={name}
        {...register(name, rules)}
        rows={textarea ? 3 : undefined}
        type={textarea ? undefined : type}
        className="input-base"
      />
      {error && (
        <p className="text-red-600 text-sm mt-1">{error.message}</p>
      )}
    </div>
  );
}
