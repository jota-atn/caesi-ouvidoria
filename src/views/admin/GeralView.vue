<script setup>
import { computed } from 'vue'
import Navbar from '../../components/Navbar.vue'
import { mensagens } from '../../stores/mensagens.js'
import { usuarios } from '../../stores/usuarios.js'
import { equipe } from '../../stores/equipe.js'

const totalMensagens = computed(() => mensagens.value.length)
const pendentes      = computed(() => mensagens.value.filter(m => m.status === 'pendente').length)
const atendidas      = computed(() => mensagens.value.filter(m => m.status === 'atendida').length)

const totalUsuarios  = computed(() => usuarios.value.filter(u => u.role !== 'admin').length)
const ativos         = computed(() => usuarios.value.filter(u => u.role !== 'admin' && u.ativo !== false).length)
const inativos       = computed(() => usuarios.value.filter(u => u.role !== 'admin' && u.ativo === false).length)
</script>

<template>
  <div class="page">
    <div class="deco-star" style="top:110px;right:2%;font-size:1.2rem;opacity:0.4;">✦</div>
    <div class="deco-star" style="bottom:20%;left:1.2%;font-size:1.5rem;opacity:0.32;">✦</div>

    <Navbar :admin="true" />

    <div class="page-content" style="padding-top:2rem;">
      <div class="page-heading">
        <h2>Painel <span>Geral</span></h2>
      </div>

      <div class="geral-grid">

        <!-- Mensagens -->
        <div class="geral-card">
          <div class="geral-card-header">
            <span class="geral-card-title">Mensagens</span>
            <RouterLink to="/admin/painel" class="geral-card-link">Ver painel →</RouterLink>
          </div>
          <div class="geral-stats">
            <div class="geral-stat">
              <span class="geral-stat-num">{{ totalMensagens }}</span>
              <span class="geral-stat-label">Total</span>
            </div>
            <div class="geral-stat">
              <span class="geral-stat-num" style="color:var(--roxo);">{{ pendentes }}</span>
              <span class="geral-stat-label">Pendentes</span>
            </div>
            <div class="geral-stat">
              <span class="geral-stat-num" style="color:var(--verde);">{{ atendidas }}</span>
              <span class="geral-stat-label">Atendidas</span>
            </div>
          </div>
          <div v-if="pendentes > 0" class="geral-alerta">
            {{ pendentes }} mensagem{{ pendentes > 1 ? 's' : '' }} aguardando resposta
          </div>
          <div v-else class="geral-ok">Nenhuma mensagem pendente</div>
        </div>

        <!-- Usuários -->
        <div class="geral-card">
          <div class="geral-card-header">
            <span class="geral-card-title">Usuários</span>
            <RouterLink to="/admin/usuarios" class="geral-card-link">Gerenciar →</RouterLink>
          </div>
          <div class="geral-stats">
            <div class="geral-stat">
              <span class="geral-stat-num">{{ totalUsuarios }}</span>
              <span class="geral-stat-label">Cadastrados</span>
            </div>
            <div class="geral-stat">
              <span class="geral-stat-num" style="color:var(--verde);">{{ ativos }}</span>
              <span class="geral-stat-label">Ativos</span>
            </div>
            <div class="geral-stat">
              <span class="geral-stat-num" style="color:var(--cinza);">{{ inativos }}</span>
              <span class="geral-stat-label">Inativos</span>
            </div>
          </div>
          <div v-if="inativos > 0" class="geral-alerta">
            {{ inativos }} conta{{ inativos > 1 ? 's' : '' }} desativada{{ inativos > 1 ? 's' : '' }}
          </div>
          <div v-else class="geral-ok">Todos os usuários ativos</div>
        </div>

        <!-- Equipe -->
        <div class="geral-card">
          <div class="geral-card-header">
            <span class="geral-card-title">Equipe</span>
            <RouterLink to="/admin/equipe" class="geral-card-link">Editar →</RouterLink>
          </div>
          <div class="geral-equipe-lista">
            <div v-for="d in equipe" :key="d.diretoria" class="geral-equipe-item">
              <span class="geral-equipe-dir">{{ d.diretoria }}</span>
              <span class="geral-equipe-nome" :class="{ vazio: !d.presidente }">
                {{ d.presidente || 'Não definido' }}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
