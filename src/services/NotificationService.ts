// Serviço para exibir notificações toast
// Integra com o sistema de notificações existente do projeto

// Tipo para callback de notificação
type NotificationCallback = (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;

class NotificationServiceClass {
  private notificationCallback: NotificationCallback | null = null;

  /**
   * Registra o callback de notificação do contexto/hook
   */
  setNotificationCallback(callback: NotificationCallback): void {
    this.notificationCallback = callback;
  }

  /**
   * Exibe uma notificação de sucesso
   */
  success(message: string): void {
    this.showNotification(message, 'success');
  }

  /**
   * Exibe uma notificação de erro
   */
  error(message: string): void {
    this.showNotification(message, 'error');
  }

  /**
   * Exibe uma notificação de informação
   */
  info(message: string): void {
    this.showNotification(message, 'info');
  }

  /**
   * Exibe uma notificação de aviso
   */
  warning(message: string): void {
    this.showNotification(message, 'warning');
  }

  /**
   * Método privado para exibir notificações
   */
  private showNotification(message: string, type: 'success' | 'error' | 'info' | 'warning'): void {
    // Se há callback registrado, usar o sistema de notificações existente
    if (this.notificationCallback) {
      this.notificationCallback(message, type);
      return;
    }

    // Fallback: criar elemento de toast customizado
    this.createToastElement(message, type);
    
    // Fallback adicional para console
    console.log(`[${type.toUpperCase()}] ${message}`);
  }

  /**
   * Cria elemento de toast customizado (fallback)
   */
  private createToastElement(message: string, type: string): void {
    // Remover toasts existentes
    const existingToasts = document.querySelectorAll('.custom-toast');
    existingToasts.forEach(toast => toast.remove());

    // Criar container do toast
    const toast = document.createElement('div');
    toast.className = `custom-toast toast-${type}`;
    toast.textContent = message;

    // Estilos do toast
    Object.assign(toast.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '15px 20px',
      borderRadius: '8px',
      color: 'white',
      fontWeight: '500',
      fontSize: '14px',
      zIndex: '10000',
      maxWidth: '350px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease',
      cursor: 'pointer'
    });

    // Cores baseadas no tipo
    const colors = {
      success: '#28a745',
      error: '#dc3545', 
      info: '#17a2b8',
      warning: '#ffc107'
    };

    toast.style.backgroundColor = colors[type as keyof typeof colors] || colors.info;

    // Adicionar ao DOM
    document.body.appendChild(toast);

    // Animação de entrada
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 100);

    // Auto-remover após 4 segundos
    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
          if (toast.parentNode) {
            toast.remove();
          }
        }, 300);
      }
    }, 4000);

    // Remover ao clicar
    toast.addEventListener('click', () => {
      if (toast.parentNode) {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
          if (toast.parentNode) {
            toast.remove();
          }
        }, 300);
      }
    });
  }
}

// Exportar instância singleton
export const NotificationService = new NotificationServiceClass();