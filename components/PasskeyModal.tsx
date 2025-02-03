"use client"

import React, { useEffect, useState } from "react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { decryptKey, encryptKey } from "@/lib/utils"


const PasskeyModal = () => {
  const router = useRouter();
  const path = usePathname();
  const [open, setOpen] = useState(true);
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState('');

  const encryptedKey = typeof window !== 'undefined' ? window.localStorage.getItem('accessKey') : null;

  useEffect(() => {
    const accessKey = encryptedKey && decryptKey(encryptedKey);

      if(path) {
        if(accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
          setOpen(false);
          router.push("/admin");
      } else {
        setOpen(true);
      }
    }
  }, [encryptedKey])


  const closeModal = () => {
    setOpen(false);
    router.push("/");
  }

  const validatePasskey = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if(passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
        const encryptedKey = encryptKey(passkey);

        localStorage.setItem('accessKey', encryptedKey);

        setOpen(false);
    } else {
      setError('Invalid passkey. Please try again.')
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-start justify-between text-white">
            Admin Access Verification
            <Image
              src="/assets/icons/close.svg"
              alt="close"
              width={20}
              height={20}
              onClick={() => closeModal()}
              className="cursor-pointer"
            />
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-500 ">
            To access the admin page, please enter the passkey.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          <InputOTP maxLength={6} value={passkey} onChange={(value) => setPasskey(value)}>
            <InputOTPGroup className="shad-otp">
              <InputOTPSlot className="shad-otp-slot text-white" index={0} />
              <InputOTPSlot className="shad-otp-slot text-white" index={1} />
              <InputOTPSlot className="shad-otp-slot text-white" index={2} />
              <InputOTPSlot className="shad-otp-slot text-white" index={3} />
              <InputOTPSlot className="shad-otp-slot text-white" index={4} />
              <InputOTPSlot className="shad-otp-slot text-white" index={5} />
            </InputOTPGroup>
          </InputOTP>

          {error && <p className="shad-error text-14-regular mt-4 flex justify-center">
            {error}
            </p>}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className="text-white shad-primary-btn w-full" onClick={(e) => validatePasskey(e)}>
            Enter Admin Passkey
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

  )
}

export default PasskeyModal