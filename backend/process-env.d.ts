declare global {
    namespace NodeJS {
        interface ProcessEnv {
            ARIBTRUM_NOVA_KEY: string,
            BLOCK_NUMBER: number,
            PORT: number,
            DATABASE_URL: string,
            PRIVATE_KEY: string,
            CONTRACT: string,
        }
    }
}

export {}