<script setup>
import { ref } from 'vue'
import Navbar from '../components/Navbar.vue'
import SiteFooter from '../components/SiteFooter.vue'
import CalendarioSecao from '../components/CalendarioSecao.vue'
import MapaSecao from '../components/MapaSecao.vue'

// ── Imports do Sobre o CAESI (Equipe e Ícones) ───────
import { admins, descricaoGestao, gestaoInfo, periodoFormatado, historicoGestoes, historicoVisivel } from '../stores/equipe.js'
import mapPinIcon from '../assets/icons/map-pin.svg?raw'
import mailIcon from '../assets/icons/mail.svg?raw'
import instagramIcon from '../assets/icons/instagram.svg?raw'

// ── Lógica da Seção Sobre (Carrossel de Equipe e Histórico) ───────
const expandido = ref(null)
function toggleGestao(id) { expandido.value = expandido.value === id ? null : id }

const equipeCarrosselEl = ref(null)
function equipeScrollBy(dir) {
  const el = equipeCarrosselEl.value
  if (!el) return
  const card = el.querySelector('.membro-card')
  const passo = card ? card.offsetWidth + 16 : 200
  el.scrollBy({ left: dir * passo, behavior: 'smooth' })
}

// ── Lógica do Carrossel do Instagram ───────
const instaScrollEl = ref(null)
const instaDragging = ref(false)
let instaStartX = 0
let instaScrollStart = 0
let instaMoved = false

function instaScrollBy(dir) {
  const el = instaScrollEl.value
  if (!el) return
  const card = el.querySelector('.insta-card')
  const passo = card ? card.offsetWidth + 16 : 260
  const maxScroll = el.scrollWidth - el.clientWidth

  if (dir > 0 && el.scrollLeft >= maxScroll - 20) {
    el.scrollTo({ left: 0, behavior: 'smooth' })
    return
  }
  if (dir < 0 && el.scrollLeft <= 20) {
    el.scrollTo({ left: maxScroll, behavior: 'smooth' })
    return
  }
  el.scrollBy({ left: dir * passo, behavior: 'smooth' })
}

function instaDragStart(e) {
  if (!instaScrollEl.value) return
  instaDragging.value = true
  instaMoved = false
  instaStartX = e.pageX
  instaScrollStart = instaScrollEl.value.scrollLeft
}
function instaDragMove(e) {
  if (!instaDragging.value) return
  const dx = e.pageX - instaStartX
  if (Math.abs(dx) > 4) instaMoved = true
  instaScrollEl.value.scrollLeft = instaScrollStart - dx
}
function instaDragEnd() { instaDragging.value = false }
function instaClickGuard(e) { if (instaMoved) { e.preventDefault(); instaMoved = false } }

const posts = [
  { cor: 'rgba(80,64,160,0.28)',  icon: '📢', caption: 'Semana de Boas-Vindas 2026! Recepção aos calouros de CC — sábado, 8h, no SPLAB. Venha com a galera!', data: '12 mai' },
  { cor: 'rgba(245,197,66,0.32)', icon: '🏆', caption: 'Parabéns ao time que representou a UFCG na Maratona de Programação ICPC! Orgulho do CAESI.', data: '3 mai' },
  { cor: 'rgba(78,170,119,0.28)', icon: '📌', caption: 'Seletivo CAESI 2026.1 aberto! Inscrições até 15/02. Venha fazer parte da gestão.', data: '28 abr' },
  { cor: 'rgba(217,85,85,0.22)',  icon: '🎓', caption: 'Formatura 2025.2 — celebrando mais uma turma de bacharéis em Ciência da Computação pela UFCG!', data: '10 abr' },
  { cor: 'rgba(40,160,140,0.28)', icon: '💡', caption: 'Palestra: IA Generativa na Prática. Quinta-feira, 14h, auditório da CEEI. Entrada franca.', data: '2 abr' },
  { cor: 'rgba(180,80,160,0.22)', icon: '🤝', caption: 'Feira de Estágios CAESI — conheça oportunidades em empresas parceiras. Próxima semana!', data: '24 mar' },
]
</script>

