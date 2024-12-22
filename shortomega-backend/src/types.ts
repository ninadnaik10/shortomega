export type UserInput = {
    email: string;
    hashedPassword: string;
};

export type AuthInput = {
    email: string;
    password?: string;
    hashedPassword?: string;
};

export type UrlMap = {
    shortUrl: string;
    longUrl: string;
};
