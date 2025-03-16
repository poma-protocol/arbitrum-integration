declare global {
    namespace NodeJS {
        interface ProcessEnv {
            // ARIBTRUM_NOVA_KEY: string,
            BLOCK_NUMBER: number,
            PORT: number,
            DATABASE_URL: string,
            CONTRACT: string,
            RPC_URL: string
        }
    }
}

export {}