import connection from './database';
import { NextResponse } from "next/server";


export async function dataBuku() {
    const [rows] = await connection.query(
        'SELECT * FROM buku'
    );

    return rows;
}

export async function query(sql, params = []) {
  const [rows] = await connection.query(sql, params);
  return rows;
}