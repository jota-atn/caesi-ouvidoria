<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import Navbar from '../../components/Navbar.vue'
import { formularios, inscricoes, addInscricao, cancelarInscricaoDireta, solicitarCancelamento } from '../../stores/formularios.js'
import { user } from '../../stores/auth.js'
import { showToast } from '../../stores/toast.js'
import { useEscapeKey } from '../../composables/useEscapeKey.js'

const route  = useRoute()
const router = useRouter()

const id = Number(route.params.id)
const formulario = computed(() => formularios.value.find(f => f.id === id))

if (!formulario.value) router.replace('/aluno/formularios')

function voltarOuFormularios() {
  if (window.history.state?.back) {
    router.back()
  } else {
    router.push('/aluno/formularios')
  }
}

const TIPO_LABEL = {
  'evento-com-certificado': 'Evento c/ Certificado',
  'evento-sem-certificado': 'Evento s/ Certificado',
  venda: 'Venda',
  arrecadacao: 'Arrecadação',
}

function prazoExpirado(prazo) {
  if (!prazo) return false
  return new Date(prazo + 'T23:59:59') < new Date()
}

const inscricoesDaForm = computed(() =>
  inscricoes.value.filter(i => i.formularioId === id).length
)

const vagasEsgotadas = computed(() =>
  formulario.value?.limiteVagas != null &&
  inscricoesDaForm.value >= formulario.value.limiteVagas
)

const disponivel = computed(() =>
  formulario.value?.status === 'aberto' &&
  !prazoExpirado(formulario.value?.prazoInscricao) &&
  !vagasEsgotadas.value
)

const motivoBloqueio = computed(() => {
  if (formulario.value?.status !== 'aberto') return 'Este formulário está encerrado.'
  if (prazoExpirado(formulario.value?.prazoInscricao)) return 'O prazo de inscrição já encerrou.'
  if (vagasEsgotadas.value) return 'As vagas para este formulário já foram preenchidas.'
  return null
})

const jaInscrito = computed(() =>
  inscricoes.value.some(i => i.formularioId === id && i.userEmail === user.value?.email)
)

