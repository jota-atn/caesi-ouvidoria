<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '../../components/Navbar.vue'
import Badge from '../../components/Badge.vue'
import Tag from '../../components/Tag.vue'
import { mensagens, updateStatus, updateNota, updateResposta, deleteMensagem } from '../../stores/mensagens.js'

const route = useRoute()
const router = useRouter()

const id = Number(route.params.id)
const mensagem = computed(() => mensagens.value.find(m => m.id === id))

if (!mensagem.value) router.replace('/admin/mensagens')

const status   = ref(mensagem.value?.status ?? 'pendente')
const nota     = ref(mensagem.value?.nota ?? '')
const resposta = ref(mensagem.value?.resposta ?? '')
const notaSalva     = ref(false)
const respostaSalva = ref(false)
const emailAberto   = ref(false)
const emailAssunto  = ref('')
const emailCorpo    = ref('')
const emailEnviado  = ref(false)
const notifEmailMsg = ref('')

const atendida = computed(() => status.value === 'atendida')

function mostrarNotifEmail(texto) {
  notifEmailMsg.value = texto
  setTimeout(() => { notifEmailMsg.value = '' }, 3500)
}

function marcarAtendida() {
  status.value = 'atendida'
  updateStatus(id, 'atendida')
  if (!mensagem.value?.anonimo && mensagem.value?.email) {
    mostrarNotifEmail(`📧 E-mail de notificação enviado para ${mensagem.value.email}`)
  }
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

function salvarResposta() {
  updateResposta(id, resposta.value)
  respostaSalva.value = true
  setTimeout(() => { respostaSalva.value = false }, 2000)
  if (resposta.value.trim() && !mensagem.value?.anonimo && mensagem.value?.email) {
    mostrarNotifEmail(`📧 E-mail de notificação enviado para ${mensagem.value.email}`)
  }
}

function enviarEmail() {
  emailEnviado.value = true
  emailAberto.value = false
  emailAssunto.value = ''
  emailCorpo.value = ''
  setTimeout(() => { emailEnviado.value = false }, 3000)
}

function confirmarExcluir() {
  if (confirm('Tem certeza que deseja excluir esta mensagem? Esta ação não pode ser desfeita.')) {
    deleteMensagem(id)
    router.push('/admin/mensagens')
  }
}
</script>

<template>
  <div class="page" v-if="mensagem">
    <div class="deco-star" style="top:110px;right:2%;font-size:1.2rem;opacity:0.38;">✦</div>
    <div class="deco-star" style="bottom:20%;left:1%;font-size:1.4rem;opacity:0.28;">✦</div>

    <Navbar :admin="true" />

    <div class="page-content" style="padding-top:2rem;">
      <RouterLink to="/admin/mensagens" class="back-link">← Voltar ao painel</RouterLink>

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

      <!-- Contato direto por e-mail -->
      <div v-if="!mensagem.anonimo && mensagem.autor" class="paper" style="margin-bottom:1.2rem;">
        <div style="font-family:'Syne',sans-serif;font-weight:700;font-size:0.75rem;color:var(--roxo-escuro);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px;">
          📧 Contato direto
        </div>
        <div style="font-size:0.76rem;color:var(--cinza);margin-bottom:1rem;">
          Enviar e-mail para <strong style="color:var(--preto);">{{ mensagem.autor }}</strong>
          <template v-if="mensagem.email"> — {{ mensagem.email }}</template>
        </div>

        <div v-if="emailEnviado" style="display:flex;align-items:center;gap:10px;background:rgba(78,170,119,0.12);border:2px solid var(--verde);border-radius:2px;padding:12px 16px;">
          <span style="font-size:1.3rem;">✓</span>
          <div style="font-family:'Syne',sans-serif;font-weight:700;color:var(--verde);font-size:0.9rem;">E-mail enviado!</div>
        </div>

        <template v-else>
          <button v-if="!emailAberto" class="btn btn-outline btn-sm" @click="emailAberto = true">
            Enviar e-mail
          </button>

          <div v-else>
            <div class="field" style="margin-bottom:0.8rem;">
              <label style="font-family:'Syne',sans-serif;font-weight:700;font-size:0.72rem;color:var(--roxo-escuro);text-transform:uppercase;letter-spacing:0.06em;">Assunto</label>
              <input v-model="emailAssunto" type="text" placeholder="Ex.: Retorno sobre sua mensagem — {{ mensagem.protocolo }}" style="width:100%;padding:9px 12px;border:2px solid var(--creme-escuro);border-radius:2px;font-family:'Inter',sans-serif;font-size:0.9rem;color:var(--preto);outline:none;background:var(--branco);">
            </div>
            <div class="field" style="margin-bottom:0.8rem;">
              <label style="font-family:'Syne',sans-serif;font-weight:700;font-size:0.72rem;color:var(--roxo-escuro);text-transform:uppercase;letter-spacing:0.06em;">Mensagem</label>
              <textarea v-model="emailCorpo" rows="4" placeholder="Escreva o conteúdo do e-mail…" style="width:100%;padding:10px 12px;background:var(--branco);border:2px solid var(--creme-escuro);border-radius:2px;font-family:'Inter',sans-serif;font-size:0.9rem;color:var(--preto);resize:vertical;outline:none;"></textarea>
            </div>
            <div style="display:flex;gap:10px;">
              <button class="btn btn-amarelo btn-sm" @click="enviarEmail">Enviar</button>
              <button class="btn btn-outline btn-sm" @click="emailAberto = false; emailAssunto = ''; emailCorpo = ''">Cancelar</button>
            </div>
          </div>
        </template>
      </div>

      <!-- Resposta ao aluno -->
      <div class="paper" style="margin-bottom:1.2rem;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.8rem;flex-wrap:wrap;gap:8px;">
          <div>
            <div style="font-family:'Syne',sans-serif;font-weight:700;font-size:0.75rem;color:var(--roxo-escuro);text-transform:uppercase;letter-spacing:0.06em;">
              💬 Resposta ao aluno
            </div>
            <div style="font-size:0.76rem;color:var(--cinza);margin-top:2px;">
              Visível para o aluno no painel dele
              <template v-if="mensagem.anonimo"> · <em>anônimo — só vê se enviou enquanto logado</em></template>
            </div>
          </div>
        </div>
        <textarea
          v-model="resposta"
          placeholder="Escreva uma resposta para o aluno…"
          rows="4"
          style="width:100%;padding:10px 12px;background:var(--branco);border:2px solid var(--creme-escuro);border-radius:2px;font-family:'Inter',sans-serif;font-size:0.9rem;color:var(--preto);resize:vertical;outline:none;transition:border-color 0.2s;"
          @focus="$event.target.style.borderColor='var(--roxo)'"
          @blur="$event.target.style.borderColor='var(--creme-escuro)'"
        ></textarea>
        <div style="margin-top:10px;text-align:right;">
          <button
            class="btn btn-outline btn-sm"
            :style="respostaSalva ? 'background:var(--verde);color:white;border-color:var(--verde);' : ''"
            @click="salvarResposta"
          >{{ respostaSalva ? '✓ Salvo' : 'Salvar resposta' }}</button>
        </div>
      </div>

      <!-- Toast de e-mail mock -->
      <Transition name="toast">
        <div v-if="notifEmailMsg" class="notif-email-toast">
          {{ notifEmailMsg }}
        </div>
      </Transition>

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
