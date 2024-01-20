import defaultSettings from '@/settings'

const title = 
defaultSettings.title || '胶SDN'
export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
