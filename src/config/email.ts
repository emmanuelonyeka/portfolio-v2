/**
 * EmailJS credentials.
 *
 * The public key is designed to be exposed, but it still belongs in the
 * environment rather than in source — and the allowed-origins list in the
 * EmailJS dashboard is what actually stops someone else draining the quota.
 *
 * See .env.example for the three variables this needs.
 */
export const emailConfig = {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID ?? '',
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? '',
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? '',
  }
  
  /** False when the env vars are missing, so the form can fail loudly instead of silently. */
  export const isEmailConfigured = () =>
    Boolean(emailConfig.serviceId && emailConfig.templateId && emailConfig.publicKey)
  