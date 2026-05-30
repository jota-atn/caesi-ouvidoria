<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '../../components/Navbar.vue'
import Badge from '../../components/Badge.vue'
import Tag from '../../components/Tag.vue'
import { mensagens, marcarRespostaVista } from '../../stores/mensagens.js'
import { notificacoes, marcarLida } from '../../stores/notificacoes.js'
import { user } from '../../stores/auth.js'

const route = useRoute()
const router = useRouter()

const id = Number(route.params.id)
const mensagem = computed(() => mensagens.value.find(m => m.id === id))

if (!mensagem.value) router.replace('/aluno/mensagens')

onMounted(() => {
  if (mensagem.value?.resposta && !mensagem.value.respostaVista) {
    marcarRespostaVista(id)
  }
  notificacoes.value
    .filter(n => n.mensagemId === id && n.userEmail === user.value?.email && !n.lida)
    .forEach(n => marcarLida(n.id))
})
</script>

<template>
  <div class="page" v-if="mensagem">
    <div class="deco-star" style="top:110px;right:2%;font-size:1.2rem;opacity:0.38;">✦</div>

    <Navbar />

    <div class="page-content">
      <RouterLink to="/aluno/mensagens" class="back-link">← Minhas mensagens</RouterLink>

      <div class="paper">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1rem;flex-wrap:wrap;gap:8px;">
          <Tag :categoria="mensagem.categoria" />
          <Badge :status="mensagem.status" />
        </div>

        <h1 class="msg-title">{{ mensagem.assunto }}</h1>

        <div class="msg-meta" style="margin-bottom:0.8rem;">
          <div class="msg-meta-item">
            <span class="msg-meta-label">Enviada em:</span> {{ mensagem.data }}
          </div>
          <div class="msg-meta-item">
            <span class="msg-meta-label">Protocolo:</span> {{ mensagem.protocolo }}
          </div>
          <div v-if="mensagem.anonimo" class="msg-meta-item" style="font-style:italic;">
            Enviada anonimamente
          </div>
        </div>

        <hr class="divider">

        <p class="label-sm" style="margin-bottom:10px;">Sua mensagem</p>
        <div class="msg-body">{{ mensagem.corpo }}</div>

        <div v-if="mensagem.resposta" class="alert-resposta">
          <p class="label-sm" style="margin-bottom:8px;">Resposta do CAESI</p>
          <div class="msg-body">{{ mensagem.resposta }}</div>
        </div>

        <div v-if="mensagem.status === 'atendida'" style="
          margin-top:1rem;
          background:rgba(78,170,119,0.12);
          border:2px solid var(--verde);
          border-radius:2px;
          padding:12px 16px;
          font-size:0.88rem;
          color:var(--preto);
          line-height:1.5;
        ">
          ✅ Esta mensagem foi <strong>atendida</strong> pelo CAESI.
        </div>
      </div>
    </div>
  </div>
</template>
