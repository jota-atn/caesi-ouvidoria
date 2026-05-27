<script setup>
import { useRoute } from 'vue-router'
import Navbar from '../../components/Navbar.vue'

const route = useRoute()
const protocolo = route.query.protocolo || `#${new Date().getFullYear()}-????`
</script>

<template>
  <div>
    <div class="deco-star" style="top:8%;left:6%;font-size:2.2rem;animation:star-float 2.8s ease-in-out infinite;">✦</div>
    <div class="deco-star" style="top:12%;right:7%;font-size:1.1rem;opacity:0.5;animation:star-float 2.8s ease-in-out 0.6s infinite;">✦</div>
    <div class="deco-star" style="bottom:18%;left:5%;font-size:1rem;opacity:0.45;animation:star-float 2.8s ease-in-out infinite;">✦</div>
    <div class="deco-star" style="bottom:10%;right:5%;font-size:2.4rem;animation:star-float 2.8s ease-in-out 0.6s infinite;">✦</div>

    <Navbar />

    <div class="success-page">
      <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:1.1rem;color:var(--amarelo);letter-spacing:0.08em;margin-bottom:0.5rem;opacity:0.9;">
        ✦ &nbsp; ✦ &nbsp; ✦
      </div>

      <div class="speech-bubble" style="animation:pop-in 0.5s cubic-bezier(.34,1.56,.64,1) both;">
        <div style="
          width:64px;height:64px;border-radius:50%;
          background:var(--verde);
          display:flex;align-items:center;justify-content:center;
          margin:0 auto 1.2rem;
          font-size:1.8rem;
          box-shadow:3px 3px 0 var(--roxo-escuro);
        ">✓</div>

        <h1 style="font-family:'Syne',sans-serif;font-weight:800;font-size:1.6rem;color:var(--roxo-escuro);margin-bottom:0.6rem;line-height:1.2;">
          Mensagem enviada!
        </h1>

        <p style="font-size:0.92rem;color:var(--cinza);line-height:1.6;margin-bottom:1.4rem;">
          Sua mensagem foi recebida pelo CAESI. Você pode acompanhar o status pela lista de mensagens — assim que o time tratar, o status será atualizado.
        </p>

        <div style="background:var(--branco);border:2px solid var(--creme-escuro);border-radius:2px;padding:10px 14px;margin-bottom:1.5rem;text-align:left;">
          <div style="font-size:0.76rem;font-weight:700;color:var(--roxo-escuro);text-transform:uppercase;letter-spacing:0.06em;font-family:'Syne',sans-serif;margin-bottom:4px;">
            Número do protocolo
          </div>
          <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:1.1rem;color:var(--preto);letter-spacing:0.04em;">
            {{ protocolo }}
          </div>
          <div style="font-size:0.78rem;color:var(--cinza);margin-top:2px;">
            Guarde este número para referência
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:10px;">
          <RouterLink to="/aluno/mensagens" class="btn btn-primary btn-full">
            Ver minhas mensagens
          </RouterLink>
          <RouterLink to="/aluno/nova-mensagem" class="btn btn-outline btn-full">
            Enviar outra mensagem
          </RouterLink>
        </div>
      </div>

      <div style="margin-top:2.5rem;font-family:'Syne',sans-serif;font-weight:800;font-size:0.9rem;color:var(--amarelo);opacity:0.6;letter-spacing:0.08em;">
        ✦ &nbsp; ✦
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes pop-in {
  0%   { opacity: 0; transform: scale(0.85) translateY(16px); }
  70%  { transform: scale(1.04) translateY(-4px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes star-float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50%       { transform: translateY(-8px) rotate(15deg); }
}
</style>
