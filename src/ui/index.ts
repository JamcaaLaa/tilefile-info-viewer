export const div = (classes?: string[]) => element('div', classes)
export const pre = (classes?: string[]) => element('pre', classes)
export const label = (classes?: string[], forwho?: string) => {
  const el = element('label', classes)
  if (forwho)
    el.setAttribute('for', forwho)
  return el
}
export const input = (classes?: string[], type?: string) => {
  const el = element('input', classes)
  el.setAttribute('type', type ?? 'text')
  return el
}

export const element = (name: string, classes?: string[]) => {
  const el = document.createElement(name)
  if (classes)
    el.classList.add(...classes)
  return el
}
