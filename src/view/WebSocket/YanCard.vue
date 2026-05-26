<template>
  <div>
    <a-space style="margin-bottom: 12px">
      <a-button type="primary" @click="deal" :loading="booting">发牌</a-button>
      <a-button @click="resetGame" :disabled="booting">重置</a-button>
      <a-typography-text>结果：{{ resultText }}</a-typography-text>
    </a-space>
    <div ref="gameHost" class="yan-card-host"></div>
    <a-alert
      v-if="loadError"
      type="error"
      message="未检测到 Phaser 运行时"
      description="请安装依赖：npm i phaser -S，然后重新启动开发服务。"
      show-icon
      style="margin-top: 12px"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { message } from 'ant-design-vue'

let Phaser: any
const gameRef = ref<any>(null)
const sceneRef = ref<any>(null)
const gameHost = ref<HTMLDivElement | null>(null)
const booting = ref(false)
const loadError = ref(false)
const resultText = ref('—')

const CARD_W = 120
const CARD_H = 160

const createSceneClass = (PhaserLib: any) => {
  return class YanScene extends PhaserLib.Scene {
    playerCard!: any
    dealerCard!: any
    backColor = 0x1e90ff
    frontColor = 0xffffff
    playerVal: number | null = null
    dealerVal: number | null = null
    resultTextObj!: any

    constructor() {
      super({ key: 'YanScene' })
    }

    create() {
      const cx = this.cameras.main.centerX
      const cy = this.cameras.main.centerY

      const drawRoundedCard = (g: any, color: number, alpha = 1) => {
        g.clear()
        g.fillStyle(color, alpha)
        g.fillRoundedRect(-CARD_W / 2, -CARD_H / 2, CARD_W, CARD_H, 12)
        g.lineStyle(4, 0x000000, 0.4)
        g.strokeRoundedRect(-CARD_W / 2, -CARD_H / 2, CARD_W, CARD_H, 12)
      }

      const makeCard = (x: number, y: number) => {
        const container = this.add.container(x, y)
        const bg = this.add.graphics()
        drawRoundedCard(bg, this.backColor, 1)
        const text = this.add.text(0, 0, '燕', {
          fontFamily: 'Arial',
          fontSize: '48px',
          color: '#ffffff'
        }).setOrigin(0.5)
        container.add([bg, text])
        container.setScale(1)
        ;(container as any).bg = bg
        ;(container as any).text = text
        return container
      }

      this.playerCard = makeCard(cx - 160, cy)
      this.dealerCard = makeCard(cx + 160, cy)

      // 标题
      this.add.text(cx, 60, '我要燕牌 - 比大小', {
        fontSize: '28px',
        color: '#333'
      }).setOrigin(0.5)

      this.resultTextObj = this.add.text(cx, cy + CARD_H, '', {
        fontSize: '24px',
        color: '#333'
      }).setOrigin(0.5, 0)

      // 入场特效
      this.tweens.add({
        targets: [this.playerCard, this.dealerCard],
        y: cy - 10,
        ease: 'Back.Out',
        duration: 500,
        yoyo: true
      })
    }

    flipTo(val: number, isPlayer: boolean) {
      const card = isPlayer ? this.playerCard : this.dealerCard
      const bg = card.bg
      const text = card.text
      const drawFront = () => {
        // 重绘为正面
        const g = bg as any
        g.clear()
        g.fillStyle(this.frontColor, 1)
        g.fillRoundedRect(-CARD_W / 2, -CARD_H / 2, CARD_W, CARD_H, 12)
        g.lineStyle(4, 0x000000, 0.4)
        g.strokeRoundedRect(-CARD_W / 2, -CARD_H / 2, CARD_W, CARD_H, 12)
        text.setColor('#222222')
        text.setText(this.displayVal(val))
      }
      this.tweens.add({
        targets: card,
        scaleX: 0,
        duration: 200,
        ease: 'Cubic.easeIn',
        onComplete: () => {
          drawFront()
          this.tweens.add({
            targets: card,
            scaleX: 1,
            duration: 220,
            ease: 'Cubic.easeOut'
          })
        }
      })
      // 闪光特效
      const spark = this.add.graphics()
      spark.alpha = 0.0
      spark.fillStyle(0xffff66, 1)
      spark.fillRoundedRect(card.x - CARD_W / 2, card.y - CARD_H / 2, CARD_W, CARD_H, 12)
      this.tweens.add({
        targets: spark,
        alpha: { from: 0.0, to: 0.4 },
        duration: 100,
        yoyo: true,
        onComplete: () => spark.destroy()
      })
    }

    resetBacks() {
      const resetOne = (card: any) => {
        card.scaleX = 1
        const g = card.bg as any
        g.clear()
        g.fillStyle(this.backColor, 1)
        g.fillRoundedRect(-CARD_W / 2, -CARD_H / 2, CARD_W, CARD_H, 12)
        g.lineStyle(4, 0x000000, 0.4)
        g.strokeRoundedRect(-CARD_W / 2, -CARD_H / 2, CARD_W, CARD_H, 12)
        card.text.setColor('#ffffff')
        card.text.setText('燕')
      }
      resetOne(this.playerCard)
      resetOne(this.dealerCard)
      this.playerVal = null
      this.dealerVal = null
      this.resultTextObj.setText('')
    }

    displayVal(val: number) {
      if (val === 11) return 'J'
      if (val === 12) return 'Q'
      if (val === 13) return 'K'
      if (val === 14) return 'A'
      return String(val)
    }

    showResult() {
      if (this.playerVal == null || this.dealerVal == null) return
      let res = '平局'
      if (this.playerVal > this.dealerVal) res = '你赢了'
      else if (this.playerVal < this.dealerVal) res = '你输了'
      this.resultTextObj.setText(res)
    }
  }
}

