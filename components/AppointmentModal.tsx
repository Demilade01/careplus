"use client"

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './ui/button'
import AppointmentForm from './form/AppointmentForm'
import { Appointment } from '@/types/appwrite.types'

const AppointmentModal = ({
  type,
  patientId,
  userId,
  appointment,
}: {
  type: "schedule" | "cancel",
  patientId: string,
  userId: string,
  appointment?: Appointment,
}) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className={`capitalize ${type === 'schedule' && 'text-green-500'} ${type === 'cancel' && 'text-red-500'}`}>
          {type}
        </Button>
      </DialogTrigger>
      <DialogContent className='shad-dialog sm:max-w-md text-white'>
        <DialogHeader className='mb-4 space-y-3'>
          <DialogTitle className='capitalize text-white'>{type} Appointment</DialogTitle>
          <DialogDescription className='text-white'>
            Please fill in the following details to <span className={`${type === 'schedule' && 'text-green-500'} ${type === 'cancel' && 'text-red-500'}`}>{type}</span> an appointment
          </DialogDescription>
        </DialogHeader>

        <AppointmentForm
          userId={userId}
          patientId={patientId}
          type={type}
          appointment={appointment}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  )
}

export default AppointmentModal