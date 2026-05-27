<script setup>
import { ref } from 'vue'
import PublicNavbar from '../components/PublicNavbar.vue'
import SiteFooter from '../components/SiteFooter.vue'
import { addMensagem } from '../stores/mensagens.js'
import { isLoggedIn, isAdmin, user } from '../stores/auth.js'

const form = ref({ assunto: '', categoria: '', mensagem: '', anonimo: false })
const errors = ref({})
const charCount = ref(0)
const enviado = ref(false)
const protocolo = ref('')

function onInput(e) {
  charCount.value = e.target.value.length
}

function submit() {
  const e = {}
  if (!form.value.assunto.trim()) e.assunto = true
  if (!form.value.categoria)      e.categoria = true
  if (form.value.mensagem.trim().length < 20) e.mensagem = true
  errors.value = e
  if (Object.keys(e).length === 0) {
    const anonimo = isLoggedIn.value ? form.value.anonimo : true
    const nova = addMensagem({
      assunto: form.value.assunto,
      categoria: form.value.categoria,
      corpo: form.value.mensagem,
      anonimo,
      autor: (isLoggedIn.value && !anonimo) ? user.value.nome : 'Anônimo',
      email: isLoggedIn.value ? user.value.email : null,
      matricula: isLoggedIn.value ? user.value.matricula : null,
    })
    protocolo.value = nova.protocolo
    enviado.value = true
  }
}

