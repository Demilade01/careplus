"use client"

import React from 'react'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Control } from 'react-hook-form'
import { FormFieldType } from './form/PatientForm'
import Image from 'next/image'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

interface CustomProps {
  control: Control<any>,
  fieldType: FormFieldType,
  name: string,
  label?: string,
  placeholder?: string,
  iconSrc?: string,
  iconAlt?: string,
  disabled?: boolean,
  dateFormat?: string,
  showTimeSelect?: boolean,
  children?: React.ReactNode,
  renderSkeleton?: (field: any) => React.ReactNode,
}

const RenderField = ({ field, props }: {field: any; props: CustomProps}) => {
  const { fieldType, iconSrc, iconAlt, placeholder, dateFormat, showTimeSelect } = props

  switch (fieldType) {
    case FormFieldType.INPUT:
      return(
        <div className='flex rounded-md border border-dark-400'>
          {iconSrc && (
            <Image
            src={iconSrc}
              alt={iconAlt || 'icon'}
              width={24}
              height={24}
              className='ml-2'
              />
          )}

          <FormControl>
            <Input
              placeholder={placeholder}
              {...field}
              className='shad-input border-0 text-white'
              />
          </FormControl>
        </div>
      )
    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput
            defaultCountry='US'
            placeholder={placeholder}
            international
            withCountryCallingCode
            value={field.value}
            onChange={field.onChange}
            className='input-phone text-[#E8E9E9] bg-dark-500'
          />
        </FormControl>
      )
    default:
      break;
  }
}

const CustomFormField = ( props: CustomProps) => {
  const {
    control,
    fieldType,
    name,
    label,
    placeholder,
    iconSrc,
    iconAlt,
    disabled,
    dateFormat,
    showTimeSelect,
    children,
    renderSkeleton,
  } = props

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex-1'>
          {fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel className='text-white'>{label}</FormLabel>
          )}

          <RenderField field={field} props={props}/>

          <FormMessage className='shad-error' />
        </FormItem>
      )}
    />
  )
}

export default CustomFormField