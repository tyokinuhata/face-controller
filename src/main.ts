document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <h1>face-controller</h1>
  <video id="webcam" autoplay playsinline style="transform: scaleX(-1);"></video>
`

async function setupCamera() {
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
  console.log('Camera access granted')
}

setupCamera()
