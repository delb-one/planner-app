import "server-only"

import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

type ServiceAccountEnv = {
  project_id?: string
  projectId?: string
  client_email?: string
  clientEmail?: string
  private_key?: string
  privateKey?: string
}

let firestoreSingleton: ReturnType<typeof getFirestore> | null = null

function readServiceAccountEnv() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as ServiceAccountEnv
      const projectId = parsed.project_id ?? parsed.projectId
      const clientEmail = parsed.client_email ?? parsed.clientEmail
      const privateKey = (parsed.private_key ?? parsed.privateKey)?.replace(
        /\\n/g,
        "\n",
      )

      if (projectId && clientEmail && privateKey) {
        return cert({
          projectId,
          clientEmail,
          privateKey,
        })
      }
    } catch {
      // Ignore malformed JSON and fall back to the explicit env vars below.
    }
  }

  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")

  if (projectId && clientEmail && privateKey) {
    return cert({
      projectId,
      clientEmail,
      privateKey,
    })
  }

  return null
}

export function hasFirestoreConfig(): boolean {
  return Boolean(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
      (process.env.FIREBASE_PROJECT_ID &&
        process.env.FIREBASE_CLIENT_EMAIL &&
        process.env.FIREBASE_PRIVATE_KEY),
  )
}

export function getFirestoreDb() {
  if (firestoreSingleton) {
    return firestoreSingleton
  }

  const credential = readServiceAccountEnv()
  if (!credential) {
    return null
  }

  const app =
    getApps()[0] ??
    initializeApp({
      credential,
    })

  firestoreSingleton = getFirestore(app)
  return firestoreSingleton
}
