// Tools and the projects they were used in, derived from Nameet's projects
import { projects } from './data/projects.js'

export function buildToolData() {
  const shadow = projects.find((p) => p.slug === 'shadow-trail')
  const salon = projects.find((p) => p.slug === 'nature-unisex-salon')

  const toolMap = [
    { name: 'Python', projects: [salon].filter(Boolean) },
    { name: 'Flask', projects: [] },
    { name: 'OpenCV', projects: [] },
    { name: 'YOLO', projects: [] },
    { name: 'SQLite', projects: [] },
    { name: 'ESP32', projects: [] },
    { name: 'Arduino IDE', projects: [] },
    { name: 'HTML / CSS', projects: [shadow].filter(Boolean) },
    { name: 'JavaScript', projects: [shadow].filter(Boolean) },
    { name: 'Git & GitHub', projects: [shadow, salon].filter(Boolean) },
    { name: 'VS Code', projects: [shadow, salon].filter(Boolean) },
  ]

  return {
    projects,
    tools: toolMap,
  }
}
