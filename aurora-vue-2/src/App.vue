<template>
  <AuroraBackground />
  <div class="grain"></div>
  <div class="vignette"></div>

  <main class="stage">
    <section class="card" ref="card" @pointermove="onMove" @pointerleave="onLeave">
      <div class="card__spin"></div>
      <div class="card__fill"></div>
      <div class="card__spot" ref="spot"></div>

      <div class="card__inner">
        <BrandPanel />
        <AuthPanel ref="authPanel" @success="onSuccess" />
      </div>

      <SuccessOverlay :show="showDone" :title="doneTitle" :sub="doneSub" @reset="onReset" />
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import AuroraBackground from './components/AuroraBackground.vue'
import BrandPanel from './components/BrandPanel.vue'
import AuthPanel from './components/AuthPanel.vue'
import SuccessOverlay from './components/SuccessOverlay.vue'
import { useTilt } from './composables/useTilt'

const { card, spot, onMove, onLeave } = useTilt()

const authPanel = ref(null)
const showDone = ref(false)
const doneTitle = ref('')
const doneSub = ref('')

function onSuccess (mode) {
  doneTitle.value = mode === 'signup' ? '账号创建成功' : mode === 'reset' ? '邮件已发送' : '欢迎回来，探险家'
  doneSub.value = mode === 'reset'
    ? '请查收邮箱，点击链接重置密码'
    : '正在为你打开星海控制台…'
  showDone.value = true
}

function onReset () {
  showDone.value = false
  if (authPanel.value) authPanel.value.resetToLogin()
}
</script>
