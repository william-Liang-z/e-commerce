import { NextResponse, NextRequest } from 'next/server';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z, ZodError } from 'zod';

// 初始化 Neon 数据库连接
const sql = neon(`${process.env.DATABASE_URL}`);

// 定义登录表单校验规则
const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6个字符'),
});

// JWT 密钥（需在 .env.local 中配置：JWT_SECRET=你的随机密钥）
// const JWT_SECRET = process.env.JWT_SECRET;
const JWT_SECRET  = 'xxxxx'
if (!JWT_SECRET) {
  throw new Error('请配置 JWT_SECRET 环境变量');
}

// 处理 POST 请求（登录）
export async function POST(request: NextRequest) {
  try {
    // 1. 获取并校验请求体数据
    const body = await request.json();
    const validatedData = loginSchema.parse(body);
    const { email, password } = validatedData;

    // 2. 查询用户（仅查询必要字段）
    const user = await sql`
      SELECT id, email, password, username, is_admin 
      FROM account WHERE email = ${email} LIMIT 1
    `;
    if (user.length === 0) {
      return NextResponse.json(
        { error: '邮箱或密码错误' },
        { status: 401 }
      );
    }
    const userData = user[0];
    console.log(user, password, userData)

    // 3. 验证密码（对比明文密码和数据库中的哈希密码）
    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: '邮箱或密码错误' },
        { status: 401 }
      );
    }

    // 4. 生成 JWT 令牌（有效期 7 天，可根据需求调整）
    const token = jwt.sign(
      {
        id: userData.id,
        email: userData.email,
        isAdmin: userData.is_admin,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 5. 构建响应（将 Token 存入 Cookie，更安全）
    const response = NextResponse.json({
      message: '登录成功',
      user: {
        id: userData.id,
        email: userData.email,
        username: userData.username,
        isAdmin: userData.is_admin,
      },
    });

    // 设置 Cookie（httpOnly: true 防止 XSS 攻击，secure: process.env.NODE_ENV === 'production' 生产环境启用 HTTPS）
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60, // 7 天有效期（和 JWT 一致）
      path: '/', // 全站可用
    });

    return response;  
  } catch (error: unknown) {
    // 6. 错误处理
    console.error('登录失败：', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '数据校验失败', details: 'error' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: '登录失败，请稍后重试' },
      { status: 500 }
    );
  }
}