import "dotenv/config"

export const ENV = {
    PORT: process.env.PORT,
    HOST: process.env.DB_HOST,
    DATABASE: process.env.DB_DATABASE,
    DB_PORT: process.env.DB_PORT,
    USERNAME: process.env.DB_USERNAME,
    PASSWORD: process.env.DB_PASSWORD
};

