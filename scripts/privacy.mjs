export const UPDATED = '7 November 2026'
const EMAIL = 'nameetbehera6@gmail.com'

export const PRIVACY_INTRO =
  'This page explains what personal information I collect through this website, why I use it, and the choices you have. I’ve kept it plain and specific.'

export const PRIVACY_SECTIONS = [
  {
    title: 'Who I am',
    body: `<p>This website is the personal portfolio of Nameet Kumar Behera, a student developer based in Bengaluru, Karnataka, India. I am responsible for the personal information described here. For any questions or data requests, email <a href="mailto:${EMAIL}">${EMAIL}</a>.</p>`,
  },
  {
    title: 'What I collect',
    body: `<ul>
      <li><b>When you use the contact form:</b> your name, email address, project/collaboration need, and message.</li>
      <li><b>When you message me directly:</b> whatever you send via email or WhatsApp, along with your contact details.</li>
      <li><b>When you browse this site:</b> the hosting provider (Vercel) maintains standard technical logs (including IP address) to serve pages securely. No tracking cookies are stored unless you opt in.</li>
    </ul>`,
  },
  {
    title: 'Why I use it',
    body: `<p>I use the information you provide solely to reply to your message, discuss potential projects, collaborations, or internships, and keep the site secure and functional. I do not sell or share your data for marketing purposes.</p>`,
  },
  {
    title: 'Cookies and privacy choices',
    body: `<p>This website functions without any third-party advertising or profiling cookies. If anonymous performance metrics are ever enabled, they load only after your explicit consent via the cookie banner. You can review or change your choice at any time using <b>Cookie settings</b> in the footer.</p>`,
  },
  {
    title: 'Your choices and rights',
    body: `<ul>
      <li><b>Access or deletion:</b> If you have sent me a message and wish to have your details deleted, email <a href="mailto:${EMAIL}">${EMAIL}</a> and I will promptly delete your messages from my inbox.</li>
    </ul>`,
  },
  {
    title: 'Other websites',
    body: `<p>This website links to external platforms such as GitHub and WhatsApp. These platforms maintain their own independent privacy practices, which are not governed by this policy.</p>`,
  },
  {
    title: 'Updates',
    body: `<p>If how I handle personal information changes, I will update this page and the date at the top.</p>`,
  },
]

