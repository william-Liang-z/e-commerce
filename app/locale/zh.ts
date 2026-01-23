// 中文翻译
const zh: Record<string, string> = {
  // 登录页面
  'login.title': '欢迎回来',
  'login.subtitle': '请登录您的账户',
  'login.email': '邮箱地址',
  'login.email.placeholder': '请输入邮箱',
  'login.password': '密码',
  'login.password.placeholder': '请输入密码',
  'login.rememberMe': '记住我',
  'login.forgotPassword': '忘记密码？',
  'login.submit': '登录',
  'login.submitting': '登录中...',
  'login.success': '登录成功！',
  'login.noAccount': '还没有账户？',
  'login.register': '立即注册',

  // 忘记密码弹窗
  'forgotPassword.title': '重置密码',
  'forgotPassword.description': '请输入您的邮箱地址，我们将发送验证码帮助您重置密码。',
  'forgotPassword.email': '邮箱地址',
  'forgotPassword.email.placeholder': '请输入注册邮箱',
  'forgotPassword.send': '发送验证码',
  'forgotPassword.sending': '发送中...',
  'forgotPassword.sent': '已发送',
  'forgotPassword.sentSuccess': '验证码已发送至您的邮箱！',

  // 注册页面
  'register.title': '创建账户',
  'register.subtitle': '注册一个新账户开始使用',
  'register.description': '此页面为占位符，您可以在此实现注册功能',
  'register.email': '邮箱地址',
  'register.email.placeholder': '请输入邮箱',
  'register.password': '密码',
  'register.password.placeholder': '请输入密码（至少8位，含字母和数字）',
  'register.confirmPassword': '确认密码',
  'register.confirmPassword.placeholder': '请再次输入密码',
  'register.agreeTerms.prefix': '我已阅读并同意',
  'register.agreeTerms.terms': '《用户协议》',
  'register.agreeTerms.and': '和',
  'register.agreeTerms.privacy': '《隐私政策》',
  'register.submit': '注册',
  'register.submitting': '注册中...',
  'register.success': '注册成功！正在跳转到登录页面...',
  'register.backToLogin': '返回登录',
  'register.hasAccount': '已有账户？',
  'register.login': '立即登录',

  // 表单校验
  'validation.email.required': '请输入邮箱地址',
  'validation.email.invalid': '请输入有效的邮箱格式',
  'validation.password.required': '请输入密码',
  'validation.password.minLength': '密码长度至少6位',
  'validation.password.minLengthRegister': '密码长度至少8位',
  'validation.password.complexity': '密码必须包含字母和数字',
  'validation.confirmPassword.required': '请再次输入密码',
  'validation.confirmPassword.mismatch': '两次密码输入不一致',

  // 辅助功能
  'aria.showPassword': '显示密码',
  'aria.hidePassword': '隐藏密码',

  // 主题切换
  'theme.toggle': '切换主题',
}

export default zh
