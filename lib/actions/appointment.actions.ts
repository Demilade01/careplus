"use server"

import { ID } from "node-appwrite"
import { databases } from "../appwrite.config"
import { parseStringify } from "../utils"

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