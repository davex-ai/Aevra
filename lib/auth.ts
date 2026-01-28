// lib/auth.ts
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

const register = async (email: string, password: string) => {
  const userCredential =
    await createUserWithEmailAndPassword(auth, email, password);

  return userCredential.user;
};

import { signInWithEmailAndPassword } from "firebase/auth";

const login = async (email: string, password: string) => {
  const userCredential =
    await signInWithEmailAndPassword(auth, email, password);

  return userCredential.user;
};