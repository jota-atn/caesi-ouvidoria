<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <div>
        <div class="footer-brand">CAESI <span>Ouvidoria</span></div>
        <div class="footer-brand-sub">
          Centro Acadêmico de Ciência da Computação<br>
          Universidade Federal de Campina Grande
        </div>
      </div>
      <div class="footer-links">
        <RouterLink to="/sobre" class="footer-link">Sobre</RouterLink>
        <RouterLink to="/estatuto" class="footer-link">Estatuto</RouterLink>
        <RouterLink to="/contato" class="footer-link">Contato</RouterLink>
        <a href="https://instagram.com/caesiufcg" target="_blank" rel="noopener" class="footer-link">Instagram</a>
      </div>
    </div>
    <div class="footer-copy">© {{ new Date().getFullYear() }} CAESI · Desenvolvido pelo Centro Acadêmico</div>
  </footer>
</template>
