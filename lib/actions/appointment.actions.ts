"use server"

import { ID, Query } from "node-appwrite"
import { databases, messaging } from "../appwrite.config"
import { formatDateTime, parseStringify } from "../utils"
import { Appointment } from "@/types/appwrite.types"
import { revalidatePath } from "next/cache"

export const createAppointment = async (appointment: CreateAppointmentParams ) => {
  try {
    const newAppointment = await databases.createDocument(
      process.env.DATABASE_ID || "678d76bb001a4af7d985",
      process.env.APPOINTMENT_COLLECTION_ID || "678d79c800227732cdd4",
      ID .unique(),
      appointment
    )

    return parseStringify(newAppointment);
  } catch (error) {
    console.log(error)
  }
}

export const getAppointments = async (appointmentId: string) => {
  try {
    const appointments = await databases.getDocument(
      process.env.DATABASE_ID || "678d76bb001a4af7d985",
      process.env.APPOINTMENT_COLLECTION_ID || "678d79c800227732cdd4",
      appointmentId,
    )

    return parseStringify(appointments)
  } catch (error) {
    console.log(error)
  }
}

export const getRecentAppointmentList = async () => {
  try {
    const appointments = await databases.listDocuments(
      process.env.DATABASE_ID || "678d76bb001a4af7d985",
      process.env.APPOINTMENT_COLLECTION_ID || "678d79c800227732cdd4",
      [Query.orderDesc('$createdAt')]
    );

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    }

    const counts = (appointments.documents as Appointment[]).reduce((acc, appointment) => {
      if(appointment.status === 'scheduled') {
        acc.scheduledCount += 1;
      } else if(appointment.status === 'pending') {
        acc.pendingCount += 1;
      } else if(appointment.status === 'cancelled') {
        acc.cancelledCount += 1;
      }

      return acc;
    }, initialCounts);

    const data = {
      totalCount : appointments.total,
      ...counts,
      documents: appointments.documents
    }

    return parseStringify(data);
  } catch (error) {
    console.log(error)
  }
}

export const updateAppointment = async ({ appointmentId, userId, appointment, type }: UpdateAppointmentParams) => {
  try {
    const updatedAppointment = await databases.updateDocument(
      process.env.DATABASE_ID || "678d76bb001a4af7d985",
      process.env.APPOINTMENT_COLLECTION_ID || "678d79c800227732cdd4",
      appointmentId,
      appointment
    )

    if(!updatedAppointment) {
      throw new Error('Appointment not found')
    }

    const smsMessage = `
      Hi, it's Carepulse.
      ${type === 'schedule'
        ?  `Your appointment has been scheduled for ${formatDateTime(appointment.schedule).dateTime} with Dr. ${appointment.primaryPhysician}.`
        : `Your appointment has been cancelled. for the following reason: ${appointment.cancellationReason}`
      }
    `
    await sendSMSNotification(userId, smsMessage);
    revalidatePath('./admin');

    return parseStringify(updatedAppointment)
  } catch (error) {
    console.log(error)
  }
}

export const sendSMSNotification = async (userId: string, content: string) => {
  try {
    const message = await messaging.createSms(
      ID.unique(),
      content,
      [],
      [userId]
    )

    return parseStringify(message);
  } catch (error) {
    console.log(error)
  }
}