<template>
  <div class="page">
    <div class="deco-star" style="top:160px;right:2%;font-size:1.4rem;opacity:0.35;">✦</div>
    <div class="deco-star" style="top:420px;left:1.5%;font-size:0.9rem;opacity:0.25;">✦</div>
    <div class="deco-star" style="top:750px;right:3%;font-size:1.1rem;opacity:0.3;">✦</div>

    <Navbar />

    <!-- 1. Hero / Cabeçalho e Destaque da Ouvidoria -->
    <section class="hero" style="padding-bottom: 4rem;">
      <div class="hero-logo">
        <img src="/logo_caesi.png" alt="CAESI" style="width:100%;height:100%;object-fit:cover;display:block;">
      </div>
      <h1 class="hero-title">CAESI <span>UFCG</span></h1>
      <p class="hero-sub" style="margin-bottom: 0;">
        Centro Acadêmico de Ciência da Computação da UFCG.<br>
        Acompanhe nossos avisos, conheça a gestão e acesse nossos serviços.
      </p>
      
      <!-- Novo Destaque Visual para Ouvidoria -->
      <div style="margin-top: 3.5rem; padding: 2.5rem 1.5rem; background: var(--creme); border-radius: 4px; box-shadow: 6px 6px 0 rgba(0,0,0,0.3); max-width: 600px; margin-left: auto; margin-right: auto; text-align: center; border: 2px solid var(--amarelo);">
        <h2 style="font-family: 'Archivo Black', sans-serif; font-size: 1.5rem; color: var(--roxo-escuro); margin-bottom: 0.5rem; text-transform: uppercase;">
          Precisa do CAESI?
        </h2>
        <p style="color: var(--preto); font-size: 0.95rem; margin-bottom: 1.8rem; line-height: 1.6;">
          Acesse nossa <strong>Ouvidoria</strong>. Um canal seguro, direto e confidencial para enviar denúncias, reclamações, sugestões ou dúvidas com a representação estudantil.
        </p>
        <RouterLink to="/ouvidoria" class="btn btn-primary" style="font-size: 1.15rem; padding: 16px 36px; text-transform: uppercase;">
          Acessar Ouvidoria →
        </RouterLink>
      </div>
    </section>

    <!-- 2. SOBRE O CAESI (Unificada) -->
    <section class="home-section" id="sobre" style="scroll-margin-top: 80px;">
      <div class="section-label">Quem somos</div>
      <h2 class="section-title">Sobre o <span>CAESI</span></h2>

      <div class="paper" style="margin-bottom: 2rem;">
        <h3 style="font-family: 'Archivo Black', sans-serif; font-size: 1.1rem; color: var(--roxo-escuro); margin-bottom: 1rem;">Missão</h3>
        <p style="font-size:0.95rem;color:var(--preto);line-height:1.75;margin-bottom:0;">
          O CAESI, Centro Acadêmico de Ciência da Computação, é a entidade estudantil
          que representa os alunos do curso de Ciência da Computação da UFCG. Nossa missão é defender
          os direitos e interesses dos estudantes, promover a integração acadêmica e facilitar a comunicação
          entre o corpo discente e a instituição.
        </p>
      </div>

      <!-- Gestão Atual -->
      <div class="paper" style="margin-bottom: 2rem;">
        <div class="gestao-header">
          <div>
            <h3 style="font-family: 'Archivo Black', sans-serif; font-size: 1.1rem; color: var(--roxo-escuro); margin-bottom: 0;">Gestão atual</h3>
            <div v-if="gestaoInfo.nomeChapa" class="chapa-nome">{{ gestaoInfo.nomeChapa }}</div>
          </div>
          <div v-if="periodoFormatado" class="chapa-periodo">{{ periodoFormatado }}</div>
        </div>
        <div v-if="admins.length === 0" style="font-size:0.9rem;color:var(--cinza);padding:0.5rem 0;">
          Nenhum administrador cadastrado ainda.
        </div>
        <div
          v-else
          ref="equipeCarrosselEl"
          class="equipe-carrossel"
          tabindex="0"
          role="region"
          aria-label="Carrossel de membros da gestão"
          @keydown.left="equipeScrollBy(-1)"
          @keydown.right="equipeScrollBy(1)"
        >
          <div v-for="a in admins" :key="a.id" class="membro-card">
            <div class="membro-avatar">
              <img v-if="a.foto" :src="a.foto" :alt="a.nome" class="membro-foto">
              <span v-else class="membro-inicial">{{ a.nome?.[0]?.toUpperCase() || '?' }}</span>
            </div>
            <div class="membro-nome">{{ a.nome }}</div>
            <div v-if="a.diretoria" class="membro-periodo">{{ a.diretoria }}</div>
            <div v-else-if="a.periodo" class="membro-periodo">{{ a.periodo }}</div>
            <div v-if="a.email" class="membro-email">{{ a.email }}</div>
            <div v-if="a.descricao" class="membro-desc">{{ a.descricao }}</div>
            <div v-if="a.linkedin || a.git || a.lattes" class="membro-links">
              <a v-if="a.linkedin" :href="a.linkedin" target="_blank" rel="noopener" class="membro-link">LinkedIn</a>
              <a v-if="a.git"      :href="a.git"      target="_blank" rel="noopener" class="membro-link">GitHub</a>
              <a v-if="a.lattes"   :href="a.lattes"   target="_blank" rel="noopener" class="membro-link">Lattes</a>
            </div>
          </div>
        </div>

        <div v-if="descricaoGestao" class="gestao-desc">
          <div class="label-sm" style="margin-bottom:0.6rem;">Sobre a gestão</div>
          <p class="gestao-texto">{{ descricaoGestao }}</p>
        </div>
      </div>

      <!-- Gestões Anteriores -->
      <div v-if="historicoVisivel && historicoGestoes.length" class="paper" style="margin-bottom: 2rem;">
        <h3 style="font-family: 'Archivo Black', sans-serif; font-size: 1.1rem; color: var(--roxo-escuro); margin-bottom: 1.2rem;">Gestões anteriores</h3>
        <div class="hist-lista">
          <div v-for="g in historicoGestoes" :key="g.id" class="hist-item">
            <button class="hist-header" @click="toggleGestao(g.id)">
              <div class="hist-header-info">
                <span class="hist-chapa">{{ g.nomeChapa }}</span>
                <span v-if="g.periodo" class="hist-periodo">{{ g.periodo }}</span>
              </div>
              <span class="hist-chevron" :class="{ aberto: expandido === g.id }">▾</span>
            </button>
            <div v-if="expandido === g.id" class="hist-body">
              <p v-if="g.descricao" class="hist-desc">{{ g.descricao }}</p>
              <div v-if="g.membros?.length" class="hist-membros">
                <div v-for="m in g.membros" :key="m.nome + m.diretoria" class="hist-membro">
                  <div class="hist-membro-avatar">
                    <img v-if="m.foto" :src="m.foto" :alt="m.nome" class="hist-membro-foto">
                    <span v-else class="hist-membro-inicial">{{ m.nome?.[0]?.toUpperCase() || '?' }}</span>
                  </div>
                  <div v-if="m.diretoria" class="label-sm" style="margin-bottom:2px;">{{ m.diretoria }}</div>
                  <div style="font-size:0.88rem;font-weight:600;color:var(--preto);">{{ m.nome }}</div>
                  <div v-if="m.periodo" style="font-size:0.76rem;color:var(--cinza);">{{ m.periodo }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contato / Onde encontrar -->
      <div class="paper">
        <h3 style="font-family: 'Archivo Black', sans-serif; font-size: 1.1rem; color: var(--roxo-escuro); margin-bottom: 1rem;">Onde nos encontrar</h3>
        <div style="display:flex;flex-direction:column;gap:0.75rem;">
          <div style="display:flex;align-items:center;gap:10px;font-size:0.92rem;color:var(--preto);">
            <span v-html="mapPinIcon" style="display:flex;flex-shrink:0;color:var(--roxo-escuro);width:17px;height:17px;"></span>
            Sala do CAESI — Bloco CP, UFCG, Campina Grande – PB
          </div>
          <div style="display:flex;align-items:center;gap:10px;font-size:0.92rem;">
            <span v-html="mailIcon" style="display:flex;flex-shrink:0;color:var(--roxo-escuro);width:17px;height:17px;"></span>
            <a href="mailto:caesi@ccc.ufcg.edu.br"
              style="color:var(--roxo-escuro);font-weight:600;text-decoration:none;">caesi@ccc.ufcg.edu.br</a>
          </div>
          <div style="display:flex;align-items:center;gap:10px;font-size:0.92rem;color:var(--preto);">
            <span v-html="instagramIcon" style="display:flex;flex-shrink:0;color:var(--roxo-escuro);width:17px;height:17px;"></span>
            <a href="https://instagram.com/caesiufcg" target="_blank" rel="noopener"
              style="color:var(--roxo-escuro);font-weight:600;text-decoration:none;">@caesiufcg</a>&nbsp;no Instagram
          </div>
        </div>
      </div>
    </section>

    <!-- 3. Instagram -->
    <section class="home-section">
      <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:2rem;flex-wrap:wrap;gap:12px;">
        <div>
          <div class="section-label">Redes sociais</div>
          <h2 class="section-title" style="margin-bottom:0;">Últimas do <span>Instagram</span></h2>
        </div>
        <a href="https://instagram.com/caesiufcg" target="_blank" rel="noopener"
          class="btn btn-outline btn-sm btn-outline-creme">
          Ver perfil →
        </a>
      </div>
      <div class="insta-carrossel">
        <button class="insta-nav-btn insta-nav-btn--prev" aria-label="Posts anteriores" @click="instaScrollBy(-1)">&lt;</button>

        <div
          ref="instaScrollEl"
          class="insta-grid"
          :class="{ 'insta-grid--arrastando': instaDragging }"
          tabindex="0"
          role="region"
          aria-label="Carrossel de posts do Instagram"
          @mousedown="instaDragStart"
          @mousemove="instaDragMove"
          @mouseup="instaDragEnd"
          @mouseleave="instaDragEnd"
          @keydown.left="instaScrollBy(-1)"
          @keydown.right="instaScrollBy(1)"
        >
          <a v-for="(post, i) in posts" :key="i"
            href="https://instagram.com/caesiufcg" target="_blank" rel="noopener"
            class="insta-card"
            @click="instaClickGuard"
            @dragstart.prevent>
            <div class="insta-thumb" :style="{ background: post.cor }">{{ post.icon }}</div>
            <div class="insta-caption">{{ post.caption }}</div>
            <div class="insta-date">{{ post.data }}</div>
          </a>
        </div>

        <button class="insta-nav-btn insta-nav-btn--next" aria-label="Próximos posts" @click="instaScrollBy(1)">&gt;</button>
      </div>
    </section>

    <!-- 4. Calendário -->
    <div id="calendario" style="scroll-margin-top: 80px;">
      <CalendarioSecao />
    </div>

    <!-- 5. Mapa do campus -->
    <MapaSecao />

    <SiteFooter />
  </div>
</template>

<style scoped>
/* Estilos herdados da antiga página SobreView */
.equipe-carrossel {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 0.5rem;
}
.equipe-carrossel::-webkit-scrollbar { height: 4px; }
.equipe-carrossel::-webkit-scrollbar-track { background: var(--creme-escuro); border-radius: 2px; }
.equipe-carrossel::-webkit-scrollbar-thumb { background: var(--roxo); border-radius: 2px; }

.membro-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: var(--branco);
  border: 1.5px solid var(--creme-escuro);
  border-radius: 2px;
  padding: 1.2rem 0.8rem 1rem;
  gap: 0.35rem;
  flex: 0 0 180px;
  scroll-snap-align: start;
}

