(() => {
  'use strict';
  const button = document.getElementById('install-button');
  const help = document.getElementById('install-help');
  const instructions = document.getElementById('install-instructions');
  const standalone = window.matchMedia('(display-mode: standalone)');
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  let pendingPrompt = null;
  function syncVisibility() {
    button.hidden = standalone.matches || navigator.standalone === true;
  }
  syncVisibility();
  standalone.addEventListener('change', syncVisibility);
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    pendingPrompt = event;
    button.textContent = '♡ Instalar aplicativo';
    syncVisibility();
  });
  window.addEventListener('appinstalled', () => {
    pendingPrompt = null;
    button.hidden = true;
  });
  button.addEventListener('click', async () => {
    if (pendingPrompt) {
      const prompt = pendingPrompt;
      pendingPrompt = null;
      button.disabled = true;
      try {
        await prompt.prompt();
        const choice = await prompt.userChoice;
        if (choice.outcome === 'accepted') button.hidden = true;
        return;
      } catch {
        // Fall back to instructions if the browser rejects an expired prompt.
      } finally {
        button.disabled = false;
        button.textContent = '♡ Adicionar à tela inicial';
      }
    }
    instructions.textContent = isIOS
      ? 'No iPhone ou iPad, o iOS exige adicionar o atalho pelo menu do navegador. No Safari, toque em Compartilhar → Adicionar à Tela de Início. Ative Abrir como App da Web se aparecer e confirme em Adicionar. Se a ação estiver oculta, procure Editar Ações no fim da lista. Se também não estiver disponível ali, este botão não consegue contornar essa limitação do aparelho. Depois de adicionar, abra pelo novo ícone.'
      : 'No Chrome do Android, abra o menu ⋮ e procure Instalar aplicativo ou Adicionar à tela inicial. Se não aparecer, abra o link diretamente no Chrome e recarregue a página. Este botão abrirá a instalação quando o navegador a disponibilizar. Depois de instalar, abra pelo novo ícone.';
    help.showModal();
  });
})();
