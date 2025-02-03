"use server"

import { ID, Query } from "node-appwrite"
import { BUCKET_ID, databases, PROJECT_ID, storage, users } from "../appwrite.config"
import { parseStringify } from "../utils"
import { InputFile } from "node-appwrite/file"

export const createUser = async (user: CreateUserParams) => {
  try {
    const newuser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );

    return parseStringify(newuser);
  } catch (error: any) {
    console.error("Error in user creation:", error.response || error.message || error);

    if (error?.code === 409) {
      const existingUser = await users.list([Query.equal("email", [user.email])]);
      return existingUser.users[0];
    }

    throw new Error("An error occurred while creating the user");
  }
};

export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);

    return parseStringify(user);
  } catch (error) {
    console.log(error);
  }
}

export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      process.env.DATABASE_ID! || "678d76bb001a4af7d985",
      process.env.PATIENT_COLLECTION_ID! || "678d79c800227732cdd4",
      [Query.equal('userId', [userId])]
    );

    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.log(error);
  }
}

export const registerPatient = async ({ identificationDocument, ...patient}: RegisterUserParams) => {
  try {
    let file;

    if(identificationDocument) {
      const inputFile = InputFile.fromBuffer(
        identificationDocument?.get('blobFile') as Blob,
        identificationDocument?.get('fileName') as string,
      )

      file = await storage.createFile("678d7a8c0006f9a5628e",
        ID.unique(),
        inputFile
      )
    }

    const newPatient = await databases.createDocument(
      process.env.DATABASE_ID || "678d76bb001a4af7d985",
      process.env.PATIENT_COLLECTION_ID || "678d79c800227732cdd4",
      ID.unique(),
      {
        identificationDocumentId: file?.$id || null,
        identificationDocumentUrl: `https://cloud.appwrite.io/v1/storage/buckets/${BUCKET_ID! || "678d7a8c0006f9a5628e"}//${file?.$id}/view?project=${PROJECT_ID || "678d75c10039401e32f0"}`,
        ...patient
      }
    )

    return parseStringify(newPatient)
  } catch (error) {
    console.log(error)
  }
}