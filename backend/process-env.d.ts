declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BLOCK_NUMBER: number,
            PORT: number,
            CLIENT_SECRET: string,
            DATABASE_URL: string,
            CONTRACT: string,
            CLIENT_ID: string,
            RPC_URL: string,
            PROJECT_ID: string,
            INFISICAL_ENVIRONMENT: string,
            REGION: string
        }
    }
}

export {}