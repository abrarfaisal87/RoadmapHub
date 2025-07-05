import bcrypt from 'bcrypt'


const saltRounds = 10

export const hashPassword  = async (plaintext)=>{
    return await bcrypt.hash(plaintext, saltRounds)
}

export const comparePassword = async (plaintext, hashed)=>{
    return await bcrypt.compare(plaintext, hashed)
}

