//biblioteca do tensorFlow
import "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core@4.2.0/dist/tf-core.min.js"
//aceleração das CPUs (Processamento)
import "https://unpkg.com/@tensorflow/tfjs-backend-webgl@3.7.0/dist/tf-backend-webgl.min.js"
// bibliote das poses das mãos
import "https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/hands.min.js"
// biblioteca das mãos
import "https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection@2.0.0/dist/hand-pose-detection.min.js"
//biblioteca postura dos dedos (quem vai manipular os resultados do tensorFlow)
//por conta dessa biblioteca dispensamos calculos matematicos
import "https://cdn.jsdelivr.net/npm/fingerpose@0.1.0/dist/fingerpose.min.js"

import HandGestureController from "../controllers/handGestureController.js"
import HandGestureService from "../services/handGestureService.js"
import HandGestureView from "../views/handGestureView.js"

import Camera from "/classes/class02/pages/lib/shared/camera.js"
const camera = await Camera.init()


const [rootPath] = window.location.href.split('/pages/')
const factory = {
  async initalize() {
    return HandGestureController.initialize({
      view: new HandGestureView(),
      service: new HandGestureService({
        fingerpose: window.fp,
        handPoseDetection: window.handPoseDetection,
        handsVersion: window.VERSION
      })
    })
  }
}

export default factory