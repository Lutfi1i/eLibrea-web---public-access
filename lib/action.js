"use server"
import bcrypt from "bcryptjs";
import connection from "./database";
import { redirect } from "next/navigation";

export async function storedUSer(formData) {
    const email = formData.get('email');
    const username = formData.get('username');
    const password = bcrypt.hashSync(formData.get('password'), 10);
    const name = formData.get('username')
    const profile_picture = '/elib-default-profile-picture.png'
    const role = "users";

    await connection.execute(
        'INSERT INTO pengguna (username, name, email, password, profile_picture, role) VALUES (?, ?, ?, ?, ?, ?)',
        [username, name, email, password, profile_picture, role]
    );

    redirect('/login');
}

export async function getUserByEmail(email) {
    const [users] = await connection.execute(
        'SELECT * FROM pengguna WHERE email = ?',
        [email]
    );

    if (!users.length ) {
        return null;
    }

    return users[0];
}

export async function getUserById(id) {
    const [users] = await connection.execute(
        'SELECT * FROM pengguna WHERE id = ?',
        [id]
    );

    if (!users.length) {
        return null;
    }

    return users[0];
}