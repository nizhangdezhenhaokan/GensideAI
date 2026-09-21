<<<<<<< HEAD
export default defineContentScript({
  matches: ['*://*.google.com/*'],
  main() {},
})
=======
import { mountFinanceSidebarTrigger } from '@/lib/browseros/mountFinanceSidebarTrigger'

export default defineContentScript({
  matches: ['*://*/*'],
  runAt: 'document_idle',
  main() {
    mountFinanceSidebarTrigger()
  },
})
>>>>>>> GensideAI/lsk
