const WHATSAPP = '916360426243'
const EMAIL = 'nameetbehera6@gmail.com'

// To activate Formspree: paste your endpoint form ID here, e.g. "xpwzaqkd"
// When left empty or unchanged, the form falls back gracefully to mailto:
export const FORMSPREE_ID = ''

function summary(data) {
  return [
    `Hi Nameet, I'm ${data.name}${data.email ? ` (${data.email})` : ''}.`,
    `Need: ${data.type || 'General inquiry'}`,
    '',
    data.message,
  ].join('\n')
}

async function deliver(data) {
  if (FORMSPREE_ID && FORMSPREE_ID.trim() !== '' && FORMSPREE_ID !== 'YOUR_FORMSPREE_ID') {
    const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID.trim()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        need: data.type,
        message: data.message,
      }),
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok || json.error) throw new Error(json.error || `Formspree error ${res.status}`)
    return
  }
  // No external endpoint configured; triggers fallback
  throw new Error('Formspree endpoint not set')
}

function el(tag, attrs = {}, text = '') {
  const node = document.createElement(tag)
  Object.assign(node, attrs)
  if (text) node.textContent = text
  return node
}

export function initContact() {
  const form = document.querySelector('[data-contact-form]')
  if (!form) return

  const status = form.querySelector('[data-form-status]')
  const submit = form.querySelector('[data-submit]')
  const label = form.querySelector('[data-submit-label]')

  // Field-level messages, linked to each input through aria-describedby
  const MESSAGES = {
    name: { missing: 'Please add your name.' },
    email: { missing: 'Please add your email.', invalid: 'That email doesn’t look right. Check for typos, e.g. maya@example.com.' },
    message: { missing: 'Please tell me a little about what you are building.' },
  }
  const errorFor = (input) => form.querySelector(`[data-error-for="${input.name}"]`)
  const validate = (input) => {
    const empty = input.value.trim() === ''
    const valid = !empty && input.checkValidity()
    const msgs = MESSAGES[input.name] || {}
    const text = valid ? '' : empty ? msgs.missing : msgs.invalid || msgs.missing
    input.setAttribute('aria-invalid', String(!valid))
    const slot = errorFor(input)
    if (slot) slot.textContent = text || ''
    return valid
  }

  form.querySelectorAll('[required]').forEach((input) => {
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') validate(input)
    })
    input.addEventListener('blur', () => {
      if (input.value.trim() !== '') validate(input)
    })
  })

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    let firstInvalid = null
    let invalidCount = 0
    form.querySelectorAll('[required]').forEach((input) => {
      if (!validate(input)) {
        invalidCount++
        if (!firstInvalid) firstInvalid = input
      }
    })
    if (firstInvalid) {
      status.replaceChildren(
        el('span', { className: 'err' }, invalidCount > 1 ? `Please fix the ${invalidCount} highlighted fields.` : 'Please fix the highlighted field.'),
      )
      firstInvalid.focus()
      return
    }

    const data = Object.fromEntries(new FormData(form))
    submit.disabled = true
    label.textContent = 'Sending…'
    status.replaceChildren()

    try {
      // Bots fill the hidden honeypot field: pretend success, send nothing
      if (!data.website) await deliver(data)

      form.classList.add('is-sent')
      const firstName = data.name.trim().split(/\s+/)[0]
      status.replaceChildren(
        el('strong', {}, `Thanks, ${firstName} — message received.`),
        el('span', { className: 'muted' }, " I'll get back to you shortly. Prefer chat? Ping me on WhatsApp anytime."),
      )
    } catch {
      // Hand off to email / WhatsApp with the message prefilled
      const text = summary(data)
      status.replaceChildren(
        el('span', { className: 'err' }, "Couldn't send automatically. "),
        document.createTextNode('Send it instantly via '),
        el('a', { href: `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, target: '_blank', rel: 'noopener' }, 'WhatsApp'),
        document.createTextNode(' or '),
        el('a', { href: `mailto:${EMAIL}?subject=${encodeURIComponent(`Project inquiry — ${data.name}`)}&body=${encodeURIComponent(text)}` }, 'email'),
        document.createTextNode(' — your message is already filled in.'),
      )
    } finally {
      submit.disabled = false
      label.textContent = 'Send message'
    }
  })

  // Copy-email button
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    const copyLabel = btn.querySelector('[data-copy-label]')
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy)
        copyLabel.textContent = 'Copied to clipboard'
        setTimeout(() => (copyLabel.textContent = 'Copy email'), 2200)
      } catch {
        window.location.href = `mailto:${btn.dataset.copy}`
      }
    })
  })
}

