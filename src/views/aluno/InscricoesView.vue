<script setup>
import { computed } from 'vue'
import Navbar from '../../components/Navbar.vue'
import { formularios, inscricoes } from '../../stores/formularios.js'
import { user } from '../../stores/auth.js'

const TIPO_LABEL = {
  'evento-com-certificado': 'Evento c/ Certificado',
  'evento-sem-certificado': 'Evento s/ Certificado',
  venda: 'Venda',
  arrecadacao: 'Arrecadação',
}

const COMP_LABEL = {
  pendente:  'Aguardando validação',
  validado:  'Pagamento confirmado',
  arquivado: 'Confirmado',
}

function getFormulario(formularioId) {
  return formularios.value.find(f => f.id === formularioId) ?? null
}

function formatData(data) {
  if (!data) return ''
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

function formatValor(valor) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

const minhasInscricoes = computed(() =>
  inscricoes.value
    .filter(i => i.userEmail === user.value?.email)
    .slice()
    .reverse()
)

const pagamentosPendentes = computed(() =>
  minhasInscricoes.value.filter(i => i.comprovante?.status === 'pendente').length
)
</script>

<template>
  <div class="page">
    <div class="deco-star" style="top:110px;right:2%;font-size:1.2rem;opacity:0.4;">✦</div>
    <div class="deco-star" style="bottom:20%;left:1.2%;font-size:1.5rem;opacity:0.32;">✦</div>

    <Navbar />

    <div class="page-content">
      <div class="page-heading">
        <h2>Minhas <span>Inscrições</span></h2>
      </div>

      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-number">{{ minhasInscricoes.length }}</div>
          <div class="stat-label">Total</div>
        </div>
        <div class="stat-card stat-card--amarelo">
          <div class="stat-number stat-number--roxo">{{ pagamentosPendentes }}</div>
          <div class="stat-label">Pagamentos pendentes</div>
        </div>
        <div class="stat-card stat-card--verde">
          <div class="stat-number stat-number--verde">
            {{ minhasInscricoes.filter(i => !i.comprovante || ['validado','arquivado'].includes(i.comprovante.status)).length }}
          </div>
          <div class="stat-label">Confirmadas</div>
        </div>
      </div>

      <template v-for="inscricao in minhasInscricoes" :key="inscricao.id">
        <RouterLink
          :to="`/aluno/formularios/${inscricao.formularioId}`"
          class="form-card aberto"
          v-if="getFormulario(inscricao.formularioId)"
        >
          <div class="form-card-info">
            <div class="form-card-tags">
              <span class="tipo-tag" :class="`tipo-${getFormulario(inscricao.formularioId).tipo}`">
                {{ TIPO_LABEL[getFormulario(inscricao.formularioId).tipo] }}
              </span>
              <span v-if="inscricao.comprovante" class="comp-badge" :class="`comp-${inscricao.comprovante.status}`">
                {{ COMP_LABEL[inscricao.comprovante.status] }}
              </span>
              <span v-else class="comp-badge comp-validado">Gratuito</span>
            </div>
            <div class="form-card-title">{{ getFormulario(inscricao.formularioId).titulo }}</div>
            <div class="form-card-meta">
              <span>Inscrito em {{ formatData(inscricao.criadoEm) }}</span>
              <template v-if="inscricao.comprovante && inscricao.comprovante.status !== 'arquivado'">
                <span>·</span>
                <span style="font-size:0.78rem;">{{ inscricao.comprovante.nome }}</span>
              </template>
            </div>
            <div v-if="inscricao.certificado" style="margin-top:8px;">
              <RouterLink
                :to="`/aluno/certificado/${inscricao.id}`"
                class="btn btn-amarelo btn-sm"
                style="text-decoration:none;display:inline-flex;"
                @click.stop
              >Ver certificado</RouterLink>
            </div>
          </div>
          <div class="form-card-right">
            <span class="msg-card-arrow">→</span>
          </div>
        </RouterLink>
      </template>

      <div v-if="minhasInscricoes.length === 0" class="empty-state">
        <p>Você ainda não se inscreveu em nenhum formulário.</p>
        <RouterLink to="/aluno/formularios" class="btn btn-amarelo btn-sm" style="margin-top:1rem;">
          Ver formulários disponíveis
        </RouterLink>
      </div>
    </div>
  </div>
</template>