function resetForm() {
  form.value = { assunto: '', categoria: '', mensagem: '', anonimo: false }
  charCount.value = 0
  enviado.value = false
}

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
  <div style="min-height:100vh;display:flex;flex-direction:column;">
    <div class="deco-star" style="top:160px;right:2%;font-size:1.4rem;opacity:0.35;">✦</div>
    <div class="deco-star" style="top:420px;left:1.5%;font-size:0.9rem;opacity:0.25;">✦</div>
    <div class="deco-star" style="top:750px;right:3%;font-size:1.1rem;opacity:0.3;">✦</div>

    <PublicNavbar />

    <!-- Hero -->
    <section class="hero">
      <div class="hero-logo">
        <img src="/logo_caesi.png" alt="CAESI" style="width:100%;height:100%;object-fit:cover;display:block;">
      </div>
      <h1 class="hero-title">CAESI <span>Ouvidoria</span></h1>
      <p class="hero-sub">
        Fale com o Centro Acadêmico de Ciência da Computação da UFCG.<br>
        Sua voz importa — envie sugestões, reclamações e elogios com ou sem login.
      </p>
      <div class="hero-actions">
        <a href="#enviar" class="btn btn-amarelo">Enviar mensagem →</a>
        <RouterLink
          v-if="!isLoggedIn"
          to="/login"
          class="btn btn-outline"
          style="color:var(--creme);border-color:rgba(242,230,196,0.4);"
        >
          Entrar na conta
        </RouterLink>
        <RouterLink
          v-else
          :to="isAdmin ? '/admin/painel' : '/aluno/mensagens'"
          class="btn btn-outline"
          style="color:var(--creme);border-color:rgba(242,230,196,0.4);"
        >
          {{ isAdmin ? 'Painel admin' : 'Minhas mensagens' }}
        </RouterLink>
      </div>
    </section>

    <!-- Como funciona -->
    <section class="home-section">
      <div class="section-label">Ouvidoria</div>
      <h2 class="section-title">Como <span>funciona</span></h2>
      <div class="steps-grid">
        <div class="step-card">
          <span class="step-number">1</span>
          <span class="step-icon">✏️</span>
          <div class="step-title">Escreva sua mensagem</div>
          <p class="step-desc">Preencha o formulário abaixo com o assunto, categoria e detalhes do que aconteceu.</p>
        </div>
        <div class="step-card">
          <span class="step-number">2</span>
          <span class="step-icon">📬</span>
          <div class="step-title">O CAESI recebe</div>
          <p class="step-desc">Nossa equipe lê e analisa cada mensagem com atenção. Você recebe um número de protocolo.</p>
        </div>
        <div class="step-card">
          <span class="step-number">3</span>
          <span class="step-icon">✅</span>
          <div class="step-title">Acompanhe o status</div>
          <p class="step-desc">Faça login a qualquer momento para ver se sua mensagem foi atendida ou está em andamento.</p>
        </div>
      </div>
    </section>

    <!-- Formulário de envio -->
    <section class="home-section" id="enviar">
      <div class="section-label">Envio direto</div>
      <h2 class="section-title">
        <template v-if="isLoggedIn">Enviar <span>mensagem</span></template>
        <template v-else>Enviar <span>anonimamente</span></template>
      </h2>

      <div class="paper">

        <div v-if="enviado" class="anon-success">
          <div class="check-circle">✓</div>
          <h3 style="font-family:'Syne',sans-serif;font-weight:800;font-size:1.3rem;color:var(--roxo-escuro);margin-bottom:0.5rem;">
            Mensagem enviada!
          </h3>
          <p style="font-size:0.9rem;color:var(--cinza);margin-bottom:1.2rem;line-height:1.6;">
            Recebemos sua mensagem. Guarde o protocolo para referência.
            <template v-if="isLoggedIn">
              Ela já aparece em
              <RouterLink :to="isAdmin ? '/admin/painel' : '/aluno/mensagens'"
                style="color:var(--roxo-escuro);font-weight:600;">
                {{ isAdmin ? 'seu painel' : 'suas mensagens' }}</RouterLink>.
            </template>
          </p>
          <div style="background:var(--branco);border:2px solid var(--creme-escuro);border-radius:2px;padding:10px 16px;display:inline-block;margin-bottom:1.5rem;">
            <div style="font-size:0.72rem;font-weight:700;color:var(--roxo-escuro);text-transform:uppercase;letter-spacing:0.06em;font-family:'Syne',sans-serif;margin-bottom:3px;">Protocolo</div>
            <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:1.1rem;color:var(--preto);">{{ protocolo }}</div>
          </div>
          <br>
          <button class="btn btn-outline btn-sm" @click="resetForm">Enviar outra mensagem</button>
        </div>

        <template v-else>

          <!-- Aviso para usuários não logados -->
          <div v-if="!isLoggedIn" style="
            background:rgba(80,64,160,0.07);
            border:2px dashed rgba(80,64,160,0.3);
            border-radius:2px;
            padding:11px 14px;
            font-size:0.86rem;
            color:var(--preto);
            margin-bottom:1.4rem;
            line-height:1.55;
          ">
            💡 Quer enviar identificado e acompanhar o status depois?
            <RouterLink to="/login" style="color:var(--roxo-escuro);font-weight:700;">Faça login</RouterLink>
            antes de enviar. Ou continue abaixo para envio anônimo.
          </div>

          <!-- Intro para usuários logados -->
          <p v-else style="font-size:0.88rem;color:var(--cinza);margin-bottom:1.5rem;line-height:1.6;">
            Olá, <strong style="color:var(--roxo-escuro);">{{ user.nome }}</strong>. Envie identificado ou marque
            "anônimo" — o CAESI não verá seu nome, mas sua mensagem ficará vinculada à sua conta para você acompanhar.
          </p>

          <form @submit.prevent="submit" novalidate>
            <div class="field">
              <label>Assunto *</label>
              <input v-model="form.assunto" type="text" placeholder="Descreva brevemente o tema" maxlength="100"
                :class="{ invalid: errors.assunto }">
              <span class="error-msg">Preencha o assunto.</span>
            </div>

            <div class="field">
              <label>Categoria *</label>
              <select v-model="form.categoria" :class="{ invalid: errors.categoria }">
                <option value="" disabled>Selecione uma categoria</option>
                <option value="matricula">Matrícula e Sistema Acadêmico</option>
                <option value="infra">Infraestrutura e Espaço Físico</option>
                <option value="docente">Corpo Docente</option>
                <option value="estagio">Estágios e Oportunidades</option>
                <option value="eventos">Eventos e Atividades</option>
                <option value="sugestao">Sugestão de Melhoria</option>
                <option value="outro">Outro</option>
              </select>
              <span class="error-msg">Selecione uma categoria.</span>
            </div>

            <div class="field">
              <label>
                Mensagem *
                <span style="font-weight:400;text-transform:none;letter-spacing:0;font-size:0.78rem;color:var(--cinza);">(mín. 20 caracteres)</span>
              </label>
              <textarea
                v-model="form.mensagem"
                placeholder="Descreva com detalhes o que aconteceu ou o que você sugere…"
                rows="5"
                maxlength="2000"
                :class="{ invalid: errors.mensagem }"
                @input="onInput"
              ></textarea>
              <span class="error-msg">
                {{ form.mensagem.trim().length === 0 ? 'A mensagem não pode estar vazia.' : 'Mínimo 20 caracteres.' }}
              </span>
              <div class="char-counter" :class="{ warn: charCount > 1800 }">{{ charCount }} / 2000</div>
            </div>

            <!-- Checkbox anônimo só para logados -->
            <label v-if="isLoggedIn" class="check-anon">
              <input type="checkbox" v-model="form.anonimo">
              <div class="check-anon-label">
                <strong>Enviar anonimamente</strong><br>
                <span style="font-size:0.8rem;opacity:0.75;">O CAESI não verá seu nome — mas você ainda verá a mensagem no seu painel</span>
              </div>
            </label>

            <!-- Aviso de privacidade para anônimo -->
            <div v-if="form.anonimo || !isLoggedIn" style="
              background:rgba(80,64,160,0.07);
              border:2px dashed rgba(80,64,160,0.3);
              border-radius:2px;
              padding:10px 14px;
              font-size:0.84rem;
              color:var(--cinza);
              margin-bottom:1.4rem;
              line-height:1.5;
            ">
              🔒 Esta mensagem será enviada de forma <strong style="color:var(--roxo-escuro);">anônima</strong> para o CAESI.
              <template v-if="isLoggedIn"> Ela ainda aparecerá no seu painel para acompanhamento.</template>
            </div>

            <div style="display:flex;justify-content:flex-end;">
              <button type="submit" class="btn btn-amarelo">
                {{ (isLoggedIn && !form.anonimo) ? 'Enviar mensagem →' : 'Enviar anonimamente →' }}
              </button>
            </div>
          </form>
        </template>
      </div>
    </section>

    <!-- Instagram -->
    <section class="home-section">
      <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:2rem;flex-wrap:wrap;gap:12px;">
        <div>
          <div class="section-label">Redes sociais</div>
          <h2 class="section-title" style="margin-bottom:0;">Últimas do <span>Instagram</span></h2>
        </div>
        <a href="https://instagram.com/caesiufcg" target="_blank" rel="noopener"
          class="btn btn-outline btn-sm" style="color:var(--creme);border-color:rgba(242,230,196,0.35);">
          Ver perfil →
        </a>
      </div>
      <div class="insta-grid">
        <a v-for="(post, i) in posts" :key="i"
          href="https://instagram.com/caesiufcg" target="_blank" rel="noopener"
          class="insta-card">
          <div class="insta-thumb" :style="{ background: post.cor }">{{ post.icon }}</div>
          <div class="insta-caption">{{ post.caption }}</div>
          <div class="insta-date">{{ post.data }}</div>
        </a>
      </div>
    </section>

    <SiteFooter />
  </div>
</template>
