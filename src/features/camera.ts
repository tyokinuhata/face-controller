export async function setupCamera(): Promise<HTMLVideoElement | undefined> {
  const video = document.querySelector<HTMLVideoElement>('#webcam')!

  let stream
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 }
    })
  } catch (error) {
    console.error('Error accessing camera:', error)
    return
  }

  video.srcObject = stream
  return video
}

export async function waitForVideoReady(video: HTMLVideoElement): Promise<void> {
  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) return

  return new Promise((resolve) => {
    video.addEventListener('loadeddata', () => resolve(), { once: true })
  })
}
