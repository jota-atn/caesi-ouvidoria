<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '../../components/Navbar.vue'
import Badge from '../../components/Badge.vue'
import Tag from '../../components/Tag.vue'
import { mensagens, updateStatus, updateNota, deleteMensagem } from '../../stores/mensagens.js'

const route = useRoute()
const router = useRouter()

const id = Number(route.params.id)
const mensagem = computed(() => mensagens.value.find(m => m.id === id))

if (!mensagem.value) router.replace('/admin/painel')

const status = ref(mensagem.value?.status ?? 'pendente')
const nota = ref(mensagem.value?.nota ?? '')
const notaSalva = ref(false)

const atendida = computed(() => status.value === 'atendida')

function marcarAtendida() {
  status.value = 'atendida'
  updateStatus(id, 'atendida')
}

function desfazer() {
  status.value = 'pendente'
  updateStatus(id, 'pendente')
}

function salvarNota() {
  updateNota(id, nota.value)
  notaSalva.value = true
  setTimeout(() => { notaSalva.value = false }, 2000)
}

function confirmarExcluir() {
  if (confirm('Tem certeza que deseja excluir esta mensagem? Esta ação não pode ser desfeita.')) {
    deleteMensagem(id)
    router.push('/admin/painel')
  }
}
</script>

<template>
  <div class="page" v-if="mensagem">
    <div class="deco-star" style="top:110px;right:2%;font-size:1.2rem;opacity:0.38;">✦</div>
    <div class="deco-star" style="bottom:20%;left:1%;font-size:1.4rem;opacity:0.28;">✦</div>

    <Navbar :admin="true" />

    <div class="page-content" style="padding-top:2rem;">
      <RouterLink to="/admin/painel" class="back-link">← Voltar ao painel</RouterLink>

      <div class="paper" style="margin-bottom:1.2rem;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1rem;flex-wrap:wrap;gap:8px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <Tag :categoria="mensagem.categoria" />
          </div>
          <Badge :status="status" />
        </div>

        <h1 style="font-family:'Syne',sans-serif;font-weight:800;font-size:1.45rem;color:var(--roxo-escuro);margin-bottom:0.8rem;line-height:1.25;">
          {{ mensagem.assunto }}
        </h1>

        <div style="display:flex;gap:1.5rem;flex-wrap:wrap;margin-bottom:1.5rem;">
          <div style="font-size:0.84rem;color:var(--cinza);">
            <span style="font-weight:600;color:var(--preto);">Autor:</span> {{ mensagem.anonimo ? 'Anônimo' : mensagem.autor }}
          </div>
          <div v-if="!mensagem.anonimo && mensagem.matricula" style="font-size:0.84rem;color:var(--cinza);">
            <span style="font-weight:600;color:var(--preto);">Matrícula:</span> {{ mensagem.matricula }}
          </div>
          <div style="font-size:0.84rem;color:var(--cinza);">
            <span style="font-weight:600;color:var(--preto);">Data:</span> {{ mensagem.data }}
          </div>
          <div style="font-size:0.84rem;color:var(--cinza);">
            <span style="font-weight:600;color:var(--preto);">Protocolo:</span> {{ mensagem.protocolo }}
          </div>
        </div>

        <hr class="divider">

        <p style="font-family:'Syne',sans-serif;font-weight:700;font-size:0.76rem;color:var(--roxo-escuro);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:10px;">
          Mensagem
        </p>
        <div class="msg-body">{{ mensagem.corpo }}</div>
      </div>

      <div class="paper" style="margin-bottom:1.2rem;">
        <div class="internal-note">
          <div class="internal-note-label">
            🔒 Anotação interna
            <span style="font-size:0.72rem;color:var(--cinza);text-transform:none;letter-spacing:0;font-weight:400;">
              — visível apenas para membros do CAESI
            </span>
          </div>
          <textarea v-model="nota" placeholder="Registre o que foi feito, próximos passos, quem ficou responsável…"></textarea>
        </div>
        <div style="margin-top:10px;text-align:right;">
          <button
            class="btn btn-outline btn-sm"
            :style="notaSalva ? 'background:var(--verde);color:white;border-color:var(--verde);' : ''"
            @click="salvarNota"
          >{{ notaSalva ? '✓ Salvo' : 'Salvar anotação' }}</button>
        </div>
      </div>

      <div class="paper">
        <h3 style="font-family:'Syne',sans-serif;font-weight:700;font-size:1rem;color:var(--roxo-escuro);margin-bottom:1rem;">
          Ação do CAESI
        </h3>

        <div v-if="!atendida">
          <p style="font-size:0.87rem;color:var(--cinza);margin-bottom:1.2rem;line-height:1.5;">
            Após tratar esta mensagem, marque-a como atendida. O aluno verá a atualização do status.
          </p>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <button class="btn btn-amarelo" @click="marcarAtendida">✓ Marcar como atendida</button>
            <button class="btn btn-outline btn-sm" @click="confirmarExcluir">Excluir mensagem</button>
          </div>
        </div>

        <div v-else>
          <div style="background:rgba(78,170,119,0.12);border:2px solid var(--verde);border-radius:2px;padding:14px 16px;display:flex;align-items:center;gap:12px;margin-bottom:1rem;">
            <span style="font-size:1.6rem;">✓</span>
            <div>
              <div style="font-family:'Syne',sans-serif;font-weight:700;color:var(--verde);font-size:0.95rem;">
                Mensagem marcada como atendida
              </div>
              <div style="font-size:0.81rem;color:var(--cinza);margin-top:2px;">Salvo no sistema</div>
            </div>
          </div>
          <button class="btn btn-outline btn-sm" @click="desfazer">↩ Desfazer</button>
        </div>
      </div>
    </div>
  </div>
</template>
