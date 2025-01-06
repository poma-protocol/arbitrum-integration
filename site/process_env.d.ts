declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_BACKEND_URL,
            NEXT_PUBLIC_IMAGE_HOSTNAME
        }
    }
}

export {}