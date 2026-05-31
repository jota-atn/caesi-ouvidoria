<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formularios, inscricoes } from '../../stores/formularios.js'
import { usuarios } from '../../stores/usuarios.js'

const route  = useRoute()
const router = useRouter()

const id = Number(route.params.id)

const inscricao  = computed(() => inscricoes.value.find(i => i.id === id))
const formulario = computed(() => inscricao.value ? formularios.value.find(f => f.id === inscricao.value.formularioId) : null)

if (!inscricao.value || !inscricao.value.certificado) router.replace('/aluno/inscricoes')

const nomeParticipante = computed(() => {
  const u = usuarios.value.find(u => u.email === inscricao.value?.userEmail)
  return u?.nome ?? inscricao.value?.respostas?.nome ?? 'Participante'
})

function formatData(data) {
  if (!data) return ''
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

function imprimir() { window.print() }
</script>

<template>
  <div class="cert-page" v-if="inscricao && formulario">
    <div class="cert-actions no-print">
      <RouterLink to="/aluno/inscricoes" class="back-link" style="color:var(--preto);opacity:0.6;">← Minhas inscrições</RouterLink>
      <button class="btn btn-amarelo btn-sm" @click="imprimir">Imprimir certificado</button>
    </div>

    <div class="cert-wrap">
      <div class="cert-border-outer">
        <div class="cert-border-inner">

          <div class="cert-header">
            <div class="cert-logo">CAESI</div>
            <div class="cert-logo-sub">Centro Acadêmico de Ciência da Computação — UFCG</div>
          </div>

          <div class="cert-title">Certificado de Participação</div>

          <p class="cert-text">Certificamos que</p>

          <div class="cert-nome">{{ nomeParticipante }}</div>

          <p class="cert-text">participou do evento</p>

          <div class="cert-evento">{{ formulario.titulo }}</div>

          <p class="cert-text" style="margin-top:2rem;">
            promovido pelo CAESI — Centro Acadêmico de Ciência da Computação da
            Universidade Federal de Campina Grande.
          </p>

          <div class="cert-footer">
            <div class="cert-data">
              Emitido em {{ formatData(inscricao.certificado.emitidoEm) }}
            </div>
            <div class="cert-assinatura">
              <div class="cert-assinatura-linha"></div>
              <div class="cert-assinatura-nome">CAESI — Gestão {{ new Date().getFullYear() }}</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style>
.cert-page {
  min-height: 100vh;
  background: var(--roxo);
  background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
  background-size: 28px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
  gap: 1.5rem;
}

.cert-actions {
  width: 100%;
  max-width: 780px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cert-wrap {
  width: 100%;
  max-width: 780px;
}

.cert-border-outer {
  background: var(--creme);
  border: 6px solid var(--roxo-escuro);
  border-radius: 2px;
  padding: 6px;
  box-shadow: 8px 8px 0 rgba(0,0,0,0.3);
}

.cert-border-inner {
  border: 2px solid var(--kraft);
  padding: 3rem 3.5rem;
  text-align: center;
}

.cert-header {
  margin-bottom: 2rem;
}

.cert-logo {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 2rem;
  color: var(--roxo-escuro);
  letter-spacing: 0.1em;
}

.cert-logo-sub {
  font-size: 0.78rem;
  color: var(--cinza);
  margin-top: 4px;
  letter-spacing: 0.04em;
}

.cert-title {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 1.8rem;
  color: var(--roxo-escuro);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 2rem;
}

.cert-text {
  font-size: 0.95rem;
  color: var(--cinza);
  margin: 0.6rem 0;
  line-height: 1.6;
}

.cert-nome {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 2.2rem;
  color: var(--preto);
  margin: 0.8rem 0;
  line-height: 1.2;
}

.cert-evento {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 1.3rem;
  color: var(--roxo-escuro);
  margin: 0.6rem 0;
}

.cert-footer {
  margin-top: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 1rem;
}

.cert-data {
  font-size: 0.82rem;
  color: var(--cinza);
  font-style: italic;
}

.cert-assinatura {
  text-align: center;
}

.cert-assinatura-linha {
  width: 180px;
  height: 1px;
  background: var(--preto);
  margin-bottom: 6px;
}

.cert-assinatura-nome {
  font-family: 'Syne', sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--preto);
  letter-spacing: 0.04em;
}

@media print {
  .no-print { display: none !important; }
  .cert-page {
    background: white;
    padding: 0;
    min-height: unset;
  }
  .cert-wrap { max-width: 100%; }
  .cert-border-outer { box-shadow: none; border-color: #333; }
}

@media (max-width: 600px) {
  .cert-border-inner { padding: 1.5rem; }
  .cert-nome { font-size: 1.5rem; }
  .cert-title { font-size: 1.3rem; }
  .cert-footer { flex-direction: column; align-items: center; }
}
</style>