const boot = async () => {
  booting.value = true
  try {
    const mod = await import('phaser')
    Phaser = mod.default || mod
  } catch (e) {
    loadError.value = true
    booting.value = false
    return
  }

  const YanScene = createSceneClass(Phaser)
  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 500,
    backgroundColor: '#f5f5f5',
    parent: gameHost.value!,
    scene: [YanScene]
  }
  gameRef.value = new Phaser.Game(config)
  const readyEvt = (Phaser.Core && Phaser.Core.Events && Phaser.Core.Events.READY) || 'ready'
  const setSceneRef = () => {
    const mgr = gameRef.value.scene
    sceneRef.value = (mgr.keys && mgr.keys['YanScene']) || (mgr.getScene && mgr.getScene('YanScene')) || null
    booting.value = false
  }
  if (gameRef.value?.events && readyEvt) {
    gameRef.value.events.once(readyEvt, setSceneRef)
  } else {
    setTimeout(setSceneRef, 0)
  }
}

const deal = async () => {
  if (!sceneRef.value) {
    await boot()
  }
  if (!sceneRef.value) return
  const randVal = () => {
    // 2~14（A=14）
    return Math.floor(Math.random() * 13) + 2
  }
  const pv = randVal()
  const dv = randVal()
  sceneRef.value.playerVal = pv
  sceneRef.value.dealerVal = dv
  sceneRef.value.flipTo(pv, true)
  setTimeout(() => {
    sceneRef.value.flipTo(dv, false)
    setTimeout(() => {
      sceneRef.value.showResult()
      resultText.value = sceneRef.value.resultTextObj.text || '—'
    }, 260)
  }, 240)
}

const resetGame = async () => {
  if (!sceneRef.value) {
    await boot()
  }
  if (!sceneRef.value) return
  sceneRef.value.resetBacks()
  resultText.value = '—'
}

onMounted(() => {
  boot()
})

onBeforeUnmount(() => {
  try {
    if (gameRef.value) {
      gameRef.value.destroy(true)
    }
  } catch {}
})
</script>

<style scoped>
.yan-card-host {
  width: 800px;
  height: 500px;
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}
</style>