.membro-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 0.6rem;
  flex-shrink: 0;
  background: var(--roxo-escuro);
  display: flex;
  align-items: center;
  justify-content: center;
}

.membro-foto { width: 100%; height: 100%; object-fit: cover; }

.membro-inicial {
  font-family: 'Archivo Black', sans-serif;
  font-weight: 800;
  font-size: 1.6rem;
  color: var(--creme);
  line-height: 1;
}

.membro-nome { font-size: 0.9rem; font-weight: 600; color: var(--preto); line-height: 1.3; }

.membro-periodo {
  font-size: 0.69rem;
  font-weight: 700;
  font-family: 'Archivo Black', sans-serif;
  padding: 2px 7px;
  border-radius: 2px;
  background: rgba(80,64,160,0.1);
  color: var(--roxo-escuro);
  border: 1px solid rgba(80,64,160,0.22);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-top: 4px;
}

.membro-email { font-size: 0.76rem; color: var(--cinza); margin-top: 4px; word-break: break-all; }
.membro-desc { font-size: 0.78rem; color: var(--preto); opacity: 0.65; line-height: 1.5; margin-top: 6px; text-align: center; }

.membro-links { display: flex; gap: 5px; flex-wrap: wrap; justify-content: center; margin-top: 8px; }

.membro-link {
  font-size: 0.67rem;
  font-weight: 700;
  font-family: 'Archivo Black', sans-serif;
  padding: 2px 7px;
  border-radius: 2px;
  border: 1.5px solid var(--roxo);
  color: var(--roxo-escuro);
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  transition: background 0.15s, color 0.15s;
}
.membro-link:hover { background: var(--roxo); color: var(--creme); }

