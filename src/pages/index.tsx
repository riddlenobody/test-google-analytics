import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useEffect } from 'react'

const loadedScripts: string[] = []

export function checkIsLoaded(url: string): boolean {
  return loadedScripts.indexOf(url) !== -1
}

export function load(
  url: string,
  successCallback: () => void,
  failedCallback: () => void
): void {
  if (typeof window === 'undefined') successCallback()

  const script = document.createElement('script')

  script.onload = successCallback
  script.onerror = failedCallback

  script.type = 'application/javascript'
  script.src = url
  script.async = true

  document.body.appendChild(script)
}

export async function loadScript(config: {
  url: string // loaded url
  forceLoad?: boolean // if needed load script every time, default will store the loaded status
}): Promise<void> {
  const { url, forceLoad } = config

  if (!forceLoad && checkIsLoaded(url)) {
    return Promise.resolve()
  }

  return new Promise<void>((rs, rj) => {
    let i = 0
    return load(
      url,
      () => {
        loadedScripts.push(url)
        rs()
      },
      () => {
        rj()
      }
    )
  })
}

export async function loadScriptWithRetry(
  params: Parameters<typeof loadScript>[0] & { tryTimes?: number }
) {
  const { tryTimes = 1 } = params

  let times = 1
  while (times < tryTimes + 1) {
    try {
      await loadScript(params)
      break
    } catch (e) {
      times++
    }
  }
}

export default function Home() {

  useEffect(() => {
    const cb = async () => {
      await loadScriptWithRetry({
        url: 'https://www.googletagmanager.com/gtag/js?id=G-J71HHRH64C',
        tryTimes: 2,
      })
      function gtag() {
        (window as any).dataLayer.push(arguments)
      }

      if ((window as any).dataLayer) {
        // @ts-ignore
        gtag('js', new Date())
        // @ts-ignore
        gtag('config', 'G-J71HHRH64C')

        setTimeout(() => {
          console.log('test event')
          // @ts-ignore
          gtag('event', 'pageview', {
            'app_name': 'myAppName',
            'screen_name': 'Home'
          })
        }, 5000)
      }
    }
    cb()
  }, [])

  return (
    <div>
      none
    </div>
  )
}