function formatData(data) {
  if (!data) return ''
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

function formatValor(valor) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

// ── Estado do formulário de resposta ────────────────────
function valorInicial(campo) {
  if (campo.tipo === 'checkbox') return false
  const label = campo.label.toLowerCase()
  if (label.includes('nome'))                              return user.value?.nome      ?? ''
  if (label.includes('matrícula') || label.includes('matricula')) return user.value?.matricula ?? ''
  if (label.includes('e-mail')    || label.includes('email'))     return user.value?.email     ?? ''
  return ''
}

const respostas = ref(
  Object.fromEntries(
    (formulario.value?.campos ?? []).map(c => [c.id, valorInicial(c)])
  )
)
const quantidade     = ref(1)
const comprovanteNome = ref('')
const fileInputRef   = ref(null)
const submitError    = ref('')

const totalEstimado = computed(() => {
  if (formulario.value?.tipo !== 'venda' || !formulario.value.pago) return null
  return formulario.value.valor * (Number(quantidade.value) || 0)
})

function onFileChange(e) {
  const file = e.target.files?.[0]
  comprovanteNome.value = file ? file.name : ''
}

const hasInteracted = ref(false)
watch(respostas,       () => { hasInteracted.value = true }, { deep: true })
watch(comprovanteNome, () => { hasInteracted.value = true })
watch(quantidade,      () => { hasInteracted.value = true })

onBeforeRouteLeave(() => {
  if (!jaInscrito.value && hasInteracted.value) {
    return window.confirm('Você tem dados preenchidos neste formulário. Deseja sair sem se inscrever?')
  }
})

// ── Cancelamento de inscrição ─────────────────────────────
const minhaInscricao = computed(() =>
  inscricoes.value.find(i => i.formularioId === id && i.userEmail === user.value?.email)
)

function podeCancelarDireto(insc) {
  if (!insc || formulario.value?.tipo === 'arrecadacao') return false
  if (formulario.value?.pago) return false
  if (insc.cancelamento?.solicitado || insc.certificado) return false
  if (formulario.value?.prazoInscricao && new Date(formulario.value.prazoInscricao + 'T23:59:59') < new Date()) return false
  return true
}

function podeSolicitar(insc) {
  if (!insc || formulario.value?.tipo === 'arrecadacao') return false
  if (!formulario.value?.pago) return false
  if (insc.cancelamento?.solicitado || insc.certificado) return false
  return true
}

const modalCancelarDireto = ref(false)
const modalSolicitarCancel = ref(false)
const motivoCancelamento = ref('')

useEscapeKey(() => {
  if (modalCancelarDireto.value) { modalCancelarDireto.value = false; return }
  if (modalSolicitarCancel.value) { modalSolicitarCancel.value = false }
})

function confirmarCancelamentoDireto() {
  if (!minhaInscricao.value) return
  cancelarInscricaoDireta(minhaInscricao.value.id)
  modalCancelarDireto.value = false
  showToast('Inscrição cancelada.')
}

function confirmarSolicitarCancel() {
  if (!minhaInscricao.value) return
  solicitarCancelamento(minhaInscricao.value.id, motivoCancelamento.value)
  modalSolicitarCancel.value = false
  motivoCancelamento.value = ''
  showToast('Solicitação enviada. O CAESI vai te notificar da decisão.', 'info')
}

function submitForm() {
  submitError.value = ''

  for (const campo of formulario.value.campos) {
    if (campo.obrigatorio) {
      const val = respostas.value[campo.id]
      if (val === '' || val === null || val === undefined || val === false) {
        submitError.value = `O campo "${campo.label}" é obrigatório.`
        return
      }
    }
  }

  if (formulario.value.tipo === 'venda' && (!quantidade.value || Number(quantidade.value) < 1)) {
    submitError.value = 'Informe uma quantidade válida.'
    return
  }

  if (formulario.value.pago && !comprovanteNome.value) {
    submitError.value = 'Anexe o comprovante de pagamento.'
    return
  }

  const todasRespostas = { ...respostas.value }
  if (formulario.value.tipo === 'venda') {
    todasRespostas.__quantidade = Number(quantidade.value)
  }

  const comprovante = formulario.value.pago
    ? { nome: comprovanteNome.value, url: null }
    : null

  const result = addInscricao(id, user.value.email, todasRespostas, comprovante)
  if (result.error) {
    submitError.value = result.error
    return
  }

  router.push('/aluno/inscricoes')
}
</script>

<template>
  <div class="page" v-if="formulario">
    <div class="deco-star" style="top:110px;right:2%;font-size:1.2rem;opacity:0.38;">✦</div>

    <Navbar />

    <div class="page-content">
      <button class="back-link" @click="voltarOuFormularios">← Voltar</button>

      <!-- Cabeçalho -->
      <div class="paper paper-mb">
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:1rem;">
          <span class="tipo-tag" :class="`tipo-${formulario.tipo}`">{{ TIPO_LABEL[formulario.tipo] }}</span>
          <span v-if="!disponivel" class="form-status-badge form-status-encerrado">
            {{ formulario.status === 'encerrado' ? 'Encerrado' : 'Prazo esgotado' }}
          </span>
        </div>

        <h1 class="msg-title">{{ formulario.titulo }}</h1>
        <p style="font-size:0.93rem;color:var(--cinza);line-height:1.6;margin-bottom:1.2rem;">{{ formulario.descricao }}</p>

        <hr class="divider">

        <div class="msg-meta">
          <div v-if="formulario.prazoInscricao" class="msg-meta-item">
            <span class="msg-meta-label">Prazo:</span> {{ formatData(formulario.prazoInscricao) }}
          </div>
          <div class="msg-meta-item">
            <span class="msg-meta-label">Pagamento:</span>
            {{ formulario.pago ? formatValor(formulario.valor) + (formulario.tipo === 'venda' ? ' / unidade' : ' / pessoa') : 'Gratuito' }}
          </div>
          <div v-if="formulario.limiteVagas" class="msg-meta-item">
            <span class="msg-meta-label">Vagas:</span>
            <span :style="vagasEsgotadas ? 'color:var(--vermelho);font-weight:600;' : ''">
              {{ inscricoesDaForm }}/{{ formulario.limiteVagas }}
            </span>
          </div>
        </div>
      </div>

      <!-- Já inscrito -->
      <div v-if="jaInscrito" class="paper">
        <div class="alert-atendida">
          <span style="font-size:1.6rem;">✓</span>
          <div>
            <div class="alert-atendida-title">Você já está inscrito neste formulário</div>
            <div class="alert-atendida-sub">
              <RouterLink to="/aluno/inscricoes" style="color:var(--roxo-escuro);font-weight:600;">
                Ver minhas inscrições →
              </RouterLink>
            </div>
          </div>
        </div>

        <template v-if="minhaInscricao">
          <hr class="divider" style="margin:1.2rem 0;">
          <div v-if="podeCancelarDireto(minhaInscricao)">
            <button class="btn btn-danger btn-sm" @click="modalCancelarDireto = true">Cancelar inscrição</button>
          </div>
          <div v-else-if="podeSolicitar(minhaInscricao)">
            <button class="btn btn-outline btn-sm" @click="modalSolicitarCancel = true; motivoCancelamento = ''">Solicitar cancelamento</button>
          </div>
          <div v-else-if="minhaInscricao.cancelamento?.solicitado">
            <span class="cancelamento-badge">Cancelamento solicitado</span>
          </div>
        </template>
      </div>

      <!-- Indisponível (encerrado / prazo / vagas) -->
      <div v-else-if="!disponivel" class="paper">
        <div class="alert-erro" style="margin-bottom:0;">
          {{ motivoBloqueio }}
        </div>
      </div>

      <!-- Formulário de resposta -->
      <div v-else class="paper">
        <p class="label-sm" style="margin-bottom:1.5rem;">Preencha os dados abaixo</p>

        <form @submit.prevent="submitForm" novalidate>

          <!-- Campo de quantidade (venda) -->
          <div v-if="formulario.tipo === 'venda'" class="field">
            <label>Quantidade *</label>
            <input v-model.number="quantidade" type="number" min="1" step="1" placeholder="1" style="max-width:120px;">
            <div v-if="totalEstimado !== null" class="total-estimado">
              <span class="total-estimado-label">Total estimado</span>
              <span class="total-estimado-valor">{{ formatValor(totalEstimado) }}</span>
            </div>
          </div>

          <!-- Campos dinâmicos -->
          <template v-for="campo in formulario.campos" :key="campo.id">
            <div class="field">
              <template v-if="campo.tipo === 'checkbox'">
                <label class="check-anon">
                  <input type="checkbox" v-model="respostas[campo.id]">
                  <span class="check-anon-label">
                    {{ campo.label }}
                    <span v-if="campo.obrigatorio" style="color:var(--vermelho);"> *</span>
                  </span>
                </label>
              </template>
              <template v-else>
                <label>
                  {{ campo.label }}
                  <span v-if="campo.obrigatorio" style="color:var(--vermelho);"> *</span>
                </label>
                <input
                  v-if="campo.tipo === 'texto'"
                  v-model="respostas[campo.id]"
                  type="text"
                  :placeholder="campo.label"
                >
                <input
                  v-else-if="campo.tipo === 'numero'"
                  v-model.number="respostas[campo.id]"
                  type="number"
                >
                <select v-else-if="campo.tipo === 'select'" v-model="respostas[campo.id]">
                  <option value="" disabled>Selecione...</option>
                  <option v-for="op in campo.opcoes" :key="op" :value="op">{{ op }}</option>
                </select>
              </template>
            </div>
          </template>

          <!-- Upload de comprovante (formulários pagos) -->
          <div v-if="formulario.pago" class="field">
            <label>Comprovante de pagamento *</label>
            <input ref="fileInputRef" type="file" accept="image/*,.pdf" style="display:none;" @change="onFileChange">
            <div
              class="comprovante-area"
              :class="{ 'has-file': comprovanteNome }"
              @click="fileInputRef.click()"
            >
              <template v-if="comprovanteNome">
                <div class="comprovante-filename">{{ comprovanteNome }}</div>
                <p>Clique para trocar o arquivo</p>
              </template>
              <template v-else>
                <p style="margin-bottom:4px;">Clique para anexar o comprovante</p>
                <p style="font-size:0.78rem;">Imagem ou PDF</p>
              </template>
            </div>
          </div>

          <div v-if="submitError" class="alert-erro">{{ submitError }}</div>

          <div class="btn-row" style="margin-top:1.5rem;">
            <button type="submit" class="btn btn-amarelo">
              {{ formulario.pago ? 'Enviar inscrição e comprovante' : 'Confirmar inscrição' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Modal: cancelamento direto -->
  <Teleport to="body">
    <div v-if="modalCancelarDireto" class="modal-overlay" @click.self="modalCancelarDireto = false">
      <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="mdireto-title" v-focus-trap>
        <div class="modal-title" id="mdireto-title">Cancelar inscrição</div>
        <div class="modal-body">
          <p>Tem certeza que deseja cancelar sua inscrição em <strong>{{ formulario?.titulo }}</strong>?</p>
          <p v-if="formulario?.limiteVagas" style="margin-top:8px;padding:8px 10px;background:rgba(210,80,40,0.08);border-radius:2px;border-left:3px solid #C04020;">
            Atenção: se houver limite de vagas, pode não haver disponibilidade caso queira se inscrever novamente.
          </p>
        </div>
        <div class="modal-actions">
          <button class="btn btn-outline btn-sm" @click="modalCancelarDireto = false">Voltar</button>
          <button class="btn btn-danger btn-sm" @click="confirmarCancelamentoDireto">Confirmar cancelamento</button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Modal: solicitar cancelamento (pago) -->
  <Teleport to="body">
    <div v-if="modalSolicitarCancel" class="modal-overlay" @click.self="modalSolicitarCancel = false">
      <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="msolicitar-title" v-focus-trap>
        <div class="modal-title" id="msolicitar-title">Solicitar cancelamento</div>
        <div class="modal-body">
          <p>Sua solicitação será analisada pela gestão do CAESI. Você será notificado da decisão.</p>
          <p style="margin-top:6px;">Para cancelamentos com reembolso, a gestão entrará em contato com as instruções.</p>
        </div>
        <div class="field" style="margin-bottom:1.2rem;">
          <label style="font-size:0.84rem;font-weight:600;margin-bottom:4px;display:block;">
            Motivo <span style="font-weight:400;color:var(--cinza);">(opcional)</span>
          </label>
          <textarea v-model="motivoCancelamento" rows="3" placeholder="Descreva o motivo da desistência..." style="width:100%;min-height:76px;" />
        </div>
        <div class="modal-actions">
          <button class="btn btn-outline btn-sm" @click="modalSolicitarCancel = false">Voltar</button>
          <button class="btn btn-danger btn-sm" @click="confirmarSolicitarCancel">Enviar solicitação</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
