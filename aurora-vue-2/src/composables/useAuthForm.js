// 表单全部逻辑：模式切换、校验、密码强度、提交状态机
// 纯逻辑，不触碰 DOM（聚焦/高度同步等交由组件处理）
import { reactive, ref } from 'vue'

const COPY = {
  login:  { t: '欢迎回来', s: '登录后继续你的探索之旅', b: '登 录' },
  signup: { t: '创建账号', s: '加入我们，开启星海之旅', b: '注 册' },
  reset:  { t: '重置密码', s: '输入邮箱，我们会发送重置链接', b: '发送链接' }
}

const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/

export function useAuthForm (emit) {
  const mode = ref('login')
  const form = reactive({ name: '', email: '', pass: '', pass2: '' })
  const remember = ref(true)
  const agree = ref(false)
  const agreeInvalid = ref(false)
  const invalid = reactive({ name: false, email: false, pass: false, pass2: false })
  const showPass = reactive({ pass: false, pass2: false })
  const submitState = ref('idle')

  const headSwap = ref(false)
  const headTitle = ref(COPY.login.t)
  const headSub = ref(COPY.login.s)
  const submitText = ref(COPY.login.b)

  const strength = reactive({ width: '0', color: '', label: '密码强度：—' })

  function clearField (k) { invalid[k] = false }
  function clearErrors () {
    invalid.name = invalid.email = invalid.pass = invalid.pass2 = false
    agreeInvalid.value = false
  }

  function tabOn (m) {
    return m === mode.value || (mode.value === 'reset' && m === 'login')
  }

  function setMode (next) {
    if (next === mode.value) return
    mode.value = next
    headSwap.value = true
    setTimeout(() => {
      headTitle.value = COPY[mode.value].t
      headSub.value = COPY[mode.value].s
      submitText.value = COPY[mode.value].b
      headSwap.value = false
    }, 200)
    clearErrors()
  }

  function togglePass (k) { showPass[k] = !showPass[k] }

  function onPassInput () {
    clearField('pass')
    const v = form.pass
    let score = 0
    if (v.length >= 8) score++
    if (/[A-Za-z]/.test(v) && /\d/.test(v)) score++
    if (v.length >= 12) score++
    if (/[^A-Za-z0-9]/.test(v)) score++
    const pct = [0, 30, 58, 80, 100][score]
    const label = ['弱', '一般', '不错', '很强', '极强'][Math.min(score, 4)]
    strength.width = pct + '%'
    strength.color = score <= 1
      ? 'linear-gradient(90deg,#ff5f78,#ff8a5f)'
      : score === 2
        ? 'linear-gradient(90deg,#fbbf24,#f59e0b)'
        : 'linear-gradient(90deg,#22d3ee,#7c5cff)'
    strength.label = v ? '密码强度：' + label : '密码强度：—'
  }

  function validate () {
    clearErrors()
    let ok = true
    let first = null
    if (!RE_EMAIL.test(form.email.trim())) { invalid.email = true; ok = false; first = first || 'email' }
    if (mode.value === 'signup') {
      if (form.name.trim().length < 2) { invalid.name = true; ok = false; first = first || 'name' }
      if (!(form.pass.length >= 8 && /[A-Za-z]/.test(form.pass) && /\d/.test(form.pass))) { invalid.pass = true; ok = false; first = first || 'pass' }
      if (form.pass2 !== form.pass || !form.pass2) { invalid.pass2 = true; ok = false; first = first || 'pass2' }
      if (!agree.value) { ok = false; agreeInvalid.value = true }
    }
    if (mode.value === 'login') {
      if (form.pass.length < 6) { invalid.pass = true; ok = false; first = first || 'pass' }
    }
    return { ok, first }
  }

  function onSubmit () {
    const { ok, first } = validate()
    if (!ok) return { ok, first }
    submitState.value = 'loading'
    setTimeout(() => {
      submitState.value = 'done'
      setTimeout(() => {
        submitState.value = 'idle'
        emit('success', mode.value)
      }, 480)
    }, 1500)
    return { ok: true }
  }

  function resetToLogin () {
    form.name = ''
    form.email = ''
    form.pass = ''
    form.pass2 = ''
    agree.value = false
    remember.value = true
    agreeInvalid.value = false
    clearErrors()
    strength.width = '0'
    strength.color = ''
    strength.label = '密码强度：—'
    showPass.pass = false
    showPass.pass2 = false
    setMode('login')
  }

  return {
    mode, form, remember, agree, agreeInvalid, invalid, showPass, submitState,
    headSwap, headTitle, headSub, submitText, strength,
    clearField, clearErrors, tabOn, setMode, togglePass, onPassInput,
    validate, onSubmit, resetToLogin
  }
}
