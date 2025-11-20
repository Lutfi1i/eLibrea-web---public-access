// 导入模块
import mysql from 'mysql2/promise';

// 创建一个数据库连接
const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'librea',
  password: 'Ruk11aKuchik11'
});

export default connection;