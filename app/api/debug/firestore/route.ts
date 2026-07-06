import { NextResponse } from "next/server"

import { hasFirestoreConfig, getFirestoreDb } from "@/lib/firebase-admin"

export async function GET() {
  const configured = hasFirestoreConfig()
  const db = getFirestoreDb()

  if (!db) {
    return NextResponse.json({
      configured,
      connected: false,
      backend: "memory",
      message:
        "Firestore credentials are missing, so the app is currently using the in-memory fallback.",
    })
  }

  try {
    const [ridersSnapshot, availabilitySnapshot] = await Promise.all([
      db.collection("riders").limit(1).get(),
      db.collection("availability").limit(1).get(),
    ])

    return NextResponse.json({
      configured,
      connected: true,
      backend: "firestore",
      message: "Firestore is reachable from the server.",
      samples: {
        riders: ridersSnapshot.size,
        availability: availabilitySnapshot.size,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        configured,
        connected: false,
        backend: "firestore",
        message: "Firestore credentials exist, but the server could not read data.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
