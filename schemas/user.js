import z from "zod"

const userSchema = z.object({
    username: z.string(),
    password: z.string(),
    email: z.string().email(),
    Account_Created: z.date(),
});

export function validateUser(user) {
    return userSchema.safeParse(user);
}

export function validatePartialUser(user) {
    return userSchema.partial().safeParse(user);
}
