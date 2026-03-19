
import { NextResponse, NextRequest } from 'next/server';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { z } from 'zod'; // 数据校验（若未安装，先执行 npm install zod）

// 初始化 Neon 数据库连接
const sql = neon(`${process.env.DATABASE_URL}`);

// 处理 POST 请求（注册）
export async function POST(request: NextRequest) {
  try {
    // 1. 获取并校验请求体数据
    const body = await request.json();
    const { email, password, username } = body;

    // 2. 检查邮箱是否已存在
    const existingUser = await sql`
      SELECT * FROM account WHERE email = ${email} LIMIT 1
    `;
    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: '该邮箱已注册，请直接登录' },
        { status: 400 }
      );
    }

    // 3. 密码加密（加盐哈希，避免明文存储）
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. 写入数据库
    const newUser = await sql`
      INSERT INTO account (email, password, username)
      VALUES (${email}, ${hashedPassword}, ${username})
      RETURNING id, email, username, is_admin, created_at  -- 只返回非敏感字段
    `;

    // 5. 返回成功响应（隐藏密码字段）
    return NextResponse.json(
      {
        message: '注册成功',
        user: {
          id: newUser[0].id,
          email: newUser[0].email,
          username: newUser[0].username,
          isAdmin: newUser[0].is_admin,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    // 6. 错误处理
    console.error('注册失败：', error);
    // 表单校验错误
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '数据校验失败', },
        { status: 400 }
      );
    }
    // 服务器/数据库错误
    return NextResponse.json(
      { error: '注册失败，请稍后重试' },
      { status: 500 }
    );
  }
}