.gestao-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 1.4rem; }
.chapa-nome { font-family: 'Archivo Black', sans-serif; font-size: 1.1rem; font-weight: 800; color: var(--roxo); margin-top: 4px; }
.chapa-periodo { font-size: 0.8rem; font-weight: 600; color: var(--cinza); background: var(--branco); border: 1.5px solid var(--creme-escuro); border-radius: 2px; padding: 4px 10px; white-space: nowrap; flex-shrink: 0; align-self: center; }

.gestao-desc { margin-top: 1.6rem; padding-top: 1.4rem; border-top: 1.5px solid var(--creme-escuro); }
.gestao-texto { font-size: 0.95rem; color: var(--preto); line-height: 1.8; white-space: pre-line; margin: 0; }

.hist-lista { display: flex; flex-direction: column; gap: 0.5rem; }
.hist-item { border: 1.5px solid var(--creme-escuro); border-radius: 2px; overflow: hidden; }

.hist-header {
  width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  padding: 12px 16px; background: var(--branco); border: none; cursor: pointer; text-align: left; transition: background 0.15s;
}
.hist-header:hover { background: rgba(80,64,160,0.04); }

.hist-header-info { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
.hist-chapa { font-size: 0.92rem; font-weight: 700; color: var(--roxo-escuro); }
.hist-periodo { font-size: 0.78rem; color: var(--cinza); }

.hist-chevron { font-size: 1.1rem; color: var(--cinza); flex-shrink: 0; transition: transform 0.2s; line-height: 1; }
.hist-chevron.aberto { transform: rotate(180deg); }

.hist-body { padding: 1rem 1.2rem 1.2rem; border-top: 1.5px solid var(--creme-escuro); background: var(--creme); }
.hist-desc { font-size: 0.88rem; color: var(--preto); line-height: 1.75; margin: 0 0 1rem; white-space: pre-line; }

.hist-membros { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.6rem; }
.hist-membro { background: var(--branco); border: 1.5px solid var(--creme-escuro); border-radius: 2px; padding: 10px 12px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 4px; }
.hist-membro-avatar { width: 48px; height: 48px; border-radius: 50%; overflow: hidden; background: var(--roxo-escuro); display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-bottom: 4px; }
.hist-membro-foto { width: 100%; height: 100%; object-fit: cover; display: block; }
.hist-membro-inicial { font-family: 'Archivo Black', sans-serif; font-size: 1.1rem; color: var(--creme); line-height: 1; }
</